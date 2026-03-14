"use client";

import { PlusIcon, LinkIcon } from "@heroicons/react/24/outline";

type Note = {
  id: string;
  title: string;
  description: string;
  category: string;
  connections: number;
  icon: string;
  color: string;
};

const recentNotes: Note[] = [
  {
    id: "1",
    title: "Definite Integrals",
    description: "Properties and fundamental theorem of calculus",
    category: "MATHEMATICS",
    connections: 12,
    icon: "🧮",
    color: "text-[#FF9600] bg-[#FFF3E0]",
  },
  {
    id: "2",
    title: "Next.js App Router",
    description: "Layouts, loading states, and error handling basics",
    category: "COMPUTER SCIENCE",
    connections: 8,
    icon: "⚛️",
    color: "text-[#1CB0F6] bg-[#DDF4FF]",
  },
  {
    id: "3",
    title: "Basic Verbs (N5)",
    description: "Taberu, Nomu, Iku - Conjugation rules",
    category: "LANGUAGES",
    connections: 24,
    icon: "文",
    color: "text-[#FF4B4B] bg-[#FFE5E5]",
  },
];

export default function RightPanel() {
  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 overflow-y-auto hidden lg:flex [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#3C3C3C] tracking-wide font-heading leading-tight">
          Your Knowledge Base
        </h2>
      </div>

      <button className="w-full bg-[#FF9600] text-white font-bold text-sm md:text-base rounded-full py-2.5 px-4 flex items-center justify-center gap-2 border-b-4 border-[#E68600] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0 transition-all cursor-pointer shadow-sm">
        <PlusIcon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
        <span className="truncate">CREATE NEW NOTE</span>
      </button>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-bold text-[#AFAFAF] uppercase tracking-widest mb-4">
            RECENT NOTES
          </h3>

          <div className="flex flex-col gap-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center gap-3 p-3 w-full border border-[#E5E5E5] rounded-2xl bg-white hover:border-[#FF9600] transition-colors cursor-pointer group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-xl border border-slate-200 mt-0.5">
                  {note.icon}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h4 className="truncate font-bold text-[13px] md:text-sm text-[#3C3C3C] group-hover:text-[#FF9600] transition-colors leading-tight">
                      {note.title}
                    </h4>
                    <span
                      className={`text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${note.color}`}
                    >
                      {note.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <p className="truncate text-[11px] md:text-xs text-[#AFAFAF]">
                      {note.description}
                    </p>
                    <span className="text-[10px] md:text-[11px] font-bold text-[#AFAFAF] flex items-center gap-1 shrink-0">
                      <LinkIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {note.connections}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-3 rounded-full border-2 border-dashed border-[#E5E5E5] text-[#AFAFAF] font-bold text-sm uppercase tracking-wide hover:border-[#FF9600] hover:text-[#FF9600] transition-colors mt-auto">
          VIEW ALL NOTES
        </button>
      </div>

      {/* Weekly Progress Widget */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 shadow-sm border border-[#FF9600] border-opacity-20 relative overflow-hidden shrink-0">
        <h3 className="text-xs font-bold text-[#FF9600] uppercase tracking-widest mb-4">
          WEEKLY PROGRESS
        </h3>

        {/* Mock Chart Area */}
        <div className="h-24 flex items-end gap-2 justify-between mt-2 pl-1 pr-1">
          {[
            { height: 30, nodes: 2 },
            { height: 45, nodes: 3 },
            { height: 25, nodes: 1 },
            { height: 60, nodes: 4 },
            { height: 50, nodes: 3 },
            { height: 75, nodes: 6 },
            { height: 95, nodes: 8 },
          ].map((stat, i) => (
            <div
              key={i}
              className="w-full relative group h-full flex items-end"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${i === 6 ? "bg-[#FF9600]" : "bg-[#FF9600] opacity-30 group-hover:opacity-60"}`}
                style={{ height: `${stat.height}%` }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 flex flex-col items-center">
                <div className="bg-[#3C3C3C] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                  {stat.nodes} Nodes
                </div>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#3C3C3C]"></div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs font-bold text-[#3C3C3C] text-center mt-4">
          8 New nodes created today!
        </p>
      </div>
    </div>
  );
}
