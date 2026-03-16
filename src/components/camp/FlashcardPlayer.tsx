"use client";

import { useDailyStats } from "@/hooks/useDailyStats";
import { FlashcardSet, useCampStore } from "@/store/useCampStore";
import {
  ArrowPathIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface FlashcardPlayerProps {
  set: FlashcardSet;
  onClose: () => void;
}

interface SortedCard {
  front: string;
  back: string;
  originalIndex: number;
}

const SWIPE_THRESHOLD = 100;

export default function FlashcardPlayer({
  set,
  onClose,
}: FlashcardPlayerProps) {
  const [deck, setDeck] = useState<SortedCard[]>(
    set.cards.map((c, i) => ({ ...c, originalIndex: i })),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learningCards, setLearningCards] = useState<SortedCard[]>([]);
  const [perfectedCards, setPerfectedCards] = useState<SortedCard[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [, forceRender] = useState(0);
  const sortingRef = useRef(false);

  const updateStats = useCampStore((s) => s.updateFlashcardStats);
  const { addActivityUnit } = useDailyStats();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const leftOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);
  const rightOpacity = useTransform(x, [0, 40, 120], [0, 0.4, 1]);

  const totalOriginal = set.cards.length;
  const currentCard = deck[currentIndex];
  const remaining = deck.length - currentIndex;

  const advanceCard = useCallback(
    (direction: "left" | "right") => {
      if (sortingRef.current || currentIndex >= deck.length) return;
      sortingRef.current = true;

      const card = deck[currentIndex];
      const targetX = direction === "left" ? -500 : 500;

      animate(x, targetX, {
        duration: 0.3,
        ease: "easeOut",
        onComplete: () => {
          if (direction === "left") {
            setLearningCards((prev) => [card, ...prev]);
          } else {
            setPerfectedCards((prev) => [card, ...prev]);
          }

          const nextIndex = currentIndex + 1;
          if (nextIndex >= deck.length) {
            setCompleted(true);
            setShowModal(true);
          }
          setCurrentIndex(nextIndex);
          setIsFlipped(false);
          x.set(0);
          sortingRef.current = false;
        },
      });
    },
    [currentIndex, deck, x],
  );

  // Review Now: put learning cards back into the deck
  const handleReviewNow = () => {
    if (learningCards.length === 0) return;
    const cardsToReview = [...learningCards];
    setLearningCards([]);
    setDeck((prev) => {
      const newDeck = [
        ...prev.slice(0, currentIndex),
        ...cardsToReview,
        ...prev.slice(currentIndex),
      ];
      return newDeck;
    });
    setCompleted(false);
    setShowModal(false);
    setIsFlipped(false);
  };

  // Challenge Again: put perfected cards back into the deck
  const handleChallengeAgain = () => {
    if (perfectedCards.length === 0) return;
    const cardsToChallenge = [...perfectedCards];
    setPerfectedCards([]);
    setDeck((prev) => {
      const newDeck = [
        ...prev.slice(0, currentIndex),
        ...cardsToChallenge,
        ...prev.slice(currentIndex),
      ];
      return newDeck;
    });
    setCompleted(false);
    setShowModal(false);
    setIsFlipped(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        advanceCard("left");
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        advanceCard("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completed, advanceCard]);

  const handleShuffle = () => {
    if (currentIndex >= deck.length) return;
    setDeck((prev) => {
      const done = prev.slice(0, currentIndex);
      const rest = prev.slice(currentIndex);
      const shuffled = [...rest].sort(() => Math.random() - 0.5);
      return [...done, ...shuffled];
    });
    setIsFlipped(false);
    forceRender((n) => n + 1);
  };

  // Update stats when completed
  useEffect(() => {
    if (!completed) return;
    const masteryPercent =
      totalOriginal > 0
        ? Math.round((perfectedCards.length / totalOriginal) * 100)
        : 0;

    // Fire and forget is okay for stats, but we can wrap it in an async IIFE if needed.
    (async () => {
      try {
        await updateStats(set.id, Math.max(set.masteryPercent, masteryPercent));
        addActivityUnit(1, 'camp');
      } catch (err) {
        console.error("Failed to update flashcard stats:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  const reviewed = currentIndex;
  const progressPercent = deck.length > 0 ? (reviewed / deck.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full w-full mx-auto pb-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-border text-text-secondary hover:text-primary transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-lg text-text-primary">{set.topic}</h3>
            <p className="text-xs text-text-secondary font-medium">
              {reviewed} / {deck.length} reviewed
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-5 mx-auto max-w-lg">
        <div className="h-full rounded-full transition-all duration-500 flex">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-l-full"
            style={{
              width: `${deck.length > 0 ? (learningCards.length / deck.length) * 100 : 0}%`,
            }}
          />
          <div
            className="h-full bg-success transition-all duration-500 rounded-r-full"
            style={{
              width: `${deck.length > 0 ? (perfectedCards.length / deck.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_minmax(300px,380px)_1fr] gap-4 lg:gap-6 min-h-0 items-stretch">
        {/* Left Container: Still Learning (hidden on mobile, shown below card) */}
        <div className="hidden lg:flex bg-white rounded-2xl border border-border shadow-sm flex-col overflow-hidden order-1">
          <div className="p-3 lg:p-4 pb-2 lg:pb-3 border-b border-border/50">
            <div>
              <h4 className="text-xs lg:text-sm font-black text-primary uppercase tracking-wider">
                Still Learning
              </h4>
              <div className="text-base lg:text-lg font-extrabold text-primary leading-none mt-0.5">
                {learningCards.length}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2.5 lg:p-3 space-y-1.5 custom-scrollbar">
            {learningCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6 opacity-40">
                <XMarkIcon className="w-7 h-7 text-text-secondary mb-1.5" />
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wide">
                  Swipe left here
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {learningCards.map((card) => (
                  <motion.div
                    key={`l-${card.originalIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-3 py-1.5 bg-primary-light border border-primary/20 rounded-full text-[11px] font-bold text-primary truncate"
                    title={card.front}
                  >
                    {card.front}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {learningCards.length > 0 && (
            <div className="p-2.5 lg:p-3 pt-0">
              <button
                onClick={handleReviewNow}
                className="w-full py-2 bg-primary text-white font-bold rounded-full uppercase tracking-wide text-[10px] border-b-3 border-primary-dark hover:translate-y-[1px] hover:border-b-2 transition-all cursor-pointer"
              >
                Review Now
              </button>
            </div>
          )}
        </div>

        {/* Center: Card Stack */}
        <div className="flex flex-col items-center justify-center order-first lg:order-2">
          <div
            className="relative w-full aspect-[3/4] max-w-[340px]"
            style={{ perspective: "1000px" }}
          >
            {remaining > 2 && (
              <div className="absolute inset-0 bg-white border border-border/50 rounded-2xl shadow-sm transform scale-[0.92] translate-y-3 pointer-events-none" />
            )}
            {remaining > 1 && (
              <div className="absolute inset-0 bg-white border border-border/60 rounded-2xl shadow-sm transform scale-[0.96] translate-y-1.5 pointer-events-none" />
            )}

            {currentCard && (
              <motion.div
                key={`card-${currentCard.originalIndex}-${currentIndex}`}
                className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
                style={{ x, rotate, transformStyle: "preserve-3d" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (sortingRef.current) return;
                  if (info.offset.x < -SWIPE_THRESHOLD) {
                    advanceCard("left");
                  } else if (info.offset.x > SWIPE_THRESHOLD) {
                    advanceCard("right");
                  } else {
                    animate(x, 0, {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    });
                  }
                }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* Front */}
                  <div
                    className="absolute w-full h-full bg-white border-2 border-border rounded-2xl shadow-card flex flex-col items-center justify-center p-8 text-center"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="absolute top-5 left-0 right-0 text-center">
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                        {set.topic}
                      </span>
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        {deck.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              i === currentIndex
                                ? "bg-primary"
                                : i < currentIndex
                                  ? "bg-success"
                                  : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-2xl text-text-primary leading-snug px-4">
                      {currentCard.front}
                    </h3>

                    <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-text-secondary/40"
                      >
                        <path d="M10.5 1.875a6.375 6.375 0 0 0-6.375 6.375v.75c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75v-.75a4.125 4.125 0 0 1 8.25 0v.75c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75v-.75A6.375 6.375 0 0 0 10.5 1.875ZM3 12.75a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-8.25Z" />
                      </svg>
                      <span className="text-xs font-bold text-text-secondary/50 uppercase tracking-widest">
                        Tekan SPASI untuk buka jawaban
                      </span>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute w-full h-full bg-primary rounded-2xl shadow-card flex flex-col items-center justify-center p-8 text-center"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <h3 className="font-bold text-xl text-white leading-relaxed whitespace-pre-wrap px-4">
                      {currentCard.back}
                    </h3>
                    <div className="absolute bottom-5 left-0 right-0 text-center">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        ← Geser kiri atau kanan →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Drag Indicators */}
            <motion.div
              className="absolute -left-8 top-1/2 -translate-y-1/2 text-primary font-extrabold text-lg pointer-events-none"
              style={{ opacity: leftOpacity }}
            >
              ←
            </motion.div>
            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2 text-success font-extrabold text-lg pointer-events-none"
              style={{ opacity: rightOpacity }}
            >
              →
            </motion.div>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className="mt-5 flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-primary text-primary font-bold rounded-full uppercase tracking-wide text-sm hover:bg-primary-light transition-colors cursor-pointer"
          >
            <ArrowPathIcon className="w-5 h-5" /> Acak Kartu
          </button>
          <p className="text-xs text-text-secondary mt-2 font-medium">
            Tekan SPASI untuk buka jawaban
          </p>
        </div>

        {/* Right Container: Perfected (hidden on mobile, shown below card) */}
        <div className="hidden lg:flex bg-white rounded-2xl border border-border shadow-sm flex-col overflow-hidden order-3">
          <div className="p-3 lg:p-4 pb-2 lg:pb-3 border-b border-border/50">
            <div>
              <h4 className="text-xs lg:text-sm font-black text-success uppercase tracking-wider">
                Dikuasai
              </h4>
              <div className="text-base lg:text-lg font-extrabold text-success leading-none mt-0.5">
                {perfectedCards.length}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2.5 lg:p-3 space-y-1.5 custom-scrollbar">
            {perfectedCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6 opacity-40">
                <CheckCircleIcon className="w-7 h-7 text-text-secondary mb-1.5" />
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wide">
                  Geser ke kanan
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {perfectedCards.map((card) => (
                  <motion.div
                    key={`p-${card.originalIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-3 py-1.5 bg-success-light border border-success/20 rounded-full text-[11px] font-bold text-success truncate"
                    title={card.front}
                  >
                    {card.front}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {perfectedCards.length > 0 && (
            <div className="p-2.5 lg:p-3 pt-0">
              <button
                onClick={handleChallengeAgain}
                className="w-full py-2 bg-success text-white font-bold rounded-full uppercase tracking-wide text-[10px] border-b-3 border-success-dark hover:translate-y-[1px] hover:border-b-2 transition-all cursor-pointer"
              >
                Tantang Lagi
              </button>
            </div>
          )}
        </div>

        {/* Mobile: Still Learning & Perfected */}
        <div className="flex lg:hidden gap-3 order-last">
          <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-3">
            <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-1">Masih Belajar</h4>
            <div className="text-lg font-extrabold text-primary leading-none mb-2">{learningCards.length}</div>
            {learningCards.length > 0 && (
              <button onClick={handleReviewNow} className="w-full mt-2 py-1.5 bg-primary text-white font-bold rounded-full uppercase tracking-wide text-[10px] border-b-2 border-primary-dark">Review Sekarang</button>
            )}
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-3">
            <h4 className="text-xs font-black text-success uppercase tracking-wider mb-1">Dikuasai</h4>
            <div className="text-lg font-extrabold text-success leading-none mb-2">{perfectedCards.length}</div>
            {perfectedCards.length > 0 && (
              <button onClick={handleChallengeAgain} className="w-full mt-2 py-1.5 bg-success text-white font-bold rounded-full uppercase tracking-wide text-[10px] border-b-2 border-success-dark">Tantang Lagi</button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-10 w-full max-w-[420px] mx-4 shadow-2xl text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center">
                  <TrophyIcon className="w-12 h-12 text-warning" />
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-text-primary mb-2">
                Set Selesai!
              </h3>
              <p className="text-text-secondary mb-8 text-sm font-medium opacity-60">
                Kamu udah review semua {totalOriginal} kartu.
              </p>

              <div className="flex items-center justify-center gap-12 mb-10">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-primary">
                    {learningCards.length}
                  </div>
                  <div className="text-xs font-black text-text-secondary uppercase tracking-wider mt-1">
                    Masih Belajar
                  </div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-success">
                    {perfectedCards.length}
                  </div>
                  <div className="text-xs font-black text-text-secondary uppercase tracking-wider mt-1">
                    Dikuasai
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleReviewNow}
                  className="w-full py-3.5 bg-warning text-white font-extrabold rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-warning/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Review Lagi
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 text-text-secondary font-bold rounded-2xl border-2 border-border hover:bg-gray-50 transition-all cursor-pointer text-xs uppercase tracking-widest"
                  >
                    Tetap di Sini
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 text-text-primary font-bold rounded-2xl border-2 border-border hover:border-primary transition-all cursor-pointer text-xs uppercase tracking-widest"
                  >
                    Kembali ke Pustaka
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
