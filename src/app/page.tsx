"use client";

import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import DailyGoalSettingsModal from "@/components/dashboard/DailyGoalSettingsModal";
import UnitsExplanationModal from "@/components/dashboard/UnitsExplanationModal";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { useTasks } from "@/hooks/useTasks";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskStore } from "@/store/useTaskStore";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { CheckCircle2, Flame, Rocket, Settings, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuthStore();
  const displayName = user?.displayName?.split(" ")[0] || "Scholar";
  
  // Call useTasks to sync store (setup real-time listener)
  useTasks();
  const tasks = useTaskStore(state => state.tasks);
  
  // Get tasks that are NOT completed (limit to 5 for UI performance)
  const todayQuests = tasks.filter(t => !t.completed).slice(0, 5);
  // Get tasks that are completed today
  const completedTodayQuests = tasks.filter(t => t.completed && t.completedAt && isToday(t.completedAt)).slice(0, 5);

  // Default target goal
  const dailyTarget = user?.dailyGoalUnits || 5;

  // Heatmap & Stats & Modal state
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [todayUnits, setTodayUnits] = useState(0);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isGoalSettingsOpen, setIsGoalSettingsOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    
    const statsRef = collection(db, 'users', user.uid, 'dailyStats');
    const q = query(statsRef, orderBy('date', 'desc'), limit(90)); 
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
       const data: Record<string, number> = {};
       let todayCount = 0;
       
       const todayLocal = new Date();
       const localStr = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;
       
       snapshot.forEach(doc => {
         const units = doc.data().activityUnits || 0;
         data[doc.id] = units;
         if (doc.id === localStr) todayCount = units;
       });
       
       setHeatmapData(data);
       setTodayUnits(todayCount);
    });
    
    return () => unsubscribe();
  }, [user?.uid]);

  // Calculate weekly progress (e.g. 5 units * 7 days = 35 units total)
  // Let's just do a simple mock progress or calculate from last 7 days.
  const weeklyProgressPercent = Math.min(100, Math.round((todayUnits / dailyTarget) * 100)); // Using today's for now as it's just a visual metric

  return (
    <AppLayout
      rightPanel={
        <div className="space-y-6 xl:pr-6">
          {/* Streak Card */}
          <Card className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 relative flex items-center justify-center mb-2">
              <Flame size={48} className="text-orange-500" fill="currentColor" />
              {todayUnits > 0 && (
                <div className="absolute top-0 right-0 bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  +1
                </div>
              )}
            </div>
            <p className="font-extrabold text-3xl text-text-primary mb-1">{user?.streakDays || 0}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Day Streak!</p>
            <p className="text-xs text-text-secondary/80 max-w-[180px]">
              Keep studying to maintain your streak and earn units!
            </p>
          </Card>

          {/* Daily Goal Card */}
          <Card className="bg-orange-50 border-orange-100 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-orange-900">Daily Goal</h3>
                <p className="text-sm font-medium text-orange-700/80 mb-1">
                  {todayUnits} / {dailyTarget} Units earned today
                </p>
              </div>
              <button 
                onClick={() => setIsGoalSettingsOpen(true)}
                className="text-orange-400 mt-1 cursor-pointer hover:text-orange-600 transition-colors bg-transparent border-none p-0 outline-none"
                title="Set Daily Goal"
              >
                <Settings size={24} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-orange-200/50 rounded-full h-2.5 mb-2">
              <div 
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (todayUnits / dailyTarget) * 100)}%` }}
              ></div>
            </div>
            
            {/* Action Button */}
            <Button 
              onClick={() => setIsExplanationOpen(true)}
              variant="primary"
              className="w-full flex items-center justify-center gap-2 font-bold py-3 mt-1"
            >
              How to get more units
            </Button>
          </Card>
        </div>
      }
    >
      <div className="space-y-8 pb-10 w-full">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1CB0F6] to-[#0D8ECF] rounded-[2rem] p-8 md:p-10 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
          
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Welcome back, {displayName}!</h2>
            <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
              You&apos;ve completed {weeklyProgressPercent}% of your daily goals. Finish strong!
            </p>
          </div>
          
          {/* Rocket Graphic */}
          <div className="relative z-10 hidden md:flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 shadow-xl mr-4 transform hover:scale-105 transition-transform duration-300">
             <Rocket size={64} className="text-white -rotate-12 translate-x-1 -translate-y-1" fill="currentColor" />
          </div>
        </div>

        {/* Today's Tasks */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-extrabold text-2xl text-text-primary tracking-tight">Today&apos;s Tasks</h3>
            <span className="bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">
              {todayQuests.length} Left
            </span>
          </div>
          
          <div className="space-y-4">
            {todayQuests.length === 0 && completedTodayQuests.length === 0 ? (
              <Card className="text-center py-10 border-dashed border-2 bg-gray-50/50">
                <p className="text-text-secondary font-medium mb-3">You have no pending tasks right now.</p>
                <Link href="/matrix">
                  <Button variant="outline" className="font-bold border-2">Add New Tasks</Button>
                </Link>
              </Card>
            ) : (
              <>
                {todayQuests.map(task => (
                  <Link href="/matrix" key={task.id} className="block w-full">
                    <Card className="flex justify-between items-center p-5 border-2 border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0 group-hover:border-primary transition-colors flex items-center justify-center">
                           {/* Circle Outline */}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-base mb-0.5">{task.title}</p>
                          <p className="text-sm text-text-secondary">Complete to earn Activity Unit</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#D9A05B] flex items-center gap-1.5 text-sm bg-orange-50 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                        <Trophy size={16} className="text-[#D9A05B]" /> 1 Unit
                      </span>
                    </Card>
                  </Link>
                ))}
                
                {completedTodayQuests.map(task => (
                  <Link href="/matrix" key={task.id} className="block w-full">
                    <Card className="flex justify-between items-center p-5 border-2 border-[#A5ED5B] bg-[#F3FCE8] hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#A5ED5B] flex-shrink-0 flex items-center justify-center text-[#5C940D]">
                           <CheckCircle2 size={20} className="text-white" fill="#A5ED5B" />
                        </div>
                        <div>
                          <p className="font-bold text-[#5C940D] text-base mb-0.5">{task.title}</p>
                          <p className="text-sm text-[#74A825] italic">Nicely done!</p>
                        </div>
                      </div>
                      <span className="font-black text-[#85C834] uppercase tracking-wider text-sm">
                        Done
                      </span>
                    </Card>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Course Mastery Heatmap */}
        <ActivityHeatmap heatmapData={heatmapData} />

      </div>
      
      {/* Modals */}
      <UnitsExplanationModal 
        isOpen={isExplanationOpen} 
        onClose={() => setIsExplanationOpen(false)} 
      />
      
      <DailyGoalSettingsModal 
        isOpen={isGoalSettingsOpen} 
        onClose={() => setIsGoalSettingsOpen(false)} 
      />

    </AppLayout>
  );
}

// Helper to check if a date is today
function isToday(date: Date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}
