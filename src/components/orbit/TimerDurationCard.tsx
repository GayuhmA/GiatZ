"use client";

import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import { useOrbitStore } from "@/store/useOrbitStore";
import { Clock } from "lucide-react";

export default function TimerDurationCard({ className = "" }: { className?: string }) {
  const { sessionLengthSecs, setSessionLength } = useOrbitStore();
  
  // Local state for the slider and custom input before applying
  const [localMinutes, setLocalMinutes] = useState(sessionLengthSecs / 60);

  // Sync local state if global state changes externally
  useEffect(() => {
    setLocalMinutes(sessionLengthSecs / 60);
  }, [sessionLengthSecs]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinutes(Number(e.target.value));
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/[^0-9]/g, ''));
    if (!isNaN(val)) {
      setLocalMinutes(val);
    } else {
      setLocalMinutes(0);
    }
  };

  const handleApply = () => {
    let finalMins = localMinutes;
    if (finalMins < 1) finalMins = 1; // Min 1 min
    if (finalMins > 180) finalMins = 180; // Max 3 hours
    setSessionLength(finalMins * 60);
    setLocalMinutes(finalMins); // ensure local state represents clamped value
  };

  // Pre-defined markers based on mockup: 25, 45, 60
  const markers = [25, 45, 60];

  return (
    <Card className={`w-full ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 opacity-70" />
        <h3 className="font-bold text-lg">Timer Duration</h3>
      </div>

      <div className="space-y-6">
        {/* Slider Section */}
        <div>
          <label className="text-xs font-bold text-text-label block mb-4 uppercase">Session Length</label>
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
            <div className="absolute w-full mt-2 text-xs text-text-tertiary" style={{ left: 0, right: 0 }}>
              <span className="absolute left-0">1</span>
              {markers.map(m => {
                const pos = ((m - 1) / (120 - 1)) * 100;
                return (
                  <span 
                    key={m} 
                    className={`absolute cursor-pointer hover:text-text-primary transition-colors ${localMinutes === m ? 'text-primary font-bold' : ''}`} 
                    style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
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
            <span className="text-sm font-medium mr-2 opacity-70">Custom:</span>
            <input 
              type="text" 
              value={localMinutes || ""} 
              onChange={handleCustomInput}
              onBlur={() => { if (!localMinutes || localMinutes < 1) setLocalMinutes(25); }}
              className="bg-transparent flex-1 text-sm font-bold focus:outline-none w-12"
            />
            <span className="text-sm font-medium ml-2 opacity-70">min</span>
          </div>
        </div>

        {/* Apply Button */}
        <Button 
          variant="outline" 
          className="w-full font-bold bg-white/50 hover:bg-white border-border shadow-sm focus:ring-0 active:scale-95"
          onClick={handleApply}
        >
          APPLY SETTINGS
        </Button>

      </div>
    </Card>
  );
}
