"use client";

import { use } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BlurReveal } from "@/components/blur-reveal";

const DECK_DATA: Record<string, any> = {
  "birthday": {
    title: "BIRTHDAY DECK",
    subtitle: "LEVEL UP YOUR SPECIAL DAY",
    folder: "Birthday Deck",
    images: ["5.png", "6.png", "7.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png"],
    accent: "#FF4D4D",
    description: "Make your birthday legendary with immersive VR challenges, F1 racing tournaments, and a private party zone tailored for you. At Parabolica, we transform standard celebrations into high-octane digital adventures that your guests will talk about for years."
  },
  "kitty": {
    title: "KITTY PARTY",
    subtitle: "MODERN LEISURE REDEFINED",
    folder: "Kitty Party Deck",
    images: ["1.png", "2.png", "3.png", "5.png"],
    accent: "#FF4DFF",
    description: "The ultimate social gathering. Enjoy high-tech entertainment followed by premium lounge services and customized dining experiences. Our Kitty Party deck offers a sophisticated blend of social interaction and immersive gaming in an exclusive environment."
  },
  "corporate": {
    title: "CORPORATE DECK",
    subtitle: "INNOVATION & TEAM BUILDING",
    folder: "Corporate Deck",
    images: ["17.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png"],
    accent: "#4DFFFF",
    description: "Ditch the boring boardrooms. Foster team spirit with FPV drone competitions and VR escape rooms that challenge communication and strategy. Designed for high-performing teams, our corporate experiences push the boundaries of collaboration."
  },
  "walkthrough": {
    title: "PARABOLICA WALKTHROUGH",
    subtitle: "THE ARCHITECTURE OF IMMERSION",
    folder: "Parabolica Walkthrough Deck",
    images: ["24.png", "25.png", "26.png", "27.png", "28.png", "29.png", "30.png", "31.png", "32.png"],
    accent: "#4DFF4D",
    description: "Go behind the scenes of the most advanced entertainment terminal. Explore the engineering and design philosophy that makes Parabolica a singular destination for the future of digital experiences."
  }
};

export default function DeckPage({ params }: { params: Promise<{ deck: string }> }) {
  const { deck } = use(params);
  const data = DECK_DATA[deck];

  if (!data) return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-mono tracking-widest">DECK NOT FOUND</h1>
    </div>
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      
      {/* 1. About/Hero Section (Landing Page Style) */}
      <section className="relative pt-40 pb-20 px-container">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            <BlurReveal>
              <span className="text-primary font-mono tracking-[0.4em] uppercase text-xs mb-6 block">
                TERMINAL / {data.title.split(' ')[1] || "DECK"}
              </span>
            </BlurReveal>
            <BlurReveal>
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black italic tracking-tighter uppercase leading-[0.8]">
                <span className="text-[#00ffd2] drop-shadow-[0_0_15px_rgba(0,255,210,0.4)]">
                  {data.title.split(' ')[0]}
                </span>
                <br />
                <span className="text-white/20">
                  {data.title.split(' ').slice(1).join(' ') || "DECK"}
                </span>
              </h1>
            </BlurReveal>
          </div>
        </div>
        
        {/* Animated Background Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
            <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="w-1/3 h-full bg-primary shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
        </div>
      </section>

      {/* 2. 3D Stacking Gallery */}
      <section className="relative py-24 bg-[#050505]">
          <div className="container mx-auto px-container mb-24">
              <BlurReveal>
                  <h3 className="text-xs font-mono tracking-[0.5em] text-center text-white/20 uppercase mb-4">Gallery Showcase</h3>
              </BlurReveal>
              <BlurReveal>
                  <h2 className="text-4xl md:text-6xl font-black italic text-center uppercase tracking-tighter">The Experience</h2>
              </BlurReveal>
          </div>

          <div className="relative">
              {data.images.map((img: string, idx: number) => (
                  <StackedCard 
                    key={img} 
                    src={`/${data.folder}/${img}`} 
                    index={idx} 
                    total={data.images.length}
                  />
              ))}
          </div>
      </section>

      {/* 3. Footer / Call to Action */}
      <section className="py-32 flex flex-col items-center justify-center bg-black border-t border-white/5 relative overflow-hidden">
          {/* Subtle Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black italic opacity-5 select-none pointer-events-none uppercase">
              Parabolica!
          </div>

          <div className="container mx-auto px-container relative z-10 text-center">
            <BlurReveal>
                <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-16 px-6 leading-[0.85]">
                  Ready to Experience <br />
                  <span className="text-primary italic drop-shadow-[0_0_15px_rgba(0,255,210,0.4)]">Parabolica?</span>
                </h2>
            </BlurReveal>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-20">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                        href={`/booking?event=true&type=${deck}`}
                        className="px-12 py-6 border-2 border-[#00ffd2] bg-[#00ffd2] text-black font-black italic text-xl uppercase tracking-widest hover:bg-white hover:border-white transition-all shadow-[0_0_30px_rgba(0,255,210,0.3)] block"
                    >
                        Request Inquiry
                    </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                        href="https://wa.me/919702437855"
                        target="_blank"
                        className="px-12 py-6 border-2 border-white/20 bg-white/5 backdrop-blur-xl group relative overflow-hidden transition-all hover:bg-white hover:text-black block font-black italic text-xl uppercase tracking-widest"
                    >
                        Contact Us
                    </Link>
                </motion.div>
            </div>

            <BlurReveal>
                <div className="space-y-6 text-white/40 font-mono text-sm tracking-[0.2em] uppercase">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
                        <span className="hover:text-white transition-colors">+91 97024 37855</span>
                        <span className="hidden md:block text-white/10">/</span>
                        <span className="hover:text-white transition-colors">+91 99872 07826</span>
                    </div>
                    <div className="hover:text-white transition-colors">
                        @parabolica.mumbai@gmail.com
                    </div>
                </div>
            </BlurReveal>

            <div className="mt-20">
                <Link href="/#events" className="text-[10px] font-mono tracking-[0.5em] text-white/20 hover:text-primary transition-colors uppercase">
                  [ Return to Reality ]
                </Link>
            </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}

function StackedCard({ src, index, total }: { src: string; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
        ref={containerRef}
        className="sticky top-[15vh] w-full flex justify-center mb-[40vh] md:mb-[60vh] px-4 pointer-events-none perspective-2000"
        style={{ 
            height: "70vh",
            zIndex: index + 1
        }}
    >
        <motion.div 
            style={{ rotateX, scale, opacity }}
            className="relative w-full max-w-[min(85vw,450px)] md:max-w-4xl h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/80 pointer-events-auto"
        >
            <Image 
                src={src} 
                alt="Experience Detail" 
                fill 
                className="object-contain md:object-cover bg-black"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={index < 2}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 text-white/5 font-black text-[12vw] md:text-[10vw] italic tracking-tighter select-none">
                {String(index + 1).padStart(2, '0')}
            </div>
        </motion.div>
    </div>
  );
}
