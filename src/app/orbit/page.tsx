"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import AudioMixer from "@/components/orbit/AudioMixer";
import { useOrbitStore, SoundId } from "@/store/useOrbitStore";
import { DndContext, DragEndEvent, DragStartEvent, useSensors, useSensor, PointerSensor, KeyboardSensor, DragOverlay } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DraggableSoundIcon, DroppableOrbitZone, OrbitingSatellite, getIconMap } from "@/components/orbit/OrbitComponents";

export default function OrbitPage() {
  const { sounds, isTimerRunning, toggleTimer, toggleSound, remainingSeconds, decrementTimer } = useOrbitStore();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingSeconds, decrementTimer]);

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

  const activeSounds = Object.values(sounds).filter(s => s.active);

  const getMixWidth = (volume: number, isActive: boolean) => 
    isActive ? `${(volume / 1.0) * 100}%` : '0%';

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <AppLayout
        rightPanel={
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl mb-4 text-text-primary">Today&apos;s Training</h3>
                <button className="text-text-secondary hover:text-primary">
                  <span className="text-lg">⚙️</span>
                </button>
              </div>
              
              <div className="flex justify-around mb-6">
                <DraggableSoundIcon id="rain" label="Rain" colorClass="text-secondary" bgClass="bg-secondary-light border-secondary" />
                <DraggableSoundIcon id="cafe" label="Cafe" colorClass="text-primary" bgClass="bg-primary-light border-primary" />
                <DraggableSoundIcon id="forest" label="Forest" colorClass="text-success" bgClass="bg-success-light border-success" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-text-label">Mix Status</span>
                  <span className="text-xs font-bold text-primary">
                    {activeSounds.length > 0 ? "Active" : "Silent"}
                  </span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-secondary transition-all" style={{ width: getMixWidth(sounds.rain.volume, sounds.rain.active) }}></div>
                  <div className="bg-primary transition-all" style={{ width: getMixWidth(sounds.cafe.volume, sounds.cafe.active) }}></div>
                  <div className="bg-success transition-all" style={{ width: getMixWidth(sounds.forest.volume, sounds.forest.active) }}></div>
                </div>
              </div>
            </Card>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] md:min-h-[600px]">
          <Card variant="container" className="w-full max-w-2xl flex flex-col items-center p-8 md:p-12 relative overflow-hidden">
            
            <AudioMixer />

            <DroppableOrbitZone>
              {/* Center Planet / Timer */}
              <div className={`w-[150px] h-[150px] md:w-[180px] md:h-[180px] bg-primary rounded-full flex flex-col items-center justify-center text-white z-10 transition-shadow duration-500
                ${isTimerRunning ? 'shadow-[0_8px_32px_rgba(255,150,0,0.4)]' : 'shadow-none opacity-80'}
              `}>
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                  {formatTime(remainingSeconds)}
                </span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90 mt-1">Remaining</span>
              </div>

              {/* Orbiting Elements (Dynamic) */}
              {activeSounds.map((sound, index) => (
                <OrbitingSatellite 
                  key={sound.id} 
                  id={sound.id} 
                  index={index} 
                  total={activeSounds.length} 
                  timerLengthSecs={15} 
                />
              ))}
            </DroppableOrbitZone>

            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2 text-center">
              {isTimerRunning ? 'Deep Work Orbit' : 'Session Paused'}
            </h2>
            <p className="text-sm md:text-base text-text-secondary mb-8 text-center max-w-md">
              {isTimerRunning ? "You're orbiting success! Keep the momentum going." : "Take a deep breath. Ready when you are."}
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Button className="w-full md:w-auto" onClick={() => toggleTimer()}>
                {isTimerRunning ? 'Pause Session' : 'Resume Session'}
              </Button>
              <Button variant="ghost" className="w-full md:w-auto bg-gray-100 border border-border">Skip</Button>
            </div>
          </Card>
        </div>
      </AppLayout>
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
