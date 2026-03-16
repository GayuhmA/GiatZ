"use client";

import Card from "@/components/shared/Card";
import { motion } from "framer-motion";
import NextImage from "next/image";

const testimonials = [
  {
    name: "Alex",
    age: 15,
    streak: 42,
    role: "Pelajar",
    content:
      "Akhirnya saya berhasil mempelajari kata kerja bahasa Prancis! Maskot GiatZ membuat saya tetap semangat meski tantangannya sulit.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    name: "Maya",
    age: 17,
    level: 24,
    role: "Pelajar",
    content:
      "Alat Mind-Glance benar-benar mengubah cara saya menghadapi ujian biologi. Sangat adiktif!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  },
  {
    name: "Leo",
    age: 19,
    rank: "Master",
    role: "Pelajar",
    content:
      "Orbit Fokus sangat membantu kondisi ADHD saya. Robot pomodoro kecil ini adalah teman terbaik saya.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  },
];

export default function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="py-32 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <motion.div
          className="w-full lg:w-1/3 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-black text-text-primary tracking-tight leading-[1.1]">
            Apa Kata <br />
            <span className="text-primary italic">Pengguna</span> <br />
            Kami
          </h2>
          <p className="text-lg text-text-secondary font-medium leading-relaxed">
            Banyak pengguna meningkatkan nilai mereka setiap hari bersama GiatZ!
          </p>

          <div className="pt-4 md:pt-8 w-full">
            <div className="relative w-full max-w-[380px] lg:max-w-none mx-auto">
              <motion.div
                className="relative z-10 w-full h-full bg-transparent flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <NextImage
                  src="/images/gia-question.png"
                  alt="Gia Question"
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <Card className="p-10 space-y-6 bg-white border border-gray-100 shadow-sm group transition-all hover:shadow-xl hover:-translate-y-1 rounded-[3rem]">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 p-1 overflow-hidden shrink-0 transition-transform group-hover:scale-110">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-primary">
                      {t.name}, {t.age}
                    </h4>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      {t.streak
                        ? `Beruntun: ${t.streak} Hari`
                        : t.level
                          ? `Pelajar Level ${t.level}`
                          : `Peringkat ${t.rank}`}
                    </p>
                  </div>
                </div>

                <p className="text-lg text-text-primary/80 font-medium italic leading-relaxed relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-primary/10 font-serif leading-none tracking-tighter">
                    &ldquo;
                  </span>
                  {t.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
