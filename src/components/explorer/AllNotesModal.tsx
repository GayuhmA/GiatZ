"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { ExplorerNode } from "@/store/useExplorerStore";
import { useRouter } from "next/navigation";

interface AllNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: ExplorerNode[];
}

export default function AllNotesModal({
  isOpen,
  onClose,
  notes,
}: AllNotesModalProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredNotes = notes.filter((note) =>
    note.data.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-[600px] bg-white rounded-[40px] shadow-2xl z-[1000] overflow-hidden flex flex-col border border-[#E5E5E5]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black text-[#3C3C3C] tracking-tight uppercase italic">
                  All Knowledge
                </h2>
                <p className="text-[#AFAFAF] font-bold text-xs uppercase tracking-widest mt-1">
                  Searching through {notes.length} notes
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#3C3C3C] hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-8 mb-6 shrink-0">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF] group-focus-within:text-[#FF9600] transition-colors" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Find a specific note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FF9600]/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#3C3C3C] transition-all outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3 custom-scrollbar">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      router.push(`/explorer/editor/${note.id}`);
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-3xl border border-[#E5E5E5] hover:border-[#FF9600] bg-white hover:bg-orange-50/30 transition-all text-left group shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 group-hover:bg-white transition-colors">
                      {(note.data.icon as string) || "📝"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className="font-black text-[15px] text-[#3C3C3C] truncate group-hover:text-[#FF9600] transition-colors">
                          {note.data.label}
                        </h4>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-[#AFAFAF] uppercase tracking-wider">
                          {(note.data.category as string) || "GENERAL"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-[#AFAFAF] flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {new Date(
                            (note.data.updatedAt as any)?.seconds * 1000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                  <MagnifyingGlassIcon className="w-12 h-12 text-[#FF9600] mb-2" />
                  <p className="font-black text-sm text-[#FF9600] uppercase tracking-widest">
                    No results found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
