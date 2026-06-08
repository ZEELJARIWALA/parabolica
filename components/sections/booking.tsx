"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlurReveal } from "../blur-reveal";
import { useLanguage } from "@/context/language-context";
import { ArrowRight } from "lucide-react";

export default function Booking() {
  const { content } = useLanguage();

  return (
    <section id="booking" className="relative py-32 md:py-48 bg-black overflow-hidden border-t border-white/5">
      {/* Background Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-container relative z-10">
        <div className="flex flex-col items-center text-center">
            <BlurReveal>
                <span className="text-primary font-mono tracking-[0.5em] uppercase text-xs mb-8 block">
                  [ 006 / INITIATE SESSION ]
                </span>
            </BlurReveal>

            <BlurReveal>
                <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.85] mb-12">
                  Ready to <br />
                  <span className="text-[#00ffd2] drop-shadow-[0_0_15px_rgba(0,255,210,0.5)]">Enter?</span>
                </h2>
            </BlurReveal>

            <BlurReveal>
                <p className="text-white/40 text-lg md:text-2xl font-light max-w-2xl mb-16 leading-relaxed uppercase tracking-wide">
                  Secure your terminal at Parabolica. From solo F1 simulations to full-scale corporate arena takeovers.
                </p>
            </BlurReveal>

            <BlurReveal>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link 
                        href="/booking"
                        className="group relative inline-flex items-center gap-6 px-12 py-6 rounded-full bg-white text-black font-black text-xl italic uppercase tracking-tighter transition-all hover:bg-[#00ffd2] hover:shadow-[0_0_30px_rgba(0,255,210,0.5)]"
                    >
                        Book Your Zone
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </Link>
                </motion.div>
            </BlurReveal>
        </div>
      </div>

    </section>
  );
}
