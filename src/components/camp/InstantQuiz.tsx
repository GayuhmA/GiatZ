"use client";

import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/shared/Card";

const quizData = [
  { subject: "Concepts", score: 85, fullMark: 100 },
  { subject: "Memory", score: 70, fullMark: 100 },
  { subject: "Logic", score: 60, fullMark: 100 },
  { subject: "Speed", score: 90, fullMark: 100 },
  { subject: "Accuracy", score: 80, fullMark: 100 },
];

export default function InstantQuiz() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    { id: "A", text: "Bubble Sort", isCorrect: false },
    { id: "B", text: "Merge Sort", isCorrect: true },
    { id: "C", text: "Linear Search", isCorrect: false },
    { id: "D", text: "Insertion Sort", isCorrect: false },
  ];

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pl-2 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl text-success font-bold">⚡</span>
          <h3 className="font-bold text-lg text-text-primary uppercase tracking-wide">
            AI Instant Quiz
          </h3>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="text-sm font-bold text-text-secondary">
            80% Mastered
          </span>
          <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
            <div className="h-full bg-success w-[80%] rounded-full rounded-r-none"></div>
            <div className="h-full bg-white/50 w-[1%]"></div>
          </div>
          <span className="text-lg text-warning">🎉</span>
        </div>
      </div>

      <Card
        variant="container"
        className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8 bg-bg-card"
      >
        {/* Left Side: Quiz Question */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-success-light/30 border-2 border-success/20 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-success rounded-l-2xl"></div>
            <h4 className="font-extrabold text-xl text-text-primary pl-4 leading-relaxed">
              Which of the following is an example of a "divide and conquer"
              algorithm?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.isCorrect;
              const showResult = selectedOption !== null;

              let btnClass =
                "border-2 border-border bg-white text-text-primary hover:border-text-secondary hover:shadow-sm";

              if (showResult) {
                if (isCorrect) {
                  btnClass =
                    "border-2 border-success bg-success-light text-success shadow-[0_0_0_2px_var(--color-success-light)]";
                } else if (isSelected && !isCorrect) {
                  btnClass =
                    "border-2 border-danger bg-danger-light text-danger";
                } else {
                  btnClass =
                    "border-2 border-border bg-gray-50 text-text-secondary opacity-60";
                }
              } else if (isSelected) {
                btnClass =
                  "border-2 border-primary bg-primary-light text-primary";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl font-bold text-left transition-all duration-200 ${btnClass}`}
                  disabled={showResult}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-text-secondary w-6 h-6 rounded-full bg-white flex items-center justify-center border border-border text-sm shrink-0 shadow-sm">
                      {opt.id}
                    </span>
                    <span className="text-lg">{opt.text}</span>
                  </span>
                  {showResult && isCorrect && (
                    <span className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-sm shadow-sm shrink-0">
                      ✓
                    </span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center text-sm shadow-sm shrink-0">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Mastery Radar & Hint */}
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-gray-50 rounded-3xl p-6 flex flex-col items-center justify-center border border-border flex-1 relative shadow-inner">
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <h5 className="font-bold text-xs text-text-secondary uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-border">
                Your Mastery
              </h5>
            </div>
            <div className="w-full h-[200px] relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={quizData}>
                  <PolarGrid stroke="#E5E5E5" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#AFAFAF", fontSize: 10, fontWeight: "bold" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Mastery"
                    dataKey="score"
                    stroke="#58CC02"
                    fill="#58CC02"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 rounded-md font-bold text-success text-[10px] tracking-widest uppercase text-center backdrop-blur-sm pointer-events-none">
                Radar View
              </div>
            </div>
          </div>

          <div className="bg-secondary-light border border-secondary/30 rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-4xl opacity-10">
              💡
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-secondary text-sm">💡</span>
              <h5 className="font-bold text-xs text-secondary-dark uppercase tracking-widest">
                Study Hint
              </h5>
            </div>
            <p className="text-secondary-dark text-sm italic font-medium leading-relaxed">
              "Think about which algorithm breaks the problem into smaller
              sub-problems recursively!"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
