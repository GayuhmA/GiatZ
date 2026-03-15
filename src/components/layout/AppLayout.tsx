"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AppLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
  rightPanel?: React.ReactNode;
}

export default function AppLayout({
  children,
  showRightPanel = true,
  rightPanel,
}: AppLayoutProps) {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-page flex flex-col md:flex-row font-body text-text-primary">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col md:flex-row w-full md:ml-[240px] ${showRightPanel ? "xl:mr-[380px]" : ""}`}
      >
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 min-h-screen md:min-h-0 max-w-full">
          {children}
        </main>

        {showRightPanel && rightPanel && (
          <>
            {/* Desktop Panel */}
            <aside className="hidden xl:block w-[380px] bg-bg-card border-l border-border p-6 fixed top-0 right-0 h-screen overflow-y-auto z-10">
              {rightPanel}
            </aside>

            {/* Mobile/Tablet Toggle Button */}
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="xl:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(255,150,0,0.3)] border-b-4 border-orange-600 active:translate-y-[2px] active:border-b-0 transition-all z-40"
            >
              <InformationCircleIcon className="w-8 h-8 font-bold" />
            </button>

            {/* Mobile Drawer */}
            <AnimatePresence>
              {isRightPanelOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsRightPanelOpen(false)}
                    className="xl:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                  />

                  {/* Drawer Content */}
                  <motion.aside
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="xl:hidden fixed top-0 right-0 w-[85%] md:w-[400px] h-full bg-white z-[70] shadow-2xl flex flex-col"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50/50">
                      <h3 className="text-xl font-bold text-text-primary tracking-tight">
                        Info & Stats
                      </h3>
                      <button
                        onClick={() => setIsRightPanelOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">{rightPanel}</div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
