import { create } from 'zustand';

export type SoundId = 'rain' | 'cafe' | 'forest';

export interface SoundState {
  id: SoundId;
  active: boolean;
  volume: number; // 0.0 to 1.0
}

export type SessionState = 'idle' | 'running' | 'paused' | 'finished';

interface OrbitState {
  sessionState: SessionState;
  sessionLengthSecs: number; // Configurable total length
  remainingSeconds: number; // 15:32 is 932s
  sounds: Record<SoundId, SoundState>;
  
  toggleTimer: () => void;
  setSessionState: (state: SessionState) => void;
  setSessionLength: (seconds: number) => void;
  decrementTimer: () => void;
  resetSession: () => void;
  toggleSound: (id: SoundId) => void;
  setVolume: (id: SoundId, volume: number) => void;
  stopAllSounds: () => void;
}

export const useOrbitStore = create<OrbitState>((set) => ({
  sessionState: 'idle', // Default to idle
  sessionLengthSecs: 50 * 60, // 50 mins default
  remainingSeconds: 50 * 60, // 50 mins initially
  sounds: {
    rain: { id: 'rain', active: false, volume: 0.5 },
    cafe: { id: 'cafe', active: false, volume: 0.5 },
    forest: { id: 'forest', active: false, volume: 0.5 },
  },

  toggleTimer: () =>
    set((state) => ({ 
      sessionState: state.sessionState === 'running' ? 'paused' : 'running'
    })),
    
  setSessionState: (newState) =>
    set({ sessionState: newState }),

  setSessionLength: (seconds) => 
    set({ sessionLengthSecs: seconds, remainingSeconds: seconds, sessionState: 'idle' }),

  resetSession: () =>
    set((state) => ({ remainingSeconds: state.sessionLengthSecs, sessionState: 'idle' })),

  decrementTimer: () =>
    set((state) => {
      const nextRemaining = state.remainingSeconds > 0 ? state.remainingSeconds - 1 : 0;
      if (nextRemaining === 0 && state.sessionState !== 'finished') {
        return { remainingSeconds: 0, sessionState: 'finished' };
      }
      return { remainingSeconds: nextRemaining };
    }),

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

  stopAllSounds: () =>
    set((state) => ({
      sounds: {
        rain: { ...state.sounds.rain, active: false },
        cafe: { ...state.sounds.cafe, active: false },
        forest: { ...state.sounds.forest, active: false },
      }
    })),
}));
