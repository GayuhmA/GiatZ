import { useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { useDailyStats } from '@/hooks/useDailyStats';

export type FocusSessionStatus = 'COMPLETED' | 'INTERRUPTED';

export interface FocusSessionData {
  topic: string;
  durationSecs: number;
  completedAt: ReturnType<typeof serverTimestamp>;
  status: FocusSessionStatus;
}

export function useFocusSessions() {
  const { user } = useAuthStore();
  const { addActivityUnit } = useDailyStats();

  const saveSession = useCallback(async (
    durationSecs: number,
    status: FocusSessionStatus,
    topic: string = 'Deep Work Orbit'
  ) => {
    if (!user?.uid) {
      console.warn('Cannot save focus session: user not authenticated');
      return null;
    }

    try {
      const sessionsRef = collection(db, 'users', user.uid, 'focusSessions');
      const sessionData: FocusSessionData = {
        topic,
        durationSecs,
        completedAt: serverTimestamp(),
        status,
      };

      const docRef = await addDoc(sessionsRef, sessionData);
      console.log(`Focus session saved (${status}): ${docRef.id}, duration: ${durationSecs}s`);

      // Calculate and add Activity Units if COMPLETED
      if (status === 'COMPLETED') {
        const units = Math.floor(durationSecs / 1500);
        addActivityUnit(units, 'focus', { focusSeconds: durationSecs });
      } else if (status === 'INTERRUPTED') {
        addActivityUnit(0, 'focus', { focusSeconds: durationSecs });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error saving focus session:', error);
      return null;
    }
  }, [user?.uid, addActivityUnit]);

  return { saveSession };
}
