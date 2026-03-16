"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import TimerDurationCard from "@/components/orbit/TimerDurationCard";
import { useOrbitStore, SoundId } from "@/store/useOrbitStore";
import { DndContext, DragEndEvent, DragStartEvent, useSensors, useSensor, PointerSensor, KeyboardSensor, DragOverlay } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DraggableSoundIcon, DroppableOrbitZone, OrbitingSatellite, getIconMap } from "@/components/orbit/OrbitComponents";
import { useFocusSessions } from "@/hooks/useFocusSessions";
import { SoundState } from "@/store/useOrbitStore";
import { Pencil, Check, X } from "lucide-react";

export default function OrbitPage() {
  const { sounds, sessionState, toggleTimer, toggleSound, remainingSeconds, resetSession, getElapsedTotal, sessionTitle, setSessionTitle } = useOrbitStore();
  const { saveSession } = useFocusSessions();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(sessionTitle);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<"day" | "evening" | "night">("day");

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 15) setTimeOfDay("day");
      else if (hour >= 15 && hour < 18) setTimeOfDay("evening");
      else setTimeOfDay("night");
    };
    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    useOrbitStore.setState({ remainingSeconds: 0, sessionState: 'finished' });
  };

  const handleToggle = () => {
    if (sessionState === 'running') {
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
    if ("Notification" in window && Notification.permission !== "granted") {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn("Notification permission request failed:", e);
      }
    }
    toggleTimer();
  };

  const handleResetOrbit = () => {
    resetSession();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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
      if (!sounds[soundId].active) toggleSound(soundId);
    } else {
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
      case "day": return { background: "linear-gradient(180deg, #8ad1ff 0%, #f0f8ff 100%)", color: "#1e293b" };
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
        <motion.div
          className="flex flex-col items-center justify-center px-2 py-4 md:p-6 h-full -mt-4"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card variant="container" className={`w-full max-w-2xl flex flex-col items-center p-8 pt-12 md:p-20 relative overflow-visible transition-all duration-1000 ${isNight ? 'bg-white/10! backdrop-blur-xl border-white/20 text-white shadow-2xl' : 'bg-white/60! backdrop-blur-xl border border-white/60 shadow-2xl'}`}>
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
                  <button onClick={handleSaveTitle} className="p-1 hover:text-success transition-colors" title="Save">
                    <Check size={24} />
                  </button>
                  <button onClick={handleCancelTitle} className="p-1 hover:text-danger transition-colors" title="Cancel">
                    <X size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group mb-2 flex items-center justify-center w-full min-w-0">
                {/* Left Spacer to balance the Edit Button on the right */}
                <div className="w-8 h-8 shrink-0 invisible" aria-hidden="true" />
                
                <h2 
                  className={`text-xl md:text-3xl font-extrabold transition-colors px-2 truncate max-w-full mt-4 ${isNight ? 'text-white' : 'text-text-primary'}`}
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
            <p className={`text-sm md:text-base mb-2 md:mb-8 text-center max-w-md transition-colors ${isNight ? 'text-gray-300' : 'text-text-secondary'}`}>
              {sessionState === 'idle' && "Ready to enter your focus orbit."}
              {sessionState === 'running' && "You're orbiting success! Keep the momentum going."}
              {sessionState === 'paused' && "Take a deep breath. Ready when you are."}
              {sessionState === 'finished' && "Masterful deep work! Take a refreshing break today."}
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-2">
              {sessionState === 'idle' && (
                <Button variant="primary" className="w-full md:w-auto" onClick={handleStartSession}>
                  START SESSION
                </Button>
              )}
              
              {(sessionState === 'running' || sessionState === 'paused') && (
                <>
                  <Button variant="primary" className="w-full md:w-auto" onClick={handleToggle}>
                    {sessionState === 'running' ? 'PAUSE SESSION' : 'RESUME SESSION'}
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto" onClick={handleSkip}>
                    SKIP
                  </Button>
                </>
              )}

              {sessionState === 'finished' && (
                <Button variant="primary" className="w-full md:w-auto" onClick={handleResetOrbit}>
                  RESET ORBIT
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
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
