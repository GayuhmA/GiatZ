"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HomeIcon,
  SparklesIcon,
  QueueListIcon,
  GlobeAltIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  SparklesIcon as SparklesIconSolid,
  QueueListIcon as QueueListIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
} from "@heroicons/react/24/solid";

const navItems = [
  { name: "HOME", href: "/", iconOutline: HomeIcon, iconSolid: HomeIconSolid },
  {
    name: "FOCUS ORBIT",
    href: "/orbit",
    iconOutline: SparklesIcon,
    iconSolid: SparklesIconSolid,
  },
  {
    name: "TASK MATRIX",
    href: "/matrix",
    iconOutline: QueueListIcon,
    iconSolid: QueueListIconSolid,
  },
  {
    name: "EXPLORER",
    href: "/explorer",
    iconOutline: GlobeAltIcon,
    iconSolid: GlobeAltIconSolid,
  },
  {
    name: "TRAIN CAMP",
    href: "/camp",
    iconOutline: AcademicCapIcon,
    iconSolid: AcademicCapIconSolid,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 w-full h-[72px] md:h-screen md:w-[240px] bg-bg-card flex flex-row md:flex-col border-t md:border-t-0 md:border-r border-border z-50">
      {/* Logo Area (Hidden on mobile) */}
      <div className="hidden md:flex pt-10 pb-8 px-8 flex-row items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <AcademicCapIconSolid className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-primary font-extrabold text-2xl tracking-wide">
          GIATZ
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start px-2 md:px-6 py-2 md:py-4 md:space-y-2 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconSolid : item.iconOutline;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 px-2 md:px-5 py-2 md:py-3.5 rounded-xl md:rounded-full text-[10px] md:text-[15px] font-bold uppercase tracking-wide transition-colors duration-200 ${
                isActive ? "text-primary" : "text-slate-500 hover:bg-gray-50"
              }`}
            >
              {/* Animated active pill background */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-primary-light border-2 border-orange-100 rounded-xl md:rounded-full"
                  style={{ zIndex: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Icon & label (above the pill) */}
              <Icon className="w-6 h-6 md:w-[22px] md:h-[22px] relative z-10" />
              <span className="text-center relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA (Hidden on mobile) */}
      <div className="hidden md:block p-6 mt-auto">
        <button className="w-full bg-primary text-white font-bold uppercase tracking-wide py-3 px-4 rounded-full border-b-4 border-primary-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all text-[15px]">
          GO PREMIUM
        </button>
      </div>
    </aside>
  );
}
