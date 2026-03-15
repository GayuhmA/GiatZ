"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import AudioMixer from "@/components/orbit/AudioMixer";
import TimerDurationCard from "@/components/orbit/TimerDurationCard";
import { useOrbitStore, SoundId } from "@/store/useOrbitStore";
import { DndContext, DragEndEvent, DragStartEvent, useSensors, useSensor, PointerSensor, KeyboardSensor, DragOverlay } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DraggableSoundIcon, DroppableOrbitZone, OrbitingSatellite, getIconMap } from "@/components/orbit/OrbitComponents";
import { useFocusSessions } from "@/hooks/useFocusSessions";
import { SoundState } from "@/store/useOrbitStore";
import { Pencil, Check, X } from "lucide-react";

export default function OrbitPage() {
  const { sounds, sessionState, toggleTimer, toggleSound, remainingSeconds, decrementTimer, sessionLengthSecs, resetSession, stopAllSounds, setSessionState, getElapsedTotal, sessionTitle, setSessionTitle } = useOrbitStore();
  const { saveSession } = useFocusSessions();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(sessionTitle);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "night">("morning");
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const hasHandledFinished = useRef(false);

  // Stop alarm helper
  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      alarmRef.current = null;
    }
  }, []);

  // Cleanup on unmount: stop alarm and reset session if finished
  useEffect(() => {
    return () => {
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
        alarmRef.current = null;
      }
      // Reset to idle so alarm doesn't re-trigger when coming back
      const currentState = useOrbitStore.getState().sessionState;
      if (currentState === 'finished') {
        useOrbitStore.setState({ 
          sessionState: 'idle', 
          remainingSeconds: useOrbitStore.getState().sessionLengthSecs 
        });
      }
    };
  }, []);

  // Handle finished state — only fire once per finish event
  useEffect(() => {
    if (sessionState === 'finished' && !hasHandledFinished.current) {
      hasHandledFinished.current = true;
      stopAlarm();
      const audio = new Audio('/audio/alarm.mp3');
      alarmRef.current = audio;
      audio.play().catch(e => console.error("Could not play alarm", e));
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Orbit Session Complete!", { body: "Great job. Time to take a break!" });
      }
      
      // Save completed session to Firestore
      const totalElapsed = getElapsedTotal();
      if (totalElapsed > 0) {
        saveSession(totalElapsed, 'COMPLETED', sessionTitle);
      }
      
      stopAllSounds();
    } else if (sessionState !== 'finished') {
      hasHandledFinished.current = false;
    }
  }, [sessionState, stopAllSounds, stopAlarm]);

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay("morning");
      else if (hour >= 12 && hour < 17) setTimeOfDay("afternoon");
      else if (hour >= 17 && hour < 19) setTimeOfDay("evening");
      else setTimeOfDay("night");
    };
    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'running' && remainingSeconds > 0) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState, remainingSeconds, decrementTimer]);

  const handleSkip = () => {
    // Save as COMPLETED before resetting state
    const totalElapsed = getElapsedTotal();
    if (totalElapsed > 0) {
      saveSession(totalElapsed, 'COMPLETED', sessionTitle);
    }
    useOrbitStore.setState({ remainingSeconds: 0, sessionState: 'finished' });
  };

  const handleToggle = () => {
    if (sessionState === 'running') {
      // About to pause: log as interrupted
      const totalElapsed = getElapsedTotal();
      if (totalElapsed > 0) {
        saveSession(totalElapsed, 'INTERRUPTED', sessionTitle);
      }
    }
    toggleTimer();
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      setSessionTitle(editedTitle.trim());
    } else {
      setEditedTitle(sessionTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditedTitle(sessionTitle);
    setIsEditingTitle(false);
  };

  const handleStartSession = async () => {
    // Request notification permission on first user gesture
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    toggleTimer();
  };

  const handleResetOrbit = () => {
    stopAlarm();
    resetSession();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Ensures clicks act normally and don't trigger drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { over, active } = event;
    const soundId = active.data.current?.id as SoundId;
    if (!soundId) return;

    if (over && over.id === 'orbit-zone') {
      // Toggle sound ON if dropped in orbit zone
      if (!sounds[soundId].active) toggleSound(soundId);
    } else {
      // Toggle sound OFF if dropped OUTSIDE orbit zone
      if (sounds[soundId].active) toggleSound(soundId);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const activeSounds = (Object.values(sounds) as SoundState[]).filter(s => s.active);

  const getMixWidth = (volume: number, isActive: boolean) => 
    isActive ? `${(volume / 1.0) * 100}%` : '0%';

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (timeOfDay) {
      case "morning": return { background: "linear-gradient(180deg, #8ad1ff 0%, #f0f8ff 100%)", color: "#1e293b" };
      case "afternoon": return { background: "linear-gradient(180deg, #ff6b3d 0%, #ffe7bd 100%)", color: "#78350f" };
      case "evening": return { background: "linear-gradient(180deg, #f97316 0%, #ffdfba 100%)", color: "#451a03" };
      case "night": return { background: "linear-gradient(180deg, #0a1128 0%, #4e184c 100%)", color: "#ffffff" };
    }
  };

  const isNight = timeOfDay === "night";

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={getBackgroundStyle()} className="h-screen w-full transition-all duration-1000 overflow-hidden">
        <AppLayout
          bgClassName="bg-transparent"
          rightPanelClassName="bg-transparent border-none xl:pr-6"
          rightPanel={
            <div className="space-y-6">
              <Card className={isNight ? "bg-white/10! border-white/20 backdrop-blur-md" : "bg-white/50! border border-white/50 backdrop-blur-md shadow-lg"}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold text-xl mb-4 ${isNight ? 'text-white' : 'text-text-primary'}`}>Sound Mixer</h3>
              </div>
              
              <div className="flex justify-around mb-6">
                <DraggableSoundIcon id="rain" label="Rain" colorClass="text-secondary" bgClass="bg-secondary-light border-secondary" />
                <DraggableSoundIcon id="cafe" label="Cafe" colorClass="text-cafe" bgClass="bg-cafe-light border-cafe" />
                <DraggableSoundIcon id="forest" label="Forest" colorClass="text-success" bgClass="bg-success-light border-success" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold uppercase ${isNight ? 'text-gray-300' : 'text-text-label'}`}>Mix Status</span>
                  <span className="text-xs font-bold text-primary">
                    {activeSounds.length > 0 ? "Active" : "Silent"}
                  </span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100/30">
                  <div className="bg-secondary transition-all" style={{ width: getMixWidth(sounds.rain.volume, sounds.rain.active) }}></div>
                  <div className="bg-cafe transition-all" style={{ width: getMixWidth(sounds.cafe.volume, sounds.cafe.active) }}></div>
                  <div className="bg-success transition-all" style={{ width: getMixWidth(sounds.forest.volume, sounds.forest.active) }}></div>
                </div>
              </div>
            </Card>

            <TimerDurationCard className={isNight ? "bg-white/10! border-white/20 backdrop-blur-md text-white" : "bg-white/50! border border-white/50 backdrop-blur-md shadow-lg"} />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center p-4 md:p-6 h-full -mt-4">
          <Card variant="container" className={`w-full max-w-2xl flex flex-col items-center p-8 md:p-12 relative overflow-hidden transition-all duration-1000 ${isNight ? 'bg-white/10! backdrop-blur-xl border-white/20 text-white shadow-2xl' : 'bg-white/60! backdrop-blur-xl border border-white/60 shadow-2xl'}`}>
            
            <AudioMixer />

            <DroppableOrbitZone>
              {/* Center Planet / Timer */}
              <div className={`w-[150px] h-[150px] md:w-[180px] md:h-[180px] bg-primary rounded-full flex flex-col items-center justify-center text-white z-10 transition-shadow duration-500
                ${sessionState === 'running' ? 'shadow-[0_8px_32px_rgba(255,150,0,0.4)]' : 'shadow-none opacity-80'}
              `}>
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                  {formatTime(remainingSeconds)}
                </span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90 mt-1">Remaining</span>
              </div>

              {/* Orbiting Elements (Dynamic) */}
              {activeSounds.map((sound: SoundState, index: number) => (
                <OrbitingSatellite 
                  key={sound.id} 
                  id={sound.id} 
                  index={index} 
                  total={activeSounds.length} 
                  timerLengthSecs={20} 
                />
              ))}
            </DroppableOrbitZone>

            {isEditingTitle && sessionState === 'idle' ? (
              <div className="flex items-center gap-2 mb-2 w-full max-w-md px-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className={`flex-1 min-w-0 bg-transparent border-b-2 border-primary text-2xl md:text-3xl font-extrabold text-center focus:outline-none transition-colors ${isNight ? 'text-white' : 'text-text-primary'}`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') handleCancelTitle();
                  }}
                />
                <div className="flex shrink-0 gap-1">
                  <button onClick={handleSaveTitle} className="p-1 hover:text-primary transition-colors" title="Save">
                    <Check size={24} />
                  </button>
                  <button onClick={handleCancelTitle} className="p-1 hover:text-red-500 transition-colors" title="Cancel">
                    <X size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group mb-2 flex items-center justify-center w-full">
                {/* Left Spacer to balance the Edit Button on the right */}
                <div className="w-8 h-8 shrink-0 invisible" aria-hidden="true" />
                
                <h2 
                  className={`text-2xl md:text-3xl font-extrabold transition-colors px-2 ${isNight ? 'text-white' : 'text-text-primary'}`}
                >
                  {sessionState === 'idle' && sessionTitle}
                  {sessionState === 'running' && sessionTitle}
                  {sessionState === 'paused' && 'Session Paused'}
                  {sessionState === 'finished' && 'Session Complete!'}
                </h2>
                
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  {sessionState === 'idle' && (
                    <button 
                      onClick={() => {
                        setEditedTitle(sessionTitle);
                        setIsEditingTitle(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-primary"
                      title="Edit Title"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                </div>
              </div>
            )}
            <p className={`text-sm md:text-base mb-8 text-center max-w-md transition-colors ${isNight ? 'text-gray-300' : 'text-text-secondary'}`}>
              {sessionState === 'idle' && "Ready to enter your focus orbit."}
              {sessionState === 'running' && "You're orbiting success! Keep the momentum going."}
              {sessionState === 'paused' && "Take a deep breath. Ready when you are."}
              {sessionState === 'finished' && "Masterful deep work! Take a refreshing break today."}
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-2">
              {sessionState === 'idle' && (
                <Button className="w-full md:w-auto px-10 py-3 rounded-full font-bold shadow-lg" onClick={handleStartSession}>
                  START SESSION
                </Button>
              )}
              
              {(sessionState === 'running' || sessionState === 'paused') && (
                <>
                  <Button className="w-full md:w-auto px-10 py-3 rounded-full font-bold shadow-lg" onClick={handleToggle}>
                    {sessionState === 'running' ? 'PAUSE SESSION' : 'RESUME SESSION'}
                  </Button>
                  <Button onClick={handleSkip} variant="ghost" className={`w-full md:w-auto bg-white/20 px-8 py-3 rounded-full font-bold shadow-sm backdrop-blur-sm border ${isNight ? 'border-white/20 text-white hover:bg-white/30' : 'border-black/5 text-text-primary hover:bg-white/40'}`}>SKIP</Button>
                </>
              )}

              {sessionState === 'finished' && (
                <Button className="w-full md:w-auto px-10 py-3 rounded-full font-bold" onClick={handleResetOrbit}>
                  RESET ORBIT
                </Button>
              )}
            </div>
          </Card>
        </div>
      </AppLayout>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDragId && activeDragId.startsWith('sound-') ? (
          <div className="w-12 h-12 rounded-full border-2 border-primary ring-2 ring-primary ring-offset-2 flex items-center justify-center bg-white shadow-2xl scale-110">
            {getIconMap(activeDragId.replace('sound-', ''), "w-6 h-6 text-primary")}
          </div>
        ) : activeDragId && activeDragId.startsWith('satellite-') ? (
          <div className="w-10 h-10 rounded-full bg-white border-2 border-primary shadow-2xl flex items-center justify-center text-primary scale-125">
             {getIconMap(activeDragId.replace('satellite-', ''), "w-5 h-5")}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
