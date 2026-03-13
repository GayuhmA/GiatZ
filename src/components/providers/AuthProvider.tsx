"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            xp: 0,
            level: 1,
          };

          if (!userDoc.exists()) {
            await setDoc(userDocRef, userProfile);
          } else {
            userProfile = { ...userProfile, ...userDoc.data() };
          }

          setUser(userProfile, firebaseUser);

          // Redirect to home if on auth pages
          if (pathname === '/login' || pathname === '/signup') {
            router.push('/');
          }
        } catch (error) {
          console.error("Error fetching user data", error);
          setUser(null, null);
        }
      } else {
        // User is signed out
        setUser(null, null);
        // Protect routes (optional: can redirect here if not on auth page)
        if (pathname !== '/login' && pathname !== '/signup') {
           router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, router, pathname]);

  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isAuthRoute) {
    return null;
  }

  if (user && isAuthRoute) {
    return null;
  }

  return <>{children}</>;
}
