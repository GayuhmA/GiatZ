"use client";

import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { user } = useAuthStore();
  const displayName = user?.displayName?.split(" ")[0] || "Scholar";

  return (
    <AppLayout
      rightPanel={
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-lg mb-2 text-text-primary">Flame Streak</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔥</span>
              <div>
                <p className="font-extrabold text-2xl text-success">15</p>
                <p className="text-xs font-bold uppercase text-text-secondary">Day Streak!</p>
              </div>
            </div>
          </Card>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#1CB0F6] to-[#0D8ECF] rounded-3xl p-6 md:p-8 text-white flex justify-between items-center shadow-[var(--shadow-card)]">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Welcome back, {displayName}!</h2>
            <p className="opacity-90 mb-6 text-sm md:text-base">You&apos;ve completed 85% of your weekly goals. Finish strong!</p>
            <Button className="bg-white text-secondary hover:bg-gray-100 border-none">
              Resume Lesson
            </Button>
          </div>
          <div className="text-6xl hidden sm:block">🚀</div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4 text-text-primary">Today&apos;s Quests</h3>
          <div className="space-y-3">
            <Card className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0"></div>
                <div>
                  <p className="font-bold text-text-primary text-sm md:text-base">Complete Organic Chemistry Quiz</p>
                  <p className="text-xs md:text-sm text-text-secondary">Earn +50 XP and a Flask Badge</p>
                </div>
              </div>
              <span className="font-bold text-primary flex items-center gap-1 text-sm md:text-base">👑 50 XP</span>
            </Card>
            
            <Card variant="tinted-success" className="flex justify-between items-center border border-success">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-xs flex-shrink-0">✓</div>
                <div>
                  <p className="font-bold text-success-dark text-sm md:text-base">Read 2 Chapters of History</p>
                  <p className="text-xs md:text-sm text-success">Nicely done!</p>
                </div>
              </div>
              <span className="font-bold text-success uppercase tracking-wide text-sm md:text-base">Done</span>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
