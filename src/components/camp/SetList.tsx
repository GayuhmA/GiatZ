"use client";

import { useState, useRef, useEffect } from "react";
import { FlashcardSet, QuizSet, useCampStore } from "@/store/useCampStore";
import { formatDistanceToNow } from "date-fns";
import {
  BoltIcon,
  RectangleStackIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

interface SetListProps {
  flashcardSets: FlashcardSet[];
  quizSets: QuizSet[];
  onPlayFlashcard: (setId: string) => void;
  onPlayQuiz: (setId: string) => void;
}

const COLS = 4;
const VISIBLE_ROWS = 2;
const CARD_HEIGHT = 150; // px
const GAP = 12; // gap-3 = 12px
const SECTION_HEIGHT = CARD_HEIGHT * VISIBLE_ROWS + GAP * (VISIBLE_ROWS - 1);

export default function SetList({
  flashcardSets,
  quizSets,
  onPlayFlashcard,
  onPlayQuiz,
}: SetListProps) {
  const [showAllFlashcards, setShowAllFlashcards] = useState(false);
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);

  // Context Menu State
  const [menuConfig, setMenuConfig] = useState<{
    x: number;
    y: number;
    setId: string;
    type: "flashcard" | "quiz";
    isVisible: boolean;
  } | null>(null);

  // Rename Dialog State
  const [renameConfig, setRenameConfig] = useState<{
    setId: string;
    type: "flashcard" | "quiz";
    currentTitle: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const {
    deleteFlashcardSet,
    deleteQuizSet,
    renameFlashcardSet,
    renameQuizSet,
  } = useCampStore();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    setId: string;
    type: "flashcard" | "quiz";
    topic: string;
  } | null>(null);

  // Helper to handle Firestore Timestamps safely
  const safeFormat = (date: any) => {
    if (!date) return "Just now";

    if (date.toDate && typeof date.toDate === "function") {
      return formatDistanceToNow(date.toDate(), { addSuffix: true });
    }

    if (date.seconds !== undefined) {
      return formatDistanceToNow(new Date(date.seconds * 1000), {
        addSuffix: true,
      });
    }

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Recently";
      return formatDistanceToNow(d, { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  const maxVisible = COLS * VISIBLE_ROWS;

  const handleContextMenu = (
    e: React.MouseEvent,
    setId: string,
    type: "flashcard" | "quiz",
  ) => {
    e.preventDefault();
    setMenuConfig({
      x: e.clientX,
      y: e.clientY,
      setId,
      type,
      isVisible: true,
    });
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const startLongPress = (
    e: React.TouchEvent,
    setId: string,
    type: "flashcard" | "quiz",
  ) => {
    const touch = e.touches[0];
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    timerRef.current = setTimeout(() => {
      if (lastTouchRef.current) {
        setMenuConfig({
          x: lastTouchRef.current.x,
          y: lastTouchRef.current.y,
          setId,
          type,
          isVisible: true,
        });
      }
    }, 700);
  };

  const cancelLongPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    lastTouchRef.current = null;
  };

  useEffect(() => {
    const handleGlobalClick = () => setMenuConfig(null);
    if (menuConfig?.isVisible) {
      window.addEventListener("click", handleGlobalClick);
      return () => window.removeEventListener("click", handleGlobalClick);
    }
  }, [menuConfig]);

  const openDeleteConfirm = () => {
    if (!menuConfig) return;
    const topic =
      menuConfig.type === "flashcard"
        ? flashcardSets.find((s) => s.id === menuConfig.setId)?.topic || ""
        : quizSets.find((s) => s.id === menuConfig.setId)?.topic || "";

    setDeleteConfirm({
      setId: menuConfig.setId,
      type: menuConfig.type,
      topic,
    });
    setMenuConfig(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "flashcard")
      deleteFlashcardSet(deleteConfirm.setId);
    else deleteQuizSet(deleteConfirm.setId);
    setDeleteConfirm(null);
  };

  const openRename = () => {
    if (!menuConfig) return;
    const title =
      menuConfig.type === "flashcard"
        ? flashcardSets.find((s) => s.id === menuConfig.setId)?.topic || ""
        : quizSets.find((s) => s.id === menuConfig.setId)?.topic || "";

    setRenameConfig({
      setId: menuConfig.setId,
      type: menuConfig.type,
      currentTitle: title,
    });
    setNewTitle(title);
    setMenuConfig(null);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameConfig || !newTitle.trim()) return;

    if (renameConfig.type === "flashcard")
      renameFlashcardSet(renameConfig.setId, newTitle);
    else renameQuizSet(renameConfig.setId, newTitle);

    setRenameConfig(null);
  };

  return (
    <div className="mt-5 space-y-8 pb-4 max-w-3xl relative">
      {/* Flashcard Library */}
      <section>
        <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide flex items-center gap-1.5 mb-4 pl-1">
          <RectangleStackIcon className="w-4 h-4 text-primary" /> Flashcard
          Library
        </h3>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            height: showAllFlashcards ? "auto" : `${SECTION_HEIGHT}px`,
          }}
        >
          {flashcardSets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {flashcardSets.map((set) => (
                <div
                  key={set.id}
                  onClick={() => onPlayFlashcard(set.id)}
                  onContextMenu={(e) =>
                    handleContextMenu(e, set.id, "flashcard")
                  }
                  onTouchStart={(e) => startLongPress(e, set.id, "flashcard")}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  className="cursor-pointer group bg-white rounded-xl border border-border hover:border-primary transition-all duration-200 p-4 pb-3 flex flex-col justify-between select-none active:scale-95"
                  style={{ height: `${CARD_HEIGHT}px` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                        {set.cards.length} cards
                      </span>
                      <span className="text-xs text-text-secondary truncate ml-1">
                        {safeFormat(set.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-text-primary line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {set.topic}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                    {set.lastPlayedAt ? (
                      <span className="text-xs font-bold text-success">
                        {set.masteryPercent}% Mastery
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary-light px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                    <PlayIcon className="w-4 h-4 text-text-secondary/30 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-gray-50/50 border-2 border-dashed border-border/40 rounded-2xl flex flex-col items-center justify-center text-center opacity-60"
              style={{ height: `${SECTION_HEIGHT}px` }}
            >
              <RectangleStackIcon className="w-5 h-5 text-text-secondary/30 mb-2" />
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                Empty Library
              </p>
            </div>
          )}
        </div>
        {flashcardSets.length > maxVisible && (
          <button
            onClick={() => setShowAllFlashcards(!showAllFlashcards)}
            className="mt-3 flex items-center gap-1 mx-auto text-[11px] font-bold text-text-secondary hover:text-primary transition-colors uppercase tracking-wide"
          >
            {showAllFlashcards ? (
              <>
                Show Less <ChevronUpIcon className="w-3 h-3" />
              </>
            ) : (
              <>
                See More ({flashcardSets.length - maxVisible}+){" "}
                <ChevronDownIcon className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </section>

      {/* Quiz Library */}
      <section>
        <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide flex items-center gap-1.5 mb-4 pl-1">
          <BoltIcon className="w-4 h-4 text-success" /> Quiz Library
        </h3>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            height: showAllQuizzes ? "auto" : `${SECTION_HEIGHT}px`,
          }}
        >
          {quizSets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {quizSets.map((set) => (
                <div
                  key={set.id}
                  onClick={() => onPlayQuiz(set.id)}
                  onContextMenu={(e) => handleContextMenu(e, set.id, "quiz")}
                  onTouchStart={(e) => startLongPress(e, set.id, "quiz")}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  className="cursor-pointer group bg-white rounded-xl border border-border hover:border-primary transition-all duration-200 p-4 pb-3 flex flex-col justify-between select-none active:scale-95"
                  style={{ height: `${CARD_HEIGHT}px` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                        {set.questions.length} Questions
                      </span>
                      <span className="text-xs text-text-secondary truncate ml-1">
                        {safeFormat(set.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-text-primary line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {set.topic}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                    {set.lastPlayedAt ? (
                      <span
                        className={`text-xs font-bold ${set.bestScore >= 80 ? "text-success" : set.bestScore >= 50 ? "text-warning" : "text-danger"}`}
                      >
                        Best: {set.bestScore}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-success uppercase bg-success-light px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                    <PlayIcon className="w-4 h-4 text-text-secondary/30 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-gray-50/50 border-2 border-dashed border-border/40 rounded-2xl flex flex-col items-center justify-center text-center opacity-60"
              style={{ height: `${SECTION_HEIGHT}px` }}
            >
              <BoltIcon className="w-5 h-5 text-text-secondary/30 mb-2" />
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                Empty Library
              </p>
            </div>
          )}
        </div>
        {quizSets.length > maxVisible && (
          <button
            onClick={() => setShowAllQuizzes(!showAllQuizzes)}
            className="mt-3 flex items-center gap-1 mx-auto text-[11px] font-bold text-text-secondary hover:text-primary transition-colors uppercase tracking-wide"
          >
            {showAllQuizzes ? (
              <>
                Show Less <ChevronUpIcon className="w-3 h-3" />
              </>
            ) : (
              <>
                See More ({quizSets.length - maxVisible}+){" "}
                <ChevronDownIcon className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </section>

      {/* Context Menu Overlay */}
      <AnimatePresence>
        {menuConfig?.isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-white border border-border shadow-xl rounded-2xl overflow-hidden py-1.5 min-w-[160px]"
            style={{
              left: Math.min(
                menuConfig.x,
                typeof window !== "undefined"
                  ? window.innerWidth - 170
                  : menuConfig.x,
              ),
              top: Math.min(
                menuConfig.y,
                typeof window !== "undefined"
                  ? window.innerHeight - 100
                  : menuConfig.y,
              ),
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                openRename();
              }}
              className="w-full text-left px-4 py-2 text-sm font-bold text-text-primary hover:bg-primary-light hover:text-primary flex items-center gap-2.5 transition-colors"
            >
              <PencilIcon className="w-4 h-4" /> Rename Set
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteConfirm();
              }}
              className="w-full text-left px-4 py-2 text-sm font-bold text-danger hover:bg-danger-light flex items-center gap-2.5 transition-colors"
            >
              <TrashIcon className="w-4 h-4" /> Delete Set
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Dialog */}
      <AnimatePresence>
        {renameConfig && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setRenameConfig(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-black text-text-primary mb-1">
                Rename Study Set
              </h3>
              <p className="text-xs text-text-secondary mb-4 font-medium italic">
                Change the title of your {renameConfig.type} set.
              </p>

              <form onSubmit={handleRenameSubmit} className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-border text-text-primary font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter new title..."
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRenameConfig(null)}
                    className="flex-1 py-3 bg-gray-100 text-text-secondary font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest text-[10px]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="w-12 h-12 bg-danger-light rounded-full flex items-center justify-center mb-4">
                <TrashIcon className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-lg font-black text-text-primary mb-1">
                Delete Study Set?
              </h3>
              <p className="text-xs text-text-secondary mb-6 font-medium leading-relaxed">
                Are you sure you want to delete{" "}
                <strong>"{deleteConfirm.topic}"</strong>? This action cannot be
                undone.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-100 text-text-secondary font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 bg-danger text-white font-bold rounded-xl shadow-lg shadow-danger/20 uppercase tracking-widest text-[10px]"
                >
                  Delete Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
