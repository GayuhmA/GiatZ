import { useCallback } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export interface DailyStats {
  date: any; // Firestore Timestamp
  activityUnits: number;
  tasksCompleted: number;
  focusSeconds: number;
}

export function useDailyStats() {
  const { user, setUser } = useAuthStore();

  const addActivityUnit = useCallback(async (
    unitsToAdd: number = 1, 
    type: 'task' | 'focus' | 'note' | 'camp' = 'task',
    additionalData: { focusSeconds?: number } = {}
  ) => {
    if (!user?.uid) return;

    // Get today's date string in YYYY-MM-DD local format
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Convert to Date at midnight for uniform querying if needed
    today.setHours(0, 0, 0, 0);

    const statsRef = doc(db, 'users', user.uid, 'dailyStats', dateStr);
    const userRef = doc(db, 'users', user.uid);

    try {
      const statsDoc = await getDoc(statsRef);
      
      const updateData: any = {
        activityUnits: increment(unitsToAdd)
      };

      if (type === 'task') {
        updateData.tasksCompleted = increment(1);
      } else if (type === 'focus' && additionalData.focusSeconds) {
        updateData.focusSeconds = increment(additionalData.focusSeconds);
      }

      if (!statsDoc.exists()) {
        // First activity of the day: Create stats doc
        await setDoc(statsRef, {
          date: serverTimestamp(),
          activityUnits: unitsToAdd,
          tasksCompleted: type === 'task' ? 1 : 0,
          focusSeconds: type === 'focus' ? (additionalData.focusSeconds || 0) : 0
        });

        // Also check streak logic since it's the first activity today
        let newStreak = user.streakDays || 0;
        
        if (user.lastActiveAt) {
          const lastActiveDate = user.lastActiveAt.toDate ? user.lastActiveAt.toDate() : new Date(user.lastActiveAt);
          lastActiveDate.setHours(0, 0, 0, 0);
          
          const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            newStreak += 1;
          } else if (diffDays > 1) {
            // Streak broken
            newStreak = 1;
          }
        } else {
          // Very first time getting a streak
          newStreak = 1;
        }

        // Update user profile with new streak and last active date
        await updateDoc(userRef, {
          streakDays: newStreak,
          lastActiveAt: serverTimestamp()
        });

        // Update local state
        setUser({ ...user, streakDays: newStreak, lastActiveAt: new Date() }, useAuthStore.getState().firebaseUser);

      } else {
        // Just increment existing stats
        await updateDoc(statsRef, updateData);
        
        // Ensure lastActiveAt is updated even if it's the same day
        await updateDoc(userRef, {
          lastActiveAt: serverTimestamp()
        });
      }

      console.log(`Added ${unitsToAdd} Activity Unit(s) via ${type}`);
    } catch (error) {
      console.error('Error updating activity units:', error);
    }
  }, [user, setUser]);

  return { addActivityUnit };
}
