import { create } from 'zustand';

export type SoundId = 'rain' | 'cafe' | 'forest';

export interface SoundState {
  id: SoundId;
  active: boolean;
  volume: number; // 0.0 to 1.0
}

interface OrbitState {
  isTimerRunning: boolean;
  remainingSeconds: number; // 15:32 is 932s
  sounds: Record<SoundId, SoundState>;
  
  toggleTimer: () => void;
  setTimerRunning: (isRunning: boolean) => void;
  decrementTimer: () => void;
  toggleSound: (id: SoundId) => void;
  setVolume: (id: SoundId, volume: number) => void;
}

export const useOrbitStore = create<OrbitState>((set) => ({
  isTimerRunning: false, // Default to false wait for actual click
  remainingSeconds: 15 * 60 + 32, // 932s
  sounds: {
    rain: { id: 'rain', active: false, volume: 0.5 },
    cafe: { id: 'cafe', active: false, volume: 0.5 },
    forest: { id: 'forest', active: false, volume: 0.5 },
  },

  toggleTimer: () =>
    set((state) => ({ isTimerRunning: !state.isTimerRunning })),
    
  setTimerRunning: (isRunning) =>
    set({ isTimerRunning: isRunning }),

  decrementTimer: () =>
    set((state) => ({ 
      remainingSeconds: state.remainingSeconds > 0 ? state.remainingSeconds - 1 : 0 
    })),

  toggleSound: (id) =>
    set((state) => ({
      sounds: {
        ...state.sounds,
        [id]: {
          ...state.sounds[id],
          active: !state.sounds[id].active,
        },
      },
    })),

  setVolume: (id, volume) =>
    set((state) => ({
      sounds: {
        ...state.sounds,
        [id]: {
          ...state.sounds[id],
          volume,
        },
      },
    })),
}));
