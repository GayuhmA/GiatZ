import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SoundId = 'rain' | 'cafe' | 'forest';

export interface SoundState {
  id: SoundId;
  active: boolean;
  volume: number; // 0.0 to 1.0
}

export type SessionState = 'idle' | 'running' | 'paused' | 'finished';

interface OrbitState {
  sessionState: SessionState;
  sessionLengthSecs: number;
  remainingSeconds: number;
  sessionStartedAt: number | null;
  elapsedSecs: number;
  sessionTitle: string;
  sounds: Record<SoundId, SoundState>;
  
  toggleTimer: () => void;
  setSessionState: (state: SessionState) => void;
  setSessionLength: (seconds: number) => void;
  setSessionTitle: (title: string) => void;
  decrementTimer: () => void;
  resetSession: () => void;
  toggleSound: (id: SoundId) => void;
  setVolume: (id: SoundId, volume: number) => void;
  stopAllSounds: () => void;
  getElapsedTotal: () => number;
}

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      sessionState: 'idle',
      sessionLengthSecs: 50 * 60,
      remainingSeconds: 50 * 60,
      sessionStartedAt: null,
      elapsedSecs: 0,
      sessionTitle: 'Deep Work Orbit',
      sounds: {
        rain: { id: 'rain', active: false, volume: 0.5 },
        cafe: { id: 'cafe', active: false, volume: 0.5 },
        forest: { id: 'forest', active: false, volume: 0.5 },
      },

  toggleTimer: () =>
    set((state) => {
      if (state.sessionState === 'running') {
        // Pausing: accumulate elapsed time
        const now = Date.now();
        const additionalElapsed = state.sessionStartedAt 
          ? Math.floor((now - state.sessionStartedAt) / 1000) 
          : 0;
        return { 
          sessionState: 'paused', 
          elapsedSecs: state.elapsedSecs + additionalElapsed,
          sessionStartedAt: null 
        };
      } else {
        // Starting/Resuming: record start time
        return { 
          sessionState: 'running', 
          sessionStartedAt: Date.now() 
        };
      }
    }),
    
  setSessionState: (newState) =>
    set({ sessionState: newState }),

  setSessionLength: (seconds) => 
    set({ sessionLengthSecs: seconds, remainingSeconds: seconds, sessionState: 'idle', sessionStartedAt: null, elapsedSecs: 0 }),

  setSessionTitle: (title) => 
    set({ sessionTitle: title }),

  resetSession: () =>
    set((state) => ({ remainingSeconds: state.sessionLengthSecs, sessionState: 'idle', sessionStartedAt: null, elapsedSecs: 0 })),

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

  getElapsedTotal: () => {
    const state = get();
    const additional = state.sessionStartedAt 
      ? Math.floor((Date.now() - state.sessionStartedAt) / 1000) 
      : 0;
    return (state.elapsedSecs || 0) + additional;
  },
}),
{
  name: 'orbit-timer-storage',
  storage: createJSONStorage(() => localStorage),
  // Hanya simpan data penting. Jika sedang running saat refresh, ubah ke paused.
  partialize: (state) => ({
    sessionState: state.sessionState === 'running' ? 'paused' : state.sessionState,
    sessionLengthSecs: state.sessionLengthSecs,
    remainingSeconds: state.remainingSeconds,
    elapsedSecs: state.elapsedSecs,
    sessionTitle: state.sessionTitle,
    sounds: state.sounds,
  }),
}
)
);
