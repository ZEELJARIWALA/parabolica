"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";

const PAIRS = [
  {
    bgCar: "/hero-slider/2026mclarencarright.png",
    heroImg: "/hero-slider/mclaren.png",
    accent: "rgba(255, 120, 0, 0.4)", // McLaren Orange
    showText: false
  },
  {
    bgCar: "/hero-slider/2026ferraricarright.png",
    heroImg: "/hero-slider/ferrari.png",
    accent: "rgba(255, 0, 0, 0.4)", // Ferrari Red
    showText: false
  },
  {
    bgCar: "/hero-slider/2026mercedescarright.png",
    heroImg: "/hero-slider/mercedes.png",
    accent: "rgba(0, 210, 190, 0.4)", // Mercedes Teal
    showText: false
  },
  {
    bgCar: "/hero-slider/2026redbullracingcarright.png",
    heroImg: "/hero-slider/redbull.png",
    accent: "rgba(12, 29, 54, 0.5)", // Red Bull Navy
    showText: true // We want the text on this slide!
  }
];

function CarSlide({ pair, i, progress }: { pair: typeof PAIRS[0], i: number, progress: MotionValue<number> }) {
  const start = i / PAIRS.length;
  const end = (i + 1) / PAIRS.length;
  const isLast = i === PAIRS.length - 1;
  
  const opacity = useTransform(
    progress, 
    isLast ? [start - 0.08, start] : [start - 0.08, start, end, end + 0.08], 
    isLast ? [0, 0.25] : [0, 0.25, 0.25, 0]
  );
  const scale = useTransform(progress, [start, end], [1, 1.15]);
  const x = useTransform(progress, [start, end], ["15%", "-15%"]);

  return (
    <motion.div
      style={{ opacity, scale, x }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-24"
    >
      <div className="relative w-full h-full max-w-[1400px]">
        <motion.img
          src={`${pair.bgCar}?v=3`}
          alt="F1 Car"
          className="w-full h-full object-contain px-4 sm:px-12 lg:px-24"
        />
      </div>
    </motion.div>
  );
}

function HeroSlide({ pair, i, progress }: { pair: typeof PAIRS[0], i: number, progress: MotionValue<number> }) {
  const start = i / PAIRS.length;
  const end = (i + 1) / PAIRS.length;
  const isLast = i === PAIRS.length - 1;
  
  // For the last slide (Red Bull), we DON'T fade out at the end
  const opacity = useTransform(
    progress, 
    isLast ? [start - 0.04, start] : [start - 0.04, start, end - 0.04, end], 
    isLast ? [0, 1] : [0, 1, 1, 0]
  );
  const x = useTransform(progress, [start - 0.1, start, end, end + 0.1], [150, 0, 0, -150]);
  const scale = useTransform(progress, [start, end], [1, 1.05]);

  return (
    <motion.div
      style={{ opacity, x, scale, transformStyle: "preserve-3d" }}
      className="absolute w-[200px] h-[280px] xs:w-[260px] xs:h-[340px] sm:w-[400px] sm:h-[520px] md:w-[500px] md:h-[650px] lg:w-[600px] lg:h-[800px] md:mr-[-10%]"
    >
      <div 
         className="relative w-full h-full"
         style={{
           maskImage: "radial-gradient(circle at 50% 50%, black 50%, transparent 85%)",
           WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 50%, transparent 85%)",
         }}
      >
        <motion.img
          src={`${pair.heroImg}?v=3`}
          alt="Hero Character"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* BRANDING TEXT - NOW HARDCODED INTO THE REDBULL SLIDE */}
      {pair.showText && (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-[-80%] sm:left-[-100%] top-1/2 -translate-y-1/2 w-[220%] sm:w-[200%] pointer-events-none mix-blend-difference"
        >
            <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] font-black tracking-tighter leading-[0.85] text-white uppercase text-left">
                PARA<br />BOLICA
            </h1>
            <p className="mt-4 sm:mt-8 text-xs sm:text-lg text-white/60 font-light max-w-xs sm:max-w-md uppercase tracking-widest leading-relaxed">
                Experience the next generation of F1 simulation and virtual reality.
            </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function SmokeEffect({ progress }: { progress: MotionValue<number> }) {
  const smokeOpacity = useTransform(
    progress,
    [0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 0.85, 0.95],
    [0, 0.4, 0, 0.4, 0, 0.4, 0, 0.4]
  );
  const smokeScale = useTransform(progress, [0, 1], [1, 1.5]);

  return (
    <div className="absolute bottom-[20%] left-[10%] right-[10%] h-32 pointer-events-none z-10 flex justify-between">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{ opacity: smokeOpacity, scale: smokeScale }}
          className="w-48 h-24 bg-white/20 blur-[60px] rounded-full"
        />
      ))}
    </div>
  );
}

export function HeroScrollSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        
        {/* Background Layer (Cars) */}
        <div className="absolute inset-0 z-0">
          {PAIRS.map((pair, i) => (
            <CarSlide key={`car-${i}`} pair={pair} i={i} progress={smoothProgress} />
          ))}
          
          <SmokeEffect progress={smoothProgress} />

          <motion.div 
            style={{ 
              background: useTransform(
                smoothProgress, 
                [0, 0.33, 0.66, 1], 
                [PAIRS[0].accent, PAIRS[1].accent, PAIRS[2].accent, PAIRS[3].accent]
              )
            }}
            className="absolute inset-0 opacity-10 blur-[120px] pointer-events-none"
          />
        </div>

        {/* Foreground Layer (Heroes) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-end px-container lg:px-32">
          {PAIRS.map((pair, i) => (
            <HeroSlide key={`hero-${i}`} pair={pair} i={i} progress={smoothProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}
