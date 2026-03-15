import { create } from "zustand";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  setDoc,
} from "firebase/firestore";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  level: "New" | "Learning" | "Review" | "Mastered";
  nextReviewAt?: number;
}

export interface FlashcardSet {
  id: string;
  noteId: string;
  topic: string;
  cards: Flashcard[];
  createdAt: any;
  lastPlayedAt?: any;
  masteryPercent: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  hint: string;
  category: "Concepts" | "Memory" | "Logic" | "Speed" | "Accuracy";
}

export interface QuizSet {
  id: string;
  noteId: string;
  topic: string;
  questions: QuizQuestion[];
  createdAt: any;
  lastPlayedAt?: any;
  bestScore: number;
  radarScores: { subject: string; score: number; fullMark: number }[];
}

interface CampState {
  flashcardSets: FlashcardSet[];
  quizSets: QuizSet[];
  isSyncing: boolean;

  // Real actions (Saving to Firestore)
  generateFlashcardSet: (
    noteId: string,
    noteTitle: string,
    noteContent: string,
  ) => Promise<string>;
  generateQuizSet: (
    noteId: string,
    noteTitle: string,
    noteContent: string,
  ) => Promise<string>;

  updateFlashcardStats: (
    setId: string,
    masteryPercent: number,
  ) => Promise<void>;
  updateQuizStats: (
    setId: string,
    score: number,
    radarScores: { subject: string; score: number; fullMark: number }[],
  ) => Promise<void>;

  deleteFlashcardSet: (setId: string) => Promise<void>;
  deleteQuizSet: (setId: string) => Promise<void>;
  renameFlashcardSet: (setId: string, newTitle: string) => Promise<void>;
  renameQuizSet: (setId: string, newTitle: string) => Promise<void>;

  // Subscription management
  subscribeToUserSets: (uid: string) => () => void;
  initMockData: () => void;
}

export const useCampStore = create<CampState>((set, get) => ({
  flashcardSets: [],
  quizSets: [],
  isSyncing: false,

  subscribeToUserSets: (uid) => {
    set({ isSyncing: true });

    // Listen for Flashcards
    const fQuery = query(
      collection(db, "users", uid, "flashcards"),
      orderBy("createdAt", "desc"),
    );
    const unsubF = onSnapshot(fQuery, (snapshot) => {
      const sets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FlashcardSet[];
      set({ flashcardSets: sets });
    });

    // Listen for Quizzes
    const qQuery = query(
      collection(db, "users", uid, "quizzes"),
      orderBy("createdAt", "desc"),
    );
    const unsubQ = onSnapshot(qQuery, (snapshot) => {
      const sets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as QuizSet[];
      set({ quizSets: sets, isSyncing: false });
    });

    return () => {
      unsubF();
      unsubQ();
    };
  },

  generateFlashcardSet: async (noteId, noteTitle, noteContent) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        noteContent,
        type: "Flashcard",
        topic: noteTitle,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to generate flashcards");
    }

    const cardsData = await response.json();
    const cards: Flashcard[] = cardsData.map((c: any, i: number) => ({
      id: `fc-${Date.now()}-${i}`,
      ...c,
      level: "New",
    }));

    const newSetRef = doc(collection(db, "users", user.uid, "flashcards"));
    const newSet: Omit<FlashcardSet, "id"> = {
      noteId,
      topic: noteTitle,
      cards,
      createdAt: serverTimestamp(),
      masteryPercent: 0,
    };

    await setDoc(newSetRef, newSet);
    return newSetRef.id;
  },

  generateQuizSet: async (noteId, noteTitle, noteContent) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteContent, type: "Quiz", topic: noteTitle }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to generate quiz");
    }

    const questionsData = await response.json();
    const questions: QuizQuestion[] = questionsData.map(
      (q: any, i: number) => ({
        id: `q-${Date.now()}-${i}`,
        ...q,
      }),
    );

    const newSetRef = doc(collection(db, "users", user.uid, "quizzes"));
    const newSet: Omit<QuizSet, "id"> = {
      noteId,
      topic: noteTitle,
      questions,
      createdAt: serverTimestamp(),
      bestScore: 0,
      radarScores: [
        { subject: "Concepts", score: 0, fullMark: 100 },
        { subject: "Memory", score: 0, fullMark: 100 },
        { subject: "Logic", score: 0, fullMark: 100 },
        { subject: "Speed", score: 0, fullMark: 100 },
        { subject: "Accuracy", score: 0, fullMark: 100 },
      ],
    };

    await setDoc(newSetRef, newSet);
    return newSetRef.id;
  },

  updateFlashcardStats: async (setId, masteryPercent) => {
    const user = auth.currentUser;
    if (!user) return;

    const setRef = doc(db, "users", user.uid, "flashcards", setId);
    await updateDoc(setRef, {
      masteryPercent,
      lastPlayedAt: serverTimestamp(),
    });
  },

  updateQuizStats: async (setId, score, radarScores) => {
    const user = auth.currentUser;
    if (!user) return;

    const setRef = doc(db, "users", user.uid, "quizzes", setId);
    const currentSets = get().quizSets;
    const currentSet = currentSets.find((s) => s.id === setId);

    await updateDoc(setRef, {
      bestScore: Math.max(currentSet?.bestScore || 0, score),
      radarScores,
      lastPlayedAt: serverTimestamp(),
    });
  },

  deleteFlashcardSet: async (setId) => {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "flashcards", setId));
  },

  deleteQuizSet: async (setId) => {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "quizzes", setId));
  },

  renameFlashcardSet: async (setId, newTitle) => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "flashcards", setId), {
      topic: newTitle,
    });
  },

  renameQuizSet: async (setId, newTitle) => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "quizzes", setId), {
      topic: newTitle,
    });
  },

  initMockData: () => {
    // No longer needed with Firebase, but kept for legacy if needed
    // In real app, we use real data.
  },
}));
