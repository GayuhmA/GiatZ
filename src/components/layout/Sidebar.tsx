"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HomeIcon,
  SparklesIcon,
  QueueListIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ArrowRightStartOnRectangleIcon,
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

import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/shared/Button";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed bottom-0 left-0 w-full h-[72px] md:h-screen md:w-[240px] bg-bg-card flex flex-row md:flex-col border-t md:border-t-0 md:border-r border-border z-50">
      {/* Logo Area (Hidden on mobile) */}
      <div className="hidden md:flex pt-10 pb-8 px-8 flex-row items-center gap-3">
        <Image
          src="/images/logo.webp"
          alt="GiatZ Logo"
          width={80}
          height={80}
          quality={100}
          className="w-10 h-10 rounded-full shrink-0 border-2 border-primary object-cover"
        />
        <h1 className="text-primary font-extrabold text-3xl tracking-wide font-heading">
          GiatZ
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start px-2 md:px-6 py-2 md:py-4 md:space-y-2 w-full">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
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
      <div className="hidden md:flex flex-col gap-4 p-6 mt-auto border-t border-border">
        {/* User Profile Info */}
        {user && (
          <div className="flex items-center gap-3 mb-2 px-1">
            {user.photoURL || user.photoUrl ? (
              <img
                src={user.photoURL || user.photoUrl || ""}
                alt={user.displayName || "Profile"}
                className="w-10 h-10 rounded-full border-2 border-primary object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary-dark border-2 border-primary flex items-center justify-center shrink-0">
                <span className="font-extrabold text-lg">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email
                      ? user.email.charAt(0).toUpperCase()
                      : "?"}
                </span>
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-extrabold text-text-primary truncate">
                {user.displayName || "Scholar"}
              </span>
              <span className="text-[12px] font-medium text-text-secondary truncate">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="danger"
          fullWidth
          icon={<ArrowRightStartOnRectangleIcon />}
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          LOGOUT
        </Button>
      </div>
    </aside>
  );
}
