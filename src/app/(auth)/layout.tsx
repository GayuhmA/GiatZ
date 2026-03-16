"use client";

import { useEffect, useState } from "react";

function getTimeOfDay(): "day" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 15) return "day";
  if (hour >= 15 && hour < 18) return "evening";
  return "night";
}

const backgrounds: Record<"day" | "evening" | "night", string> = {
  day: "linear-gradient(180deg, #8ad1ff 0%, #f0f8ff 100%)",
  evening: "linear-gradient(180deg, #f97316 0%, #ffdfba 100%)",
  night: "linear-gradient(180deg, #0a1128 0%, #4e184c 100%)",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [timeOfDay, setTimeOfDay] = useState<"day" | "evening" | "night">(
    "day",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeOfDay(getTimeOfDay());
    const timer = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-body transition-all duration-1000"
      style={{ background: backgrounds[timeOfDay] }}
    >
      {children}
    </div>
  );
}
