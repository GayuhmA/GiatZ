"use client";

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { useOrbitStore, SoundId } from '@/store/useOrbitStore';
import { ReactNode } from 'react';
import { CloudRain, Coffee, Trees, Star } from 'lucide-react';

export const getIconMap = (id: string, className = "w-6 h-6") => {
  switch (id) {
    case 'rain': return <CloudRain className={className} strokeWidth={2.5} />;
    case 'cafe': return <Coffee className={className} strokeWidth={2.5} />;
    case 'forest': return <Trees className={className} strokeWidth={2.5} />;
    default: return <Star className={className} strokeWidth={2.5} />;
  }
};

interface DraggableSoundIconProps {
  id: SoundId;
  label: string;
  colorClass: string;
  bgClass: string;
}

export function DraggableSoundIcon({ id, label, colorClass, bgClass }: DraggableSoundIconProps) {
  const { sounds, toggleSound } = useOrbitStore();
  const isActive = sounds[id].active;

  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `sound-${id}`,
    data: { id, type: 'sound' },
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : undefined,
  } : undefined;

  return (
    <div className="flex flex-col items-center gap-2 relative z-50">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        onClick={() => { if (!isDragging) toggleSound(id); }}
        className={`w-12 h-12 rounded-full border-2 cursor-grab active:cursor-grabbing flex items-center justify-center transition-all touch-none
          ${colorClass} ${bgClass}
          ${isDragging ? 'opacity-90 scale-110 shadow-lg' : ''}
          ${isActive ? 'ring-2 ring-offset-2 ring-primary border-primary opacity-30 grayscale' : ''}
        `}
      >
        {getIconMap(id, "w-6 h-6")}
      </div>
      <span className="text-xs font-bold uppercase text-text-label">{label}</span>
      {isActive && <span className="absolute -bottom-4 text-[10px] text-primary font-bold">ACTIVE</span>}
    </div>
  );
}

interface DroppableOrbitZoneProps {
  children: ReactNode;
}

export function DroppableOrbitZone({ children }: DroppableOrbitZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'orbit-zone',
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`relative w-62.5 h-62.5 md:w-75 md:h-75 flex items-center justify-center mb-8 rounded-full transition-colors ${isOver ? 'bg-primary/20' : ''}`}
    >
      {/* Orbit Path */}
      <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-colors ${isOver ? 'border-primary opacity-100' : 'border-primary opacity-40'}`}></div>
      {children}
    </div>
  );
}

interface OrbitingSatelliteProps {
  id: SoundId;
  index: number;
  total: number;
  timerLengthSecs?: number; 
}

export function OrbitingSatellite({ id, index, total, timerLengthSecs = 15 }: OrbitingSatelliteProps) {
  const { isTimerRunning, toggleSound } = useOrbitStore();
  
  const offsetAngle = (360 / total) * index;
  
  // Make the satellite draggable out of the orbit
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `satellite-${id}`,
    data: { id, type: 'satellite' },
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;
  
  return (
    <motion.div
      initial={{ rotate: offsetAngle }}
      animate={{ rotate: isTimerRunning && !isDragging ? offsetAngle + 360 : offsetAngle }}
      transition={{ 
        duration: timerLengthSecs, 
        ease: "linear", 
        repeat: Infinity,
        repeatType: "loop",
        bounce: 0
      }}
      className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center z-50 origin-center"
    >
      <div 
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`absolute w-10 h-10 rounded-full bg-white border-2 border-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-primary cursor-grab active:cursor-grabbing touch-none
                   ${isDragging ? 'scale-125 shadow-xl opacity-90' : ''}`}
        style={{ ...(style || {}), transform: transform ? CSS.Translate.toString(transform) : `translate(-50%, -50%) translateY(-145px) rotate(-${offsetAngle}deg)` }}
      >
        {getIconMap(id, "w-5 h-5")}
      </div>
    </motion.div>
  );
}
