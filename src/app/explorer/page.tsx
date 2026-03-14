import { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import MindGlanceGraph from "../explorer/components/MindGlanceGraph";
import RightPanel from "../explorer/components/RightPanel";
import SearchBar from "../explorer/components/SearchBar";

export default function MindGlancePage() {
  return (
    <AppLayout rightPanel={<RightPanel />}>
      <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-6">
          <div className="w-full relative z-10 flex flex-col items-start gap-1">
            <h2 className="text-2xl md:text-[32px] font-extrabold text-[#3C3C3C] flex items-center font-heading tracking-wide">
              Interactive Graph Canvas
            </h2>
            <p className="text-[#AFAFAF] font-bold text-sm mt-1 tracking-wide">
              Connect the dots of your learning journey
            </p>
          </div>

          {/* Desktop Only: Top Controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <SearchBar />
          </div>
        </div>

        {/* Canvas Area Container */}
        <div className="w-full flex-1 relative min-h-[400px]">
          <MindGlanceGraph />
        </div>
      </div>
    </AppLayout>
  );
}
