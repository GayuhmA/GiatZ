import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useExplorerStore } from "@/store/useExplorerStore";
import AllNotesModal from "./AllNotesModal";

export default function RightPanel({
  onAddCategory,
  onViewAllNotes,
}: {
  onAddCategory?: () => void;
  onViewAllNotes?: () => void;
}) {
  const router = useRouter();
  const { noteNodes } = useExplorerStore();

  // 1. Calculate Recent Notes (Top 4 by updatedAt)
  const recentNotes = useMemo(() => {
    return [...noteNodes]
      .filter((n) => n.data.updatedAt)
      .sort((a, b) => {
        const timeA = (a.data.updatedAt as any)?.seconds || 0;
        const timeB = (b.data.updatedAt as any)?.seconds || 0;
        return timeB - timeA;
      })
      .slice(0, 4);
  }, [noteNodes]);

  // 2. Calculate Weekly Progress (Last 7 Days)
  const weeklyStats = useMemo(() => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const now = new Date();
    const stats = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      const count = noteNodes.filter((n) => {
        const createdAt = (n.data.createdAt as any)?.seconds * 1000;
        return createdAt >= d.getTime() && createdAt < nextD.getTime();
      }).length;

      stats.push({
        day: days[d.getDay()],
        count,
        height: Math.min(count * 20 + 10, 100), // Visual scaling
      });
    }
    return stats;
  }, [noteNodes]);

  const todayCount = weeklyStats[6]?.count || 0;

  return (
    <div className="w-full h-full flex flex-col p-4 xl:p-6 xl:pt-6 gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#3C3C3C] tracking-wide font-heading leading-tight">
          Knowledge Base Kamu
        </h2>
      </div>

      <div className="flex flex-col gap-3 shrink-0">
        <div className="h-[52px] w-full">
          {" "}
          {/* Stable Wrapper to prevent layout shift */}
          <button
            onClick={() => router.push("/explorer/editor/new")}
            className="w-full bg-[#FF9600] text-white font-bold text-[13px] md:text-base rounded-full py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-4 border-[#E68600] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0 transition-all cursor-pointer shadow-sm"
          >
            <PlusIcon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
            <span className="whitespace-nowrap">BUAT NOTE BARU</span>
          </button>
        </div>

        <button
          onClick={onAddCategory}
          className="w-full bg-white border-2 border-dashed border-[#E5E5E5] text-[#AFAFAF] font-bold text-xs md:text-sm rounded-full py-2 flex items-center justify-center gap-2 hover:border-[#3C3C3C] hover:text-[#3C3C3C] transition-all shrink-0"
        >
          <PlusIcon className="w-4 h-4" strokeWidth={3} />
          TAMBAH KATEGORI
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-bold text-[#AFAFAF] uppercase tracking-widest mb-4">
            NOTE TERBARU
          </h3>

          <div className="flex flex-col gap-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => router.push(`/explorer/editor/${note.id}`)}
                  className="flex items-center gap-3 p-3 w-full border border-[#E5E5E5] rounded-2xl bg-white hover:border-[#FF9600] transition-colors cursor-pointer group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-xl border border-slate-200 mt-0.5">
                    {(note.data.icon as string) || "📝"}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h4 className="truncate font-bold text-[13px] md:text-sm text-[#3C3C3C] group-hover:text-[#FF9600] transition-colors leading-tight">
                        {note.data.label}
                      </h4>
                      <span className="text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 text-[#FF9600] bg-[#FFF3E0]">
                        {(note.data.category as string) || "GENERAL"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <p className="truncate text-[11px] md:text-xs text-[#AFAFAF]">
                        Terakhir diubah:{" "}
                        {new Date(
                          (note.data.updatedAt as any)?.seconds * 1000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 opacity-40">
                <p className="text-xs font-bold text-[#AFAFAF]">Belum ada note</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onViewAllNotes}
          className="w-full py-3 rounded-full border-2 border-dashed border-[#E5E5E5] text-[#AFAFAF] font-bold text-sm uppercase tracking-wide hover:border-[#FF9600] hover:text-[#FF9600] transition-colors mt-auto"
        >
          LIHAT SEMUA NOTE
        </button>
      </div>

      {/* Weekly Progress Widget */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 shadow-sm border border-[#FF9600] border-opacity-20 relative overflow-hidden shrink-0">
        <h3 className="text-xs font-bold text-[#FF9600] uppercase tracking-widest mb-4">
          PROGRES MINGGUAN
        </h3>

        <div className="flex flex-col gap-2 mt-2">
          <div className="h-24 flex items-end gap-2 justify-between pl-1 pr-1">
            {weeklyStats.map((stat, i) => (
              <div
                key={i}
                className="w-full relative group h-full flex flex-col justify-end items-center"
              >
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${i === 6 ? "bg-[#FF9600]" : "bg-[#FF9600] opacity-30 group-hover:opacity-60"}`}
                  style={{ height: `${stat.height}%` }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 flex flex-col items-center">
                  <div className="bg-[#3C3C3C] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                    {stat.count} Node
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#3C3C3C]"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pl-1 pr-1">
            {weeklyStats.map((stat, i) => (
              <span
                key={i}
                className={`w-full text-center text-[10px] font-bold ${i === 6 ? "text-[#FF9600]" : "text-[#AFAFAF]"}`}
              >
                {stat.day}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs font-bold text-[#3C3C3C] text-center mt-4">
          {todayCount} Node baru dibuat hari ini!
        </p>
      </div>
    </div>
  );
}
