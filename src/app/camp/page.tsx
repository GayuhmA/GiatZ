"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SetList from "@/components/camp/SetList";
import FlashcardPlayer from "@/components/camp/FlashcardPlayer";
import QuizPlayer from "@/components/camp/QuizPlayer";
import { useCampStore } from "@/store/useCampStore";
import { useExplorerStore } from "@/store/useExplorerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import {
  CpuChipIcon,
  SparklesIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";

export default function CampPage() {
  const {
    flashcardSets,
    quizSets,
    generateFlashcardSet,
    generateQuizSet,
    subscribeToUserSets,
  } = useCampStore();
  const { user } = useAuthStore();
  const { noteNodes } = useExplorerStore();

  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [activePlayType, setActivePlayType] = useState<
    "flashcard" | "quiz" | null
  >(null);

  // Generation State
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<"Flashcard" | "Quiz">(
    "Flashcard",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const unsub = subscribeToUserSets(user.uid);
      return () => unsub();
    }
  }, [user?.uid, subscribeToUserSets]);

  const handleGenerate = async (type: "Flashcard" | "Quiz") => {
    if (!selectedNoteId || !user) return;

    const note = noteNodes.find((n) => n.id === selectedNoteId);
    if (!note) return;

    setGeneratingType(type);
    setIsGenerating(true);

    try {
      const noteTitle = note.data.label || "Untitled Note";
      const noteContent = note.data.content || "No content provided."; // Ensure we have content for Gemini

      let newId = "";
      if (type === "Flashcard") {
        newId = await generateFlashcardSet(
          selectedNoteId,
          noteTitle as string,
          noteContent as string,
        );
        setActivePlayType("flashcard");
      } else {
        newId = await generateQuizSet(
          selectedNoteId,
          noteTitle as string,
          noteContent as string,
        );
        setActivePlayType("quiz");
      }

      setActiveSetId(newId);
      setSelectedNoteId(""); // reset selection
    } catch (error: any) {
      console.error("Generation failed:", error);
      alert(
        error.message ||
          "Failed to generate content. Please check your API key.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const activeFlashcardSet = flashcardSets.find((s) => s.id === activeSetId);
  const activeQuizSet = quizSets.find((s) => s.id === activeSetId);

  return (
    <AppLayout showRightPanel={false}>
      <div className="h-full flex flex-col pb-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pl-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary flex items-center gap-2">
              Training Camp
            </h2>
            <p className="text-text-secondary mt-1 flex items-center gap-2 font-medium">
              Make Flashcards to build memory, or take a Quiz to push your limits!
            </p>
          </div>
        </div>

        {/* Dynamic Content Area */}
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-50"></div>

            <motion.div
              className="absolute left-0 w-full h-[3px] bg-primary shadow-[0_0_20px_5px_rgba(255,150,0,0.5)] z-20 pointer-events-none"
              initial={{ y: -300 }}
              animate={{ y: [-300, 600, -300] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            <CpuChipIcon className="w-16 h-16 text-primary mb-6 animate-bounce" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              AI is Generating your {generatingType}...
            </h3>
            <p className="text-text-secondary">
              Scanning complex concepts and simplifying them into{" "}
              {generatingType === "Flashcard"
                ? "bite-sized cards"
                : "test questions"}
              .
            </p>

            <div className="flex items-center gap-2 mt-8 bg-primary-light px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Processing Knowledge
              </span>
            </div>
          </div>
        ) : activeSetId &&
          activePlayType === "flashcard" &&
          activeFlashcardSet ? (
          <FlashcardPlayer
            set={activeFlashcardSet}
            onClose={() => {
              setActiveSetId(null);
              setActivePlayType(null);
            }}
          />
        ) : activeSetId && activePlayType === "quiz" && activeQuizSet ? (
          <QuizPlayer
            set={activeQuizSet}
            onClose={() => {
              setActiveSetId(null);
              setActivePlayType(null);
            }}
          />
        ) : (
          <>
            {/* Generate Section */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-border shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-text-primary flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-6 h-6 text-primary" /> Turn Notes
                  into Magic
                </h3>
                <p className="text-text-secondary text-sm">
                  Select any note from your knowledge base to instantly generate
                  interactive Study Sets using AI.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-gray-50 border-2 border-border text-text-primary text-sm font-bold rounded-xl px-4 py-3 flex items-center justify-between hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <DocumentTextIcon className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">
                        {selectedNoteId
                          ? (noteNodes.find((n) => n.id === selectedNoteId)
                              ?.data.label as string)
                          : "Select a Note..."}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-10"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-border shadow-xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                        >
                          {noteNodes.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-text-secondary italic">
                              No notes found in Explorer
                            </div>
                          ) : (
                            noteNodes.map((node) => (
                              <button
                                key={node.id}
                                onClick={() => {
                                  setSelectedNoteId(node.id);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center gap-2 hover:bg-primary-light hover:text-primary transition-colors ${
                                  selectedNoteId === node.id
                                    ? "bg-primary-light text-primary"
                                    : "text-text-primary"
                                }`}
                              >
                                <DocumentTextIcon className="w-4 h-4 opacity-50" />
                                <span className="truncate">
                                  {node.data.label as string}
                                </span>
                              </button>
                            ))
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleGenerate("Flashcard")}
                    disabled={!selectedNoteId}
                    className={`flex-1 sm:flex-none px-6 py-3 font-bold rounded-xl uppercase tracking-wide text-xs border-b-4 transition-all shadow-lg shadow-primary/10 whitespace-nowrap ${selectedNoteId ? "bg-primary text-white border-primary-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 cursor-pointer" : "bg-gray-100 text-text-secondary border-gray-200 cursor-not-allowed opacity-70 border-b-0"}`}
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => handleGenerate("Quiz")}
                    disabled={!selectedNoteId}
                    className={`flex-1 sm:flex-none px-6 py-3 font-bold rounded-xl uppercase tracking-wide text-xs border-b-4 transition-all shadow-lg shadow-success/10 whitespace-nowrap ${selectedNoteId ? "bg-success text-white border-success-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 cursor-pointer" : "bg-gray-100 text-text-secondary border-gray-200 cursor-not-allowed opacity-70 border-b-0"}`}
                  >
                    Instant Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* Library Section */}
            <SetList
              flashcardSets={flashcardSets}
              quizSets={quizSets}
              onPlayFlashcard={(id) => {
                setActiveSetId(id);
                setActivePlayType("flashcard");
              }}
              onPlayQuiz={(id) => {
                setActiveSetId(id);
                setActivePlayType("quiz");
              }}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
