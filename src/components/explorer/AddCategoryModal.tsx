"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onConfirm,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name);
      setName("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#3C3C3C] tracking-tight">
                    Kategori Baru
                  </h2>
                  <p className="text-[#AFAFAF] text-sm font-bold">
                    Buat kategori utama untuk catatan kamu
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-[#AFAFAF]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-[0.2em] ml-1">
                    Nama Kategori
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="contoh: MATEMATIKA, DESAIN..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[#3C3C3C] font-bold outline-none focus:border-[#FF9600] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full bg-[#FF9600] text-white font-black py-4 rounded-full border-b-4 border-[#E68600] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-b-4"
                  >
                    BUAT KATEGORI
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-[#AFAFAF] font-bold text-sm py-2 hover:text-[#3C3C3C] transition-colors"
                  >
                    BATAL
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
