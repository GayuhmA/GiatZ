import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/shared/Button";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function LandingNavbar() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["hero", "features", "testimonials"];

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("hero");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.1, 0.5, 0.8] },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto h-16 md:h-20 bg-white/70 backdrop-blur-xl border border-gray-100 px-6 md:px-10 flex items-center justify-between rounded-2xl md:rounded-[2.5rem] shadow-xl shadow-gray-200/20"
      >
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group transition-transform hover:scale-105 cursor-pointer"
        >
          <Image
            src="/images/logo.webp"
            alt="GiatZ Logo"
            width={36}
            height={36}
            className="rounded-lg shadow-sm"
          />
        <h1 className="text-primary font-extrabold text-3xl tracking-wide font-heading">
          GiatZ
        </h1>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollToSection("features")}
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer relative group ${
              activeSection === "features"
                ? "text-primary"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            Fitur
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                activeSection === "features"
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            ></span>
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer relative group ${
              activeSection === "testimonials"
                ? "text-primary"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            Testimoni
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                activeSection === "testimonials"
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            ></span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/home">
              <Button
                variant="primary"
                size="sm"
                className="px-7 py-2.5 text-xs font-black shadow-[0_4px_0_0_var(--color-primary-dark)]"
              >
                DASHBOARD
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="primary"
                size="sm"
                className="px-7 py-2.5 text-xs font-black shadow-[0_4px_0_0_var(--color-primary-dark)]"
              >
                MASUK
              </Button>
            </Link>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
