"use client";

import { useEffect, useRef } from "react";
import { useOrbitStore } from "@/store/useOrbitStore";
import { useFocusSessions } from "@/hooks/useFocusSessions";

export default function OrbitEngine() {
  const sessionState = useOrbitStore((s) => s.sessionState);
  const remainingSeconds = useOrbitStore((s) => s.remainingSeconds);
  const decrementTimer = useOrbitStore((s) => s.decrementTimer);
  const sounds = useOrbitStore((s) => s.sounds);
  const isBreakMode = useOrbitStore((s) => s.isBreakMode);
  const { saveSession } = useFocusSessions();

  const rainRef = useRef<HTMLAudioElement | null>(null);
  const cafeRef = useRef<HTMLAudioElement | null>(null);
  const forestRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (sessionState !== "running" || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState, remainingSeconds, decrementTimer]);

  useEffect(() => {
    const syncAudio = (
      ref: React.MutableRefObject<HTMLAudioElement | null>,
      soundState: { active: boolean; volume: number; id: string }
    ) => {
      if (!ref.current) return;

      ref.current.volume = soundState.volume;

      if (soundState.active && sessionState === "running") {
        if (ref.current.paused) {
          ref.current
            .play()
            .catch((e) =>
              console.error(`Error playing ${soundState.id} audio:`, e)
            );
        }
      } else {
        if (!ref.current.paused) {
          ref.current.pause();
        }
      }
    };

    syncAudio(rainRef, sounds.rain);
    syncAudio(cafeRef, sounds.cafe);
    syncAudio(forestRef, sounds.forest);
  }, [sounds, sessionState]);

  const prevSessionState = useRef(sessionState);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (sessionState === "finished" && prevSessionState.current !== "finished") {

      // Stop any previous alarm
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
      }

      const alarm = new Audio("/audio/alarm.mp3");
      alarmRef.current = alarm;
      alarm
        .play()
        .catch((e) => console.error("Could not play alarm", e));

      const sendNotification = async () => {
        if (!("Notification" in window)) return;
        try {
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }
          if (Notification.permission === "granted") {
            const titleMsg = isBreakMode ? "Break Selesai!" : "Sesi Orbit Selesai!";
            const bodyMsg = isBreakMode ? "Waktunya fokus kembali!" : "Bagus banget! Waktunya istirahat sejenak!";
            
            new Notification(titleMsg, {
              body: bodyMsg,
              icon: "/images/logo.webp",
            });
          }
        } catch (e) {
          console.warn("Notification failed:", e);
        }
      };
      sendNotification();

      // Stop all ambient sounds
      useOrbitStore.getState().stopAllSounds();

      // Save the completed session to Firestore (only if it was a focus session)
      if (!isBreakMode) {
        const totalElapsed = useOrbitStore.getState().getElapsedTotal();
        const title = useOrbitStore.getState().sessionTitle;
        if (totalElapsed > 0) {
          saveSession(totalElapsed, 'COMPLETED', title);
        }
      }
    }
    prevSessionState.current = sessionState;
  }, [sessionState, isBreakMode]);

  // Invisible audio elements rendered at the root level
  return (
    <div style={{ display: "none" }} aria-hidden="true">
      <audio ref={rainRef} src="/audio/rain.mp3" loop preload="none" />
      <audio ref={cafeRef} src="/audio/cafe.mp3" loop preload="none" />
      <audio ref={forestRef} src="/audio/forest.mp3" loop preload="none" />
    </div>
  );
}
