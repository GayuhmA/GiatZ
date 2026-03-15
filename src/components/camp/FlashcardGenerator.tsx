"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/shared/Card";

export default function FlashcardGenerator() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4 pl-2">
        <span className="text-xl text-primary font-bold">🧠</span>
        <h3 className="font-bold text-lg text-text-primary uppercase tracking-wide">
          AI Flash-Card Generator
        </h3>
      </div>
      <Card
        variant="container"
        className="flex-1 flex flex-col lg:flex-row gap-8 p-6 md:p-8 relative bg-bg-card"
      >
        {/* Left Side: Scanning Text */}
        <div className="flex-1 border-2 border-dashed border-border rounded-3xl p-6 relative bg-white overflow-hidden">
          <h4 className="font-bold text-lg text-primary mb-4">
            Algorithm Basics
          </h4>
          <p className="text-text-secondary text-sm leading-relaxed relative z-10 w-[90%] pointer-events-none">
            A sorting algorithm is an algorithm that puts elements of a list in
            a certain order. Efficient sorting is important for optimizing the
            efficiency of other algorithms which require input data to be in
            sorted lists...
          </p>

          {/* Scanning Line */}
          <motion.div
            className="absolute left-0 w-full h-0.5 bg-success shadow-[0_0_15px_3px_rgba(88,204,2,0.6)] z-20 pointer-events-none"
            initial={{ y: 0 }}
            animate={{ y: [0, 200, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs font-bold text-success uppercase tracking-widest">
              AI Scanning Active
            </span>
          </div>
        </div>

        {/* Right Side: Flashcard */}
        <div className="flex-1 flex flex-col items-center justify-center mt-6 lg:mt-0">
          <div
            className="relative w-full max-w-[240px] aspect-[3/4] perspective-1000 mb-8 mx-auto cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: "1000px" }}
          >
            {/* Background tilted card for depth simulation */}
            <div className="absolute inset-0 bg-white border border-border shadow-md rounded-3xl transform -rotate-6 translate-x-2 -translate-y-2 pointer-events-none"></div>

            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              {/* Front */}
              <div
                className="absolute w-full h-full bg-white border border-border rounded-3xl shadow-card flex flex-col items-center justify-center p-6 text-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-6">
                  <span className="text-2xl text-primary">⚙️</span>
                </div>
                <h3 className="font-bold text-xl text-text-primary leading-tight">
                  What is Big O Notation?
                </h3>
              </div>

              {/* Back */}
              <div
                className="absolute w-full h-full bg-primary rounded-3xl shadow-card flex flex-col items-center justify-center p-6 text-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⏱️</span>
                </div>
                <h3 className="font-bold text-xl text-white leading-tight">
                  Complexity of an Algorithm
                </h3>
                <span className="mt-6 px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-bold tracking-widest uppercase">
                  Mid-Flip
                </span>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 w-full">
            <button className="px-5 py-2.5 bg-primary text-white font-bold rounded-full uppercase tracking-wide text-sm border-b-4 border-primary-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all flex flex-1 items-center justify-center gap-2 max-w-[140px]">
              <span className="text-lg leading-none">😟</span> Hard
            </button>
            <button className="px-5 py-2.5 bg-secondary text-white font-bold rounded-full uppercase tracking-wide text-sm border-b-4 border-secondary-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all flex flex-1 items-center justify-center gap-2 max-w-[160px] whitespace-nowrap">
              <span className="text-lg leading-none">🔄</span> Review Again
            </button>
            <button className="px-5 py-2.5 bg-success text-white font-bold rounded-full uppercase tracking-wide text-sm border-b-4 border-success-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all flex flex-1 items-center justify-center gap-2 max-w-[140px]">
              <span className="text-lg leading-none">😎</span> Easy
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
