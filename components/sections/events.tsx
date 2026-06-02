"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { BlurReveal } from "@/components/blur-reveal";

export default function Events() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posterNumbers = [1, 2, 3, 6, 10, 11, 13, 17, 18, 20, 21, 22, 24, 25, 26, 27, 28, 29];

  return (
    <section 
      ref={containerRef}
      id="events"
      className="relative bg-background pt-24 pb-32"
    >
      <div className="container mx-auto px-container mb-24 text-center">
        <BlurReveal>
            <h2 className="title text-6xl md:text-8xl lg:text-[10rem] mb-6">
                GALLERY
            </h2>
        </BlurReveal>
      </div>

      <div className="relative">
        {posterNumbers.map((num, index) => (
          <EventCard 
            key={num} 
            posterNum={num} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
}

function EventCard({ posterNum, index }: { posterNum: number; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Dynamic 3D Transform based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={cardRef}
      className="sticky top-[10vh] w-full flex justify-center mb-[40vh] perspective-2000"
      style={{ 
        height: "80vh",
        zIndex: index + 10 
      }}
    >
      <motion.div 
        style={{ rotateX, scale, opacity }}
        className="relative w-[90%] md:w-[85%] lg:w-[80%] h-full rounded-3xl overflow-hidden border border-white/20 bg-[#0d0d0d] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group"
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 z-0">
          <Image 
            src={`/POSTERS/${posterNum}.png`} 
            alt={`Parabolica Event ${posterNum}`}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 1280px) 90vw, 80vw"
          />
          {/* Cinematic 3D Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Floating Number indicator with parallax depth */}
        <motion.div 
          className="absolute bottom-12 right-12 text-6xl md:text-8xl font-black text-white/10 font-mono italic select-none"
          style={{ translateZ: 50 }}
        >
            {String(posterNum).padStart(2, '0')}
        </motion.div>

        {/* Dynamic Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
      </motion.div>
    </div>
  );
}
