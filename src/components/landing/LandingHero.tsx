"use client";

import Button from "@/components/shared/Button";
import { Variants, motion } from "framer-motion";
import { Brain, Sparkles, Star, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="hero"
      className="pt-24 pb-12 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 max-w-7xl mx-auto min-h-[80vh] relative overflow-visible"
    >
      <motion.div
        className="flex-1 space-y-8 text-left relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-text-primary tracking-tighter"
          variants={itemVariants}
        >
          TOOLS <br />
          <span className="text-primary italic relative">
            PRODUKTIVITAS
          </span>{" "}
          <br />
          PALING SERU <br />
          BUAT <span className="text-primary italic relative">GEN Z</span>
        </motion.h1>

        <motion.p
          className="max-w-md text-base md:text-lg text-text-secondary font-medium leading-relaxed"
          variants={itemVariants}
        >
          Kelola fokus, atur prioritas, dan kuasai materi dengan cara yang seru
          dan nggak membosankan!
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 pt-4"
          variants={itemVariants}
        >
          <Link href="/home">
            <Button
              variant="primary"
              size="lg"
              className="px-8 md:px-10 text-[10px] md:text-xs font-black tracking-widest shadow-[0_6px_0_0_var(--color-primary-dark)]"
            >
              MULAI PRODUKTIF!
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 relative w-full aspect-square lg:h-[500px] flex items-center justify-center p-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
      >
        {/* Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-primary/5 to-success/5 rounded-full blur-[100px] animate-pulse z-100"></div>

        <motion.div
          className="relative z-10 w-full h-full max-w-[800px] bg-transparent flex flex-col items-center justify-center lg:translate-x-[-5%]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-10 bg-primary/20 rounded-full blur-[80px] -z-10"></div>

          <motion.div
            className="relative w-full h-full min-h-[350px] md:min-h-[450px]"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/gia-mascot.png"
              alt="Gia Mascot"
              fill
              className="object-contain scale-[1.3]"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Floating Lucide Icons (No Container) */}
        <motion.div
          className="absolute top-10 right-[15%] text-primary"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={48} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="absolute top-[20%] left-[10%] text-secondary"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Brain size={40} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-[20%] right-[5%] text-success"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Trophy size={44} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] left-[20%] text-warning"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star size={36} strokeWidth={2.5} fill="currentColor" />
        </motion.div>
      </motion.div>
    </section>
  );
}
