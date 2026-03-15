"use client";

import { useEffect, useRef } from 'react';
import { useOrbitStore } from '@/store/useOrbitStore';

export default function AudioMixer() {
  const { sounds, sessionState } = useOrbitStore();
  
  const rainAudioRef = useRef<HTMLAudioElement>(null);
  const cafeAudioRef = useRef<HTMLAudioElement>(null);
  const forestAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const syncAudio = (
      ref: React.RefObject<HTMLAudioElement | null>, 
      soundState: { active: boolean; volume: number; id: string }
    ) => {
      if (!ref.current) return;
      
      // Update Volume
      ref.current.volume = soundState.volume;
      
      // Play / Pause
      if (soundState.active && sessionState === 'running') {
        if (ref.current.paused) {
          ref.current.play().catch(e => console.error(`Error playing ${soundState.id} audio:`, e));
        }
      } else {
        if (!ref.current.paused) {
          ref.current.pause();
        }
      }
    };

    syncAudio(rainAudioRef, sounds.rain);
    syncAudio(cafeAudioRef, sounds.cafe);
    syncAudio(forestAudioRef, sounds.forest);
    
  }, [sounds, sessionState]);

  return (
    <div style={{ display: 'none' }}>
      <audio ref={rainAudioRef} src="/audio/rain.mp3" loop />
      <audio ref={cafeAudioRef} src="/audio/cafe.mp3" loop />
      <audio ref={forestAudioRef} src="/audio/forest.mp3" loop />
    </div>
  );
}
