"use client";

import { useDailyStats } from "@/hooks/useDailyStats";
import { QuizSet, useCampStore } from "@/store/useCampStore";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckCircleIcon,
  LightBulbIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface QuizPlayerProps {
  set: QuizSet;
  onClose: () => void;
}

export default function QuizPlayer({ set, onClose }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [radarScores, setRadarScores] = useState<
    { subject: string; score: number; fullMark: number }[]
  >([]);

  const updateStats = useCampStore((s) => s.updateQuizStats);
  const { addActivityUnit } = useDailyStats();

  const currentQuestion = set.questions[currentIndex];
  const totalQuestions = set.questions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = currentQuestion.options.find(
      (o) => o.id === optionId,
    )?.isCorrect;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finish Quiz
      const finalScore = Math.round((correctAnswers / totalQuestions) * 100);

      // Dynamic mock scores for radar
      const randomVariance = () => Math.floor(Math.random() * 20) - 10;
      const newRadar = [
        {
          subject: "Concepts",
          score: Math.min(100, Math.max(0, finalScore + randomVariance())),
          fullMark: 100,
        },
        {
          subject: "Memory",
          score: Math.min(100, Math.max(0, finalScore + randomVariance())),
          fullMark: 100,
        },
        {
          subject: "Logic",
          score: Math.min(100, Math.max(0, finalScore + randomVariance())),
          fullMark: 100,
        },
        {
          subject: "Speed",
          score: Math.min(100, Math.max(0, finalScore + randomVariance())),
          fullMark: 100,
        },
        {
          subject: "Accuracy",
          score: Math.min(100, Math.max(0, finalScore + randomVariance())),
          fullMark: 100,
        },
      ];

      setRadarScores(newRadar);
      // Fire and forget, or wrap in try/catch
      updateStats(set.id, finalScore, newRadar).catch((err) =>
        console.error("Failed to update quiz stats:", err),
      );
      addActivityUnit(1, "camp");
      setCompleted(true);
      setShowModal(true);
    }
  };

  const currentSelectedOption = currentQuestion.options.find(
    (o) => o.id === selectedOption,
  );
  const isCorrect = currentSelectedOption?.isCorrect;

  return (
    <div className="flex flex-col h-full w-full mx-auto pb-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-border text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
              <BoltIcon className="w-5 h-5 text-warning" /> {set.topic}
            </h3>
            <p className="text-xs text-text-secondary font-medium">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-8 mx-auto max-w-2xl border border-white shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-warning to-warning-dark rounded-full shadow-[0_0_10px_rgba(255,150,0,0.3)] transition-all duration-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Theater Stage */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-0 pt-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
          {/* Main Question & Options Area */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`q-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl border-2 border-border p-8 shadow-card relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-warning"></div>

                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-warning-light text-warning-dark text-[10px] font-black uppercase tracking-widest rounded-full border border-warning/20">
                    {currentQuestion.category}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <BoltIcon className="w-4 h-4 text-warning" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      Powerup
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-text-primary leading-tight pl-2">
                  {currentQuestion.text}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = opt.isCorrect;
                const showFeedback = isAnswered;

                let btnStyles =
                  "bg-white border-b-4 border-gray-200 text-text-primary hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-[4px]";

                if (showFeedback) {
                  if (isCorrectOpt) {
                    btnStyles =
                      "bg-success-light border-success text-success border-b-4 translate-y-0 hover:translate-y-0 cursor-default";
                  } else if (isSelected && !isCorrectOpt) {
                    btnStyles =
                      "bg-danger-light border-danger text-danger border-b-4 translate-y-0 hover:translate-y-0 cursor-default";
                  } else {
                    btnStyles =
                      "bg-gray-50 border-gray-200 text-text-secondary opacity-40 border-b-2 scale-[0.98] cursor-default";
                  }
                } else if (isSelected) {
                  btnStyles =
                    "bg-primary-light border-primary text-primary border-b-4 translate-y-[2px]";
                }

                return (
                  <motion.button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    className={`flex items-center gap-4 p-5 rounded-2xl font-bold text-left transition-all border-2 ${btnStyles}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 font-black text-sm ${
                        showFeedback && isCorrectOpt
                          ? "bg-success border-success text-white"
                          : showFeedback && isSelected && !isCorrectOpt
                            ? "bg-danger border-danger text-white"
                            : isSelected
                              ? "bg-primary border-primary text-white"
                              : "bg-white border-border text-text-secondary"
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-base md:text-lg">{opt.text}</span>

                    <div className="ml-auto">
                      {showFeedback && isCorrectOpt && (
                        <CheckCircleIcon className="w-6 h-6 text-success" />
                      )}
                      {showFeedback && isSelected && !isCorrectOpt && (
                        <XMarkIcon className="w-6 h-6 text-danger" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Next Action */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-4"
                >
                  <button
                    onClick={handleNext}
                    className="group flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-lg shadow-primary/30 border-b-4 border-primary-dark hover:translate-y-[1px] hover:border-b-2 transition-all cursor-pointer"
                  >
                    {currentIndex < totalQuestions - 1
                      ? "Tantangan Berikutnya"
                      : "Lihat Hasil"}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Area: Mascot & Hint */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border-2 border-border p-6 shadow-sm relative overflow-hidden flex flex-col items-center">
              <div className="w-32 h-32 relative mb-4">
                <Image
                  src={
                    isAnswered
                      ? isCorrect
                        ? "/images/gia-mascot.png"
                        : "/images/gia-confused.png"
                      : "/images/gia-mascot.png"
                  }
                  alt="Gia"
                  fill
                  className={`object-contain transition-all duration-300 ${!isAnswered ? "opacity-50 grayscale" : "opacity-100 grayscale-0 bounce"}`}
                />
              </div>

              <div className="bg-secondary-light/50 border border-secondary/20 rounded-2xl p-4 w-full text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <LightBulbIcon className="w-4 h-4 text-secondary" />
                  <h5 className="font-bold text-[10px] text-secondary-dark uppercase tracking-widest">
                    Wisdom dari Gia
                  </h5>
                </div>

                {isAnswered ? (
                  <p className="text-xs text-secondary-dark font-medium italic leading-relaxed">
                    &quot;{currentQuestion.hint}&quot;
                  </p>
                ) : (
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wide opacity-40">
                    Jawab dulu buat lihat hint-ku!
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-border/50 p-4 flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                  Progres
                </span>
                <span className="text-[10px] font-black text-primary">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="space-y-2">
                {set.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full ${i === currentIndex ? "bg-primary" : i < currentIndex ? "bg-success" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white rounded-[40px] p-12 w-full max-w-4xl shadow-2xl flex flex-col md:flex-row gap-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-primary via-warning to-success"></div>

              {/* Left Column: Trophy & Stats */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-warning/10 rounded-full flex items-center justify-center mb-6">
                  <TrophyIcon className="w-14 h-14 text-warning" />
                </div>

                <h3 className="text-3xl font-black text-text-primary mb-2">
                  Usaha Luar Biasa!
                </h3>
                <p className="text-text-secondary mb-8 font-medium">
                  Kamu selesaiin quiz {set.topic}.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-primary-light/30 rounded-2xl p-4 border border-primary/10">
                    <div className="text-4xl font-black text-primary">
                      {Math.round((correctAnswers / totalQuestions) * 100)}%
                    </div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                      Akurasi
                    </div>
                  </div>
                  <div className="bg-success-light/30 rounded-2xl p-4 border border-success/10">
                    <div className="text-4xl font-black text-success">
                      {correctAnswers}
                    </div>
                    <div className="text-[10px] font-black text-success uppercase tracking-widest mt-1">
                      Benar
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-text-primary text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  Kembali ke Pustaka
                </button>
              </div>

              {/* Right Column: Mastery Radar */}
              <div className="flex-1 bg-gray-50 rounded-[32px] p-8 flex flex-col items-center min-h-[350px]">
                <h4 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-4">
                  Knowledge Radar
                </h4>
                <div className="w-full h-full min-h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={radarScores}
                    >
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#64748b",
                          fontSize: 10,
                          fontWeight: 900,
                        }}
                      />
                      <PolarRadiusAxis
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Mastery"
                        dataKey="score"
                        stroke="#ffae00"
                        fill="#ffae00"
                        fillOpacity={0.5}
                        strokeWidth={3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-text-secondary/60 font-bold mt-4 italic">
                  Berdasarkan performamu di sesi ini
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
