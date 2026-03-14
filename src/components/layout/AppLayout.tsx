import React from "react";
import Sidebar from "./Sidebar";

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
  return (
    <div className="min-h-screen bg-bg-page flex flex-col md:flex-row font-body text-text-primary">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col md:flex-row w-full pb-20 md:pb-0 md:ml-[240px] ${showRightPanel ? "lg:mr-[380px]" : ""}`}
      >
        <main className="flex-[1_1_0%] overflow-y-auto p-4 md:p-6 min-h-screen max-w-full">
          {children}
        </main>

        {showRightPanel && (
          <aside className="hidden lg:block w-[380px] bg-bg-card border-l border-border p-6 fixed top-0 right-0 h-screen overflow-y-auto z-10">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
}
