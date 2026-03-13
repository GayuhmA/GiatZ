import { create } from 'zustand';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  photoUrl?: string | null;
  xp?: number;
  level?: number;
}

interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  setUser: (user: UserProfile | null, firebaseUser: User | null) => void;
  setLoading: (loading: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  
  setUser: (user, firebaseUser) => set({ user, firebaseUser, loading: false }),
  setLoading: (loading) => set({ loading }),

  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Try to fetch user doc
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      let userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        xp: 0,
        level: 1,
      };

      if (!userDoc.exists()) {
        // Create new user profile in Firestore
        await setDoc(userDocRef, userProfile);
      } else {
        userProfile = { ...userProfile, ...userDoc.data() };
      }

      set({ user: userProfile, firebaseUser: result.user, loading: false });
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  },

  signInWithEmail: async (email, password) => {
    try {
      set({ loading: true });
      await signInWithEmailAndPassword(auth, email, password);
      // user sync handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Email", error);
      set({ loading: false });
      throw error;
    }
  },

  signUpWithEmail: async (name, email, password) => {
    try {
      set({ loading: true });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: null,
        xp: 0,
        level: 1,
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      // Sync is also handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing up with Email", error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, firebaseUser: null, loading: false });
    } catch (error) {
      console.error("Error signing out", error);
    }
  }
}));

// We can export an init function to be called centrally, 
// or let a React component handle the subscription to preserve hooks rules.
