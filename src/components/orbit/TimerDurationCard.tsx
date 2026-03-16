"use client";

import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import { useOrbitStore } from "@/store/useOrbitStore";
import { Clock } from "lucide-react";

export default function TimerDurationCard({
  className = "",
}: {
  className?: string;
}) {
  const {
    sessionLengthSecs,
    setSessionLength,
    breakLengthSecs,
    setBreakLength,
  } = useOrbitStore();

  // Local state for the slider and custom input before applying
  const [localMinutes, setLocalMinutes] = useState(sessionLengthSecs / 60);
  const [localBreakMinutes, setLocalBreakMinutes] = useState(
    breakLengthSecs / 60,
  );

  // Sync local state if global state changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalMinutes(sessionLengthSecs / 60);
    setLocalBreakMinutes(breakLengthSecs / 60);
  }, [sessionLengthSecs, breakLengthSecs]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinutes(Number(e.target.value));
  };

  const handleBreakSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalBreakMinutes(Number(e.target.value));
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(val)) {
      setLocalMinutes(val);
    } else {
      setLocalMinutes(0);
    }
  };

  const handleCustomBreakInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(val)) {
      setLocalBreakMinutes(val);
    } else {
      setLocalBreakMinutes(0);
    }
  };

  const handleApply = () => {
    // Validate session minutes
    let finalMins = localMinutes;
    if (finalMins < 1) finalMins = 1; // Min 1 min
    if (finalMins > 180) finalMins = 180; // Max 3 hours

    // Validate break minutes
    let finalBreakMins = localBreakMinutes;
    if (finalBreakMins < 1) finalBreakMins = 1; // Min 1 min
    if (finalBreakMins > 30) finalBreakMins = 30; // Max 30 mins

    setSessionLength(finalMins * 60);
    setBreakLength(finalBreakMins * 60);

    setLocalMinutes(finalMins); // ensure local state represents clamped value
    setLocalBreakMinutes(finalBreakMins);
  };

  // Pre-defined markers based on mockup: 25, 45, 60
  const markers = [25, 45, 60];
  const breakMarkers = [5, 10, 15];

  return (
    <Card className={`w-full ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 opacity-70 text-slate-600" />
        <h3 className="font-bold text-lg text-slate-800">Durasi Timer</h3>
      </div>

      <div className="space-y-6">
        {/* Slider Section */}
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-4 uppercase">
            Durasi Sesi
          </label>
          <div className="relative pt-2 pb-6">
            <input
              type="range"
              min="1"
              max="120"
              value={localMinutes}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            {/* Markers */}
            <div
              className="absolute w-full mt-2 text-xs text-slate-400"
              style={{ left: 0, right: 0 }}
            >
              <span className="absolute left-0">1</span>
              {markers.map((m) => {
                const pos = ((m - 1) / (120 - 1)) * 100;
                return (
                  <span
                    key={m}
                    className={`absolute cursor-pointer hover:text-slate-700 transition-colors ${localMinutes === m ? "text-primary font-bold" : ""}`}
                    style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                    onClick={() => setLocalMinutes(m)}
                  >
                    {m}
                  </span>
                );
              })}
              <span className="absolute right-0">120</span>
            </div>
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <div className="w-full relative flex items-center bg-bg-page/50 border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-shadow">
            <span className="text-sm font-medium mr-2 text-slate-500">
              Kustom:
            </span>
            <input
              type="text"
              value={localMinutes || ""}
              onChange={handleCustomInput}
              onBlur={() => {
                if (!localMinutes || localMinutes < 1) setLocalMinutes(25);
              }}
              className="bg-transparent flex-1 text-sm font-bold focus:outline-none w-12 text-slate-800"
            />
            <span className="text-sm font-medium ml-2 text-slate-500">
              menit
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-border"></div>

        {/* Break Slider Section */}
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-4 uppercase">
            Durasi Break
          </label>
          <div className="relative pt-2 pb-6">
            <input
              type="range"
              min="1"
              max="30"
              value={localBreakMinutes}
              onChange={handleBreakSliderChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-success"
            />
            {/* Markers */}
            <div
              className="absolute w-full mt-2 text-xs text-slate-400"
              style={{ left: 0, right: 0 }}
            >
              <span className="absolute left-0">1</span>
              {breakMarkers.map((m) => {
                const pos = ((m - 1) / (30 - 1)) * 100;
                return (
                  <span
                    key={m}
                    className={`absolute cursor-pointer hover:text-success transition-colors ${localBreakMinutes === m ? "text-success font-bold" : ""}`}
                    style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                    onClick={() => setLocalBreakMinutes(m)}
                  >
                    {m}
                  </span>
                );
              })}
              <span className="absolute right-0">30</span>
            </div>
          </div>
        </div>

        {/* Custom Break Input */}
        <div>
          <div className="w-full relative flex items-center bg-bg-page/50 border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-success focus-within:border-success transition-shadow">
            <span className="text-sm font-medium mr-2 text-slate-500">
              Kustom:
            </span>
            <input
              type="text"
              value={localBreakMinutes || ""}
              onChange={handleCustomBreakInput}
              onBlur={() => {
                if (!localBreakMinutes || localBreakMinutes < 1)
                  setLocalBreakMinutes(5);
              }}
              className="bg-transparent flex-1 text-sm font-bold focus:outline-none w-12 text-success"
            />
            <span className="text-sm font-medium ml-2 text-slate-500">
              menit
            </span>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          variant="outline"
          className="w-full font-bold bg-white/50 hover:bg-white border-border shadow-sm focus:ring-0 active:scale-95"
          onClick={handleApply}
        >
          TERAPKAN
        </Button>
      </div>
    </Card>
  );
}
