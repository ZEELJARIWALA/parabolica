"use client";

import { motion, type Variants } from "framer-motion";

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

const TITLE = "PARABOLICA";

export default function LandingHero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8"
    >
      {/* Animated radial glow behind text */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <div className="w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-foreground/8 blur-[120px]" />
      </motion.div>

      {/* Main content with staggered entrance */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-6 sm:gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {/* Letter-by-letter animated title */}
        <motion.h1
          className="flex flex-wrap justify-center leading-[0.9] tracking-tighter font-black uppercase"
          style={{ fontSize: "clamp(3.5rem, 14vw, 14rem)" }}
          aria-label="PARABOLICA"
          initial="hidden"
          animate="visible"
          transition={{
            delayChildren: 0.3,
            staggerChildren: 0.08,
          }}
        >
          {TITLE.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className="inline-block text-foreground"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Decorative line above tagline */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent w-32 sm:w-48"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
        />

        {/* Tagline with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
        >
          <div className="h-px w-10 sm:w-16 bg-foreground/30 hidden sm:block" />
          <p className="text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase text-foreground/60 font-medium">
            Your Arena. Your Speed. Your World.
          </p>
          <div className="h-px w-10 sm:w-16 bg-foreground/30 hidden sm:block" />
        </motion.div>

        {/* Scroll cue with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-8 sm:mt-12 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 sm:h-16 bg-gradient-to-b from-foreground/50 via-foreground/30 to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* Animated accent elements */}
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-foreground/5 blur-[80px] pointer-events-none"
        animate={{
          y: [0, 30, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-40 h-40 rounded-full bg-foreground/5 blur-[80px] pointer-events-none"
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </section>
  );
}
