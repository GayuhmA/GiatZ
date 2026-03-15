"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { useRouter } from "next/navigation";
import { useExplorerStore } from "@/store/useExplorerStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { noteNodes } = useExplorerStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTabletOrLaptop = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const filteredNotes = query
    ? noteNodes.filter((note) =>
        note.data.label.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div
      className="relative z-50 flex items-center justify-end"
      ref={containerRef}
    >
      <motion.div
        initial={false}
        animate={{
          width: isExpanded
            ? isMobile
              ? 220
              : isTabletOrLaptop
                ? 260
                : 320
            : 50,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`flex items-center bg-white border outline-none overflow-hidden h-[50px] rounded-full transition-colors duration-200 ${
          isExpanded
            ? "border-[#FF9600] ring-4 ring-[#FF9600]/10"
            : "border-[#E5E5E5] hover:border-[#FF9600] shadow-sm"
        }`}
        onClick={handleExpand}
      >
        <button
          type="button"
          className={`w-[50px] h-[50px] flex items-center justify-center shrink-0 ${
            isExpanded
              ? "text-[#FF9600]"
              : "text-[#AFAFAF] hover:text-[#FF9600]"
          } transition-colors cursor-pointer`}
        >
          <MagnifyingGlassIcon className="w-5 h-5 font-bold stroke-2" />
        </button>

        {isExpanded && (
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none pr-4 text-[13px] md:text-[15px] font-bold text-[#3C3C3C] placeholder-[#AFAFAF] min-w-0"
            placeholder="Search learning dots..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        <AnimatePresence>
          {isExpanded && query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                setQuery("");
                inputRef.current?.focus();
              }}
              className="pr-4 shrink-0 text-[#AFAFAF] hover:text-[#FF9600] transition-colors"
            >
              <XMarkIcon className="w-5 h-5 stroke-2" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Dropdown Results */}
      <AnimatePresence>
        {isExpanded && query && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[60px] right-0 w-[280px] sm:w-[320px] bg-white border border-[#E5E5E5] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-2 flex flex-col gap-1 overflow-hidden"
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    router.push(`/explorer/editor/${note.id}`);
                    setIsExpanded(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#FFF3E0] rounded-2xl cursor-pointer group flex items-center gap-4 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#AFAFAF] group-hover:text-[#FF9600] group-hover:bg-white shrink-0 transition-colors shadow-sm">
                    <span className="text-lg">
                      {(note.data.icon as string) || "📝"}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] md:text-[14px] leading-tight font-extrabold text-[#3C3C3C] group-hover:text-[#FF9600] truncate transition-colors">
                      {note.data.label}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-bold text-[#AFAFAF] uppercase tracking-wider mt-1">
                      {(note.data.category as string) || "GENERAL"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">👀</span>
                <span className="text-sm font-bold text-[#AFAFAF]">
                  No matching notes found.
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
