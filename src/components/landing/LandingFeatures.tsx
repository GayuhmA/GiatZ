"use client";

import Card from "@/components/shared/Card";
import {
  Timer,
  LayoutGrid,
  FileText,
  FileQuestion,
  Layers,
} from "lucide-react";
import { Variants, motion } from "framer-motion";

const features = [
  {
    title: "Orbit Fokus",
    description:
      "Masuki zona produktif dengan misi Pomodoro. Kumpulkan poin energi untuk setiap sesi belajar yang tuntas!",
    icon: <Timer size={32} className="text-secondary" />,
    color: "bg-secondary/10",
  },
  {
    title: "Prioritas Cerdas",
    description:
      "Kelola tugas harianmu dengan sistem Eisenhower. Fokus pada yang penting dan selesaikan lebih cepat!",
    icon: <LayoutGrid size={32} className="text-primary" />,
    color: "bg-primary/10",
  },
  {
    title: "Catatan Terhubung",
    description:
      "Bangun jaringan pengetahuan antar materi. Buat catatan yang saling terhubung layaknya galaksi!",
    icon: <FileText size={32} className="text-success" />,
    color: "bg-success/10",
  },
  {
    title: "Kuis Instan AI",
    description:
      "Ubah catatanmu jadi kuis interaktif secara instan. Uji pemahamanmu dan raih peringkat tertinggi!",
    icon: <FileQuestion size={32} className="text-warning" />,
    color: "bg-warning/10",
  },
  {
    title: "Flashcard Otomatis",
    description:
      "Cara tercepat menghafal konsep penting! Ringkas catatanmu menjadi flashcard pintar dalam satu klik.",
    icon: <Layers size={32} className="text-secondary-dark" />,
    color: "bg-secondary-dark/10",
  },
];

export default function LandingFeatures() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as any },
    },
  };

  return (
    <section
      id="features"
      className="py-24 md:py-32 px-6 md:px-12 bg-white relative overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50/50 to-transparent"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center space-y-4 mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
            Tingkatkan Orbit Belajarmu
          </h2>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-text-secondary">
            Jelajahi orbit pembelajaran berbasis gamifikasi kami
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-6 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const isFirstRow = index < 3;
            const colSpan = isFirstRow ? "md:col-span-2" : "md:col-span-3";

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${colSpan} flex`}
              >
                <Card className="flex flex-col items-center text-center gap-6 p-8 bg-white border border-gray-100 shadow-sm group hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.15)] transition-all cursor-default w-full relative overflow-hidden rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-[2.5rem] -translate-y-4 translate-x-4 group-hover:scale-110 group-hover:bg-primary/5 transition-transform"></div>

                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>

                  <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black text-text-primary tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-sm font-bold leading-relaxed max-w-[220px] mx-auto opacity-80">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
