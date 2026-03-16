"use client";

import NextImage from "next/image";

export default function LandingFooter() {
  return (
    <footer className="bg-bg-page border-t border-gray-100 py-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all cursor-pointer">
          <NextImage
            src="/images/logo.webp"
            alt="GiatZ Logo"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-lg font-black tracking-tighter uppercase text-text-primary">
            GiatZ
          </span>
        </div>

        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary">
          <p>© 2026 GiatZ. Tingkatkan Ilmu Pengetahuan.</p>
        </div>

        <div className="flex items-center gap-4">
         
        </div>
      </div>
    </footer>
  );
}
