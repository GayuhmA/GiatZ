"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useExplorer } from "@/hooks/useExplorer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useExplorerStore } from "@/store/useExplorerStore";
import {
  ArrowLeftIcon,
  BoltIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  LinkIcon,
  SparklesIcon,
  Squares2X2Icon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { doc, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────
const MATRIX_OPTIONS = [
  { id: "DO_FIRST", label: "MENDESAK & PENTING", color: "bg-red-500" },
  { id: "SCHEDULE", label: "TIDAK MENDESAK & PENTING", color: "bg-green-500" },
  { id: "DELEGATE", label: "MENDESAK & TIDAK PENTING", color: "bg-blue-500" },
  {
    id: "ELIMINATE",
    label: "TIDAK MENDESAK & TIDAK PENTING",
    color: "bg-yellow-500",
  },
];

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-2 rounded-lg transition-all flex items-center justify-center
        ${
          active
            ? "bg-[#FF9600] text-white shadow-inner"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}

// ─── Animated Toggle Component ──────────────────────────────────────────────
function AnimatedToggle({
  active,
  onClick,
  activeColor = "bg-[#58CC02]",
}: {
  active: boolean;
  onClick: () => void;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${active ? activeColor : "bg-slate-200"}`}
    >
      <motion.div
        animate={{ x: active ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

// ─── Math Block Helpers ──────────────────────────────────────────────────────
const MATH_REGEX =
  /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;

function wrapMathInHtml(text: string): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escapeAttr = (s: string) => s.replace(/"/g, "&quot;");

  MATH_REGEX.lastIndex = 0;
  return text.replace(MATH_REGEX, (match) => {
    const inner = match.replace(
      /^\$\$|\$\$$|^\$|\$$|^\\\(|\\\)$|^\\\[|\\\]$/g,
      "",
    );
    return `<span class="math-block" contenteditable="false" style="display:inline-block;background:#FFF3E0;color:#E65100;font-family:monospace;font-size:0.85em;padding:2px 8px;border-radius:6px;border:1px solid #FFB74D;margin:0 2px;user-select:none;" title="${escapeAttr(match)}">${escapeHtml(inner)}</span>`;
  });
}

// ─── Main Editor Component ───────────────────────────────────────────────────
export default function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: noteId } = use(params);
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const mindLinksRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const { updateNote, createTask, connectNodes, disconnectNodes } =
    useExplorer();
  const { noteNodes, categoryNodes, edges } = useExplorerStore();

  const [title, setTitle] = useState("");
  const [autoSave, setAutoSave] = useState(true);
  const [aiOptimize, setAiOptimize] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>(
    {},
  );
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });

  const [matrixStatus, setMatrixStatus] = useState<any>(null);
  const [showMatrixPicker, setShowMatrixPicker] = useState(false);
  const [questAdded, setQuestAdded] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isExtraSmall = useMediaQuery("(max-width: 640px)");

  const handleManualSave = async () => {
    if (!user?.uid || !noteId) return;
    setIsRefreshing(true);

    let contentToSave = editorRef.current?.innerHTML || "";

    if (aiOptimize) {
      setIsOptimizing(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteContent: contentToSave,
            type: "Optimize",
            topic: title || "General Note",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.optimizedContent) {
            contentToSave = data.optimizedContent;
            if (editorRef.current) {
              editorRef.current.innerHTML = data.optimizedContent;
            }
          }
        }
      } catch (err) {
        console.error("AI Optimization Error:", err);
      } finally {
        setIsOptimizing(false);
      }
    }

    const savedId = await updateNote(noteId, {
      title,
      content: contentToSave,
      quadrant: matrixStatus?.id || null,
    });

    if (noteId === "new" && savedId) {
      router.replace(`/explorer/editor/${savedId}`);
    }

    setLastSavedAt(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // 1. Load Note Data
  useEffect(() => {
    if (!user?.uid || !noteId || noteId === "new") return;

    const noteRef = doc(db, "users", user.uid, "notes", noteId);
    const unsubscribe = onSnapshot(noteRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");

        if (editorRef.current && editorRef.current.innerHTML !== data.content) {
          editorRef.current.innerHTML = data.content || "";
        }

        if (data.quadrant) {
          const opt = MATRIX_OPTIONS.find((o) => o.id === data.quadrant);
          if (opt) setMatrixStatus(opt);
        }
      }
    });

    return () => unsubscribe();
  }, [user?.uid, noteId]);

  // 2. Auto-save Logic
  useEffect(() => {
    if (!autoSave || !user?.uid || !noteId) return;

    const timeout = setTimeout(async () => {
      const savedId = await updateNote(noteId, {
        title,
        content: editorRef.current?.innerHTML || "",
        quadrant: matrixStatus?.id || null,
      });

      if (noteId === "new" && savedId) {
        router.replace(`/explorer/editor/${savedId}`);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [title, matrixStatus, autoSave, user?.uid, noteId, updateNote, router]);

  // 3. Mind Links Logic
  const currentNoteEdges = edges.filter(
    (e) => e.source === noteId || e.target === noteId,
  );

  const relatedItems = currentNoteEdges.map((edge) => {
    const linkedId = edge.source === noteId ? edge.target : edge.source;
    const note = noteNodes.find((n) => n.id === linkedId);
    const category = categoryNodes.find((c) => c.id === linkedId);
    return {
      id: linkedId,
      edgeId: edge.id,
      title: note?.data.label || category?.data.label || "Unknown",
      type: note ? "note" : "category",
    };
  });

  const availableSuggestions = [
    ...noteNodes.map((n) => ({ id: n.id, title: n.data.label, type: "note" })),
    ...categoryNodes.map((c) => ({
      id: c.id,
      title: c.data.label,
      type: "category",
    })),
  ].filter(
    (item) =>
      item.id !== noteId &&
      item.title.toLowerCase().includes(newLink.toLowerCase()) &&
      !relatedItems.some((ri) => ri.id === item.id) &&
      newLink.trim() !== "",
  );

  const handleDeleteLink = (edgeId: string) => {
    disconnectNodes(edgeId);
  };

  const handleAddLink = async (item?: any) => {
    const itemToAdd = item || availableSuggestions[0];
    if (!itemToAdd || !noteId || !user?.uid) return;

    let currentId = noteId;

    // If it's a new note, we MUST save it first to get a valid ID for the edge
    if (noteId === "new") {
      const savedId = await updateNote("new", {
        title: title || "Untitled Note",
        content: editorRef.current?.innerHTML || "",
        quadrant: matrixStatus?.id || null,
      });

      if (savedId) {
        currentId = savedId;
        // Don't router.replace here yet, let the auto-save or manual save handle it,
        // but we need the ID for the connection.
        // Actually, we SHOULD replace to keep the UI in sync
        router.replace(`/explorer/editor/${savedId}`);
      } else {
        return; // Save failed
      }
    }

    connectNodes(currentId, itemToAdd.id);
    setNewLink("");
    setShowSuggestions(false);
  };

  // Update active formats on selection
  const updateActiveFormats = useCallback(() => {
    if (typeof document === "undefined") return;
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    });

    const selection = window.getSelection();
    if (
      selection &&
      !selection.isCollapsed &&
      selection.toString().trim().length > 0
    ) {
      // SCROLL CHECK: Ensure selection is inside the editor area
      let node = selection.anchorNode;
      let insideEditor = false;
      while (node) {
        if (node === editorRef.current) {
          insideEditor = true;
          break;
        }
        node = node.parentNode;
      }

      if (insideEditor) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setToolbarPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 60,
        });
        setShowFloatingToolbar(true);
        return;
      }
    }
    setShowFloatingToolbar(false);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () =>
      document.removeEventListener("selectionchange", updateActiveFormats);
  }, [updateActiveFormats]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mindLinksRef.current &&
        !mindLinksRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateActiveFormats();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text/plain");
    if (MATH_REGEX.test(text)) {
      e.preventDefault();
      const html = wrapMathInHtml(text).replace(/\n/g, "<br/>");
      document.execCommand("insertHTML", false, html);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        exec("bold");
      }
      if (e.key === "i") {
        e.preventDefault();
        exec("italic");
      }
    }
  };

  const handleAddAsQuest = async () => {
    if (!matrixStatus || !user?.uid) {
      setShowMatrixPicker(true);
      return;
    }

    try {
      await createTask({
        title: title ? `Notes: ${title}` : "Notes: Untitled Note",
        quadrant: matrixStatus.id,
        status: "TODO",
        noteId: noteId !== "new" ? noteId : null,
      });

      setQuestAdded(true);
      setTimeout(() => setQuestAdded(false), 3000);
    } catch (err) {
      console.error("Add as Quest Error:", err);
    }
  };

  return (
    <AppLayout showRightPanel={false}>
      <div
        className={`max-w-[1600px] mx-auto w-full ${isMobile ? "min-h-screen" : "h-[calc(100vh-48px)] overflow-hidden"} flex flex-col lg:flex-row gap-6 lg:gap-8 relative px-0 md:px-4 lg:px-0 pb-10 lg:pb-0`}
      >
        {/* Back Link */}
        <div
          className={`${isMobile ? "static mb-4 pt-2" : "absolute top-0 left-0 -mt-2"} px-4 md:px-0`}
        >
          <Link
            href="/explorer"
            className="flex items-center gap-2 text-[#AFAFAF] hover:text-[#3C3C3C] font-bold text-sm transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
            </div>
            KEMBALI KE EXPLORER
          </Link>
        </div>

        {/* ── Editor Column (75%) ── */}
        <div
          className={`flex-1 min-h-0 min-w-0 flex flex-col gap-4 lg:gap-6 ${isMobile ? "mt-0" : "mt-10"} bg-white rounded-[32px] md:rounded-[40px] p-6 text-wrap break-words md:p-10 lg:p-14 border border-[#E5E5E5] shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden`}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul"
            className={`w-full ${isExtraSmall ? "text-[24px]" : "text-[40px]"} font-extrabold text-[#3C3C3C] placeholder:text-[#E2E8F0] bg-transparent outline-none border-none font-heading tracking-tight leading-tight shrink-0 min-w-0`}
          />

          <div className="h-px w-full bg-[#F1F5F9] shrink-0" />

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            data-placeholder="Mulai tulis catatan belajar di sini..."
            className={`flex-1 outline-none text-[#3C3C3C] ${isExtraSmall ? "text-[14px]" : "text-[18px]"} leading-[1.7] font-body overflow-y-auto overflow-x-hidden break-words pr-2 custom-scrollbar empty:before:content-[attr(data-placeholder)] empty:before:text-[#CBD5E1] empty:before:pointer-events-none w-full min-w-0
              ${isMobile ? "min-h-[300px]" : "h-full"}
              [&_strong]:font-bold [&_em]:italic [&_u]:underline
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4
              [&_li]:mb-2
              [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:mt-8 [&_h2]:mb-4
              [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[0.9em]`}
          />

          {/* Floating Toolbar */}
          <AnimatePresence>
            {showFloatingToolbar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                style={{
                  position: "fixed",
                  left: toolbarPos.x,
                  top: toolbarPos.y,
                  transform: "translateX(-50%)",
                }}
                className="z-50 bg-[#2D2D2D] rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 border border-white/10"
              >
                <ToolbarBtn
                  onClick={() => exec("bold")}
                  active={activeFormats.bold}
                  title="Bold (Ctrl+B)"
                >
                  <span className="font-extrabold px-1">B</span>
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => exec("italic")}
                  active={activeFormats.italic}
                  title="Italic (Ctrl+I)"
                >
                  <span className="italic px-1 font-serif">I</span>
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => exec("underline")}
                  active={activeFormats.underline}
                  title="Underline (Ctrl+U)"
                >
                  <span className="underline px-1 font-serif underline-offset-2">
                    U
                  </span>
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => exec("insertUnorderedList")}
                  active={activeFormats.insertUnorderedList}
                  title="Bullet List"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    <circle cx="2" cy="7" r="1.5" />
                    <circle cx="2" cy="12" r="1.5" />
                    <circle cx="2" cy="17" r="1.5" />
                  </svg>
                </ToolbarBtn>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Optimization Loading Overlay */}
          <AnimatePresence>
            {isOptimizing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF9600] to-[#E65100] flex items-center justify-center text-white mb-6 shadow-2xl animate-pulse">
                  <SparklesIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#3C3C3C] mb-2 uppercase italic tracking-tight">
                  Notes-mu sedang dioptimasi
                </h3>
                <p className="text-[#AFAFAF] font-bold uppercase text-xs tracking-widest">
                  Harap jangan tutup, AI sedang bekerja...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Sidebar Widgets (25%) ── */}
        <div
          className={`lg:w-[320px] shrink-0 flex flex-col gap-6 ${isMobile ? "mt-0" : "mt-12"} px-4 md:px-0`}
        >
          {/* Mind Links Widget */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E5E5E5] shadow-sm overflow-hidden relative group min-h-[220px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-[#3C3C3C] font-extrabold text-sm tracking-wide">
                <Squares2X2Icon className="w-5 h-5 opacity-70" />
                MIND LINKS
              </h3>
              <div className="w-2 h-2 rounded-full bg-[#FF9600]" />
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden mb-4 min-h-[100px] max-h-[160px]">
              {relatedItems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {relatedItems.map((item) => (
                    <div key={item.id} className="relative group/badge">
                      <span className="bg-slate-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#3C3C3C] border border-slate-200 hover:border-[#FF9600]/30 cursor-pointer transition-all flex items-center gap-1.5 pr-2 group-hover/badge:pr-7">
                        {item.type === "category" ? (
                          <Squares2X2Icon className="w-3 h-3 text-[#FF9600] opacity-70" />
                        ) : (
                          <TagIcon className="w-3 h-3 text-[#FF9600] opacity-70" />
                        )}
                        {item.title}
                      </span>
                      <button
                        onClick={() => handleDeleteLink(item.edgeId)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/badge:opacity-100 p-1 rounded-lg text-red-500 hover:bg-white/80 transition-all"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center opacity-40">
                  <ExclamationCircleIcon className="w-8 h-8 text-[#FF9600] mb-1" />
                  <p className="text-[10px] font-bold text-[#FF9600]">
                    BELUM ADA NOTE TERHUBUNG
                  </p>
                </div>
              )}
            </div>

            <div className="relative mt-auto" ref={mindLinksRef}>
              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && availableSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute bottom-full left-0 w-full mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-30"
                  >
                    <div className="p-2 flex flex-col gap-1 max-h-[160px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                      {availableSuggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAddLink(item)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-[11px] font-bold text-[#3C3C3C] transition-colors flex items-center gap-2"
                        >
                          {item.type === "category" ? (
                            <Squares2X2Icon className="w-3 h-3 text-[#FF9600] opacity-70" />
                          ) : (
                            <LinkIcon className="w-3 h-3 text-[#FF9600] opacity-70" />
                          )}
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="text"
                value={newLink}
                onChange={(e) => {
                  setNewLink(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLink();
                  }
                }}
                placeholder="+ Hubungkan note..."
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#FF9600]/30 rounded-2xl py-2.5 px-4 text-xs font-bold text-[#3C3C3C] placeholder:text-[#AFAFAF] outline-none transition-all"
              />
            </div>
          </div>

          {/* Send to Matrix Widget */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E5E5E5] shadow-sm flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE5E5] flex items-center justify-center text-[#FF4B4B] shrink-0">
                  <Squares2X2Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[#3C3C3C] font-extrabold text-[15px]">
                    Kirim ke
                  </h3>
                  <p className="text-[#3C3C3C] font-extrabold text-[15px] -mt-1">
                    Task Matrix
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="h-10 flex items-center">
                  <button
                    onClick={() => setShowMatrixPicker(!showMatrixPicker)}
                    className={`${matrixStatus?.color || "bg-slate-100"} ${matrixStatus ? "text-white" : "text-[#AFAFAF]"} text-[9px] font-black px-3 py-1.5 rounded-xl leading-tight text-center min-w-[90px] shadow-sm hover:brightness-110 transition-all border border-transparent`}
                  >
                    {matrixStatus ? (
                      <>
                        {matrixStatus.label.split("&")[0].trim()} &
                        <br />
                        {matrixStatus.label.split("&")[1].trim()}
                      </>
                    ) : (
                      <>
                        PILIH
                        <br />
                        PRIORITAS
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {showMatrixPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 z-20 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl flex flex-col gap-1 min-w-[160px]"
                    >
                      {MATRIX_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setMatrixStatus(opt);
                            setShowMatrixPicker(false);
                          }}
                          className={`text-left text-[10px] font-bold px-3 py-2 rounded-xl transition-colors ${matrixStatus?.id === opt.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${opt.color}`}
                            />
                            {opt.label}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="h-[60px] flex items-center">
              <button
                onClick={handleAddAsQuest}
                disabled={questAdded}
                className={`w-full ${questAdded ? "bg-slate-100 text-[#AFAFAF] border-slate-200" : "bg-[#58CC02] text-white border-[#46A302] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0"} font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 border-b-4 transition-all overflow-hidden relative shadow-sm`}
              >
                <AnimatePresence mode="wait">
                  {questAdded ? (
                    <motion.span
                      key="success"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckBadgeIcon className="w-5 h-5 text-[#58CC02]" />
                      SUDAH DITAMBAHKAN
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckBadgeIcon className="w-5 h-5" />
                      TAMBAH KE TASK
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Save & AI Optimizer Widget */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E5E5E5] shadow-sm flex flex-col min-h-[260px] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-[#FF9600]/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-3 mb-6 shrink-0 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF4E5] flex items-center justify-center text-[#FF9600]">
                <BoltIcon className="w-6 h-6" />
              </div>
              <h3 className="text-[#3C3C3C] font-extrabold text-[15px]">
                Optimizer
              </h3>
            </div>

            <div className="space-y-4 mb-6 flex-1 relative z-10">
              <div className="flex items-center justify-between h-8 bg-slate-50 px-3 pr-2 py-5 rounded-2xl border border-slate-100">
                <span className="text-[#3C3C3C] font-extrabold text-xs">
                  Auto-save
                </span>
                <AnimatedToggle
                  active={autoSave}
                  onClick={() => setAutoSave(!autoSave)}
                />
              </div>

              <div className="flex items-center justify-between h-8 bg-slate-50 px-3 pr-2 py-5 rounded-2xl border border-slate-100">
                <span className="text-[#3C3C3C] font-extrabold text-xs">
                  AI Optimize
                </span>
                <AnimatedToggle
                  active={aiOptimize}
                  onClick={() => setAiOptimize(!aiOptimize)}
                  activeColor="bg-[#FF9600]"
                />
              </div>
            </div>

            <div className="h-[60px] flex items-center mt-auto relative z-10">
              <button
                onClick={handleManualSave}
                disabled={isRefreshing}
                className="w-full bg-[#FF9600] text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 border-b-4 border-[#E68600] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0 transition-all shadow-sm shrink-0 disabled:opacity-50"
              >
                <CheckBadgeIcon
                  className={`w-5 h-5 transition-transform ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "MENYIMPAN..." : "SIMPAN NOTE"}
              </button>
            </div>

            <p className="text-[#AFAFAF] text-[9px] text-center mt-3 font-bold uppercase tracking-widest relative z-10 flex-shrink-0">
              Terakhir disimpan:{" "}
              {lastSavedAt ? lastSavedAt.toLocaleTimeString() : "Just now"}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
