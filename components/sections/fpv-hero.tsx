"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlurReveal } from "../blur-reveal";
import { ChevronDown } from "lucide-react";

export default function FPVHero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            
            {/* Background Video Placeholder or Scanline Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,194,0.15)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px]" />
                
                {/* HUD Crosshairs Decorative */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] border border-white/5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#00FFC2]/40" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#00FFC2]/40" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#00FFC2]/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#00FFC2]/40" />
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <BlurReveal>
                    <span className="text-[#00FFC2] font-mono tracking-[0.5em] uppercase text-[10px] mb-6 block">
                        Vertical Megastructure // FPV Racing Protocol
                    </span>
                </BlurReveal>

                <BlurReveal>
                    <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-8">
                        ZERO<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFC2] via-white to-[#00FFC2]/50">
                            LATENCY
                        </span>
                    </h1>
                </BlurReveal>

                <BlurReveal>
                    <p className="max-w-2xl mx-auto text-white/50 text-sm md:text-lg leading-relaxed mb-12 font-light italic">
                        Experience the world's first <span className="text-white font-bold">3-layered vertical circuit</span>. 
                        From the neon heat of <span className="text-[#ff00ff]">Vegas</span> to the tech-minimalism of <span className="text-[#00ffff]">California</span>, 
                        the boundary between pilot and machine dissolves.
                    </p>
                </BlurReveal>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <button className="group relative px-12 py-5 border border-[#00FFC2]/50 hover:border-[#00FFC2] transition-colors overflow-hidden">
                        <span className="relative z-10 font-black uppercase tracking-[0.3em] text-xs text-white group-hover:text-black transition-colors duration-300">
                            Initiate Flight
                        </span>
                        <div className="absolute inset-0 bg-[#00FFC2] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    </button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <span className="text-white/20 font-mono text-[9px] tracking-[0.4em] uppercase text-center">
                    Ascend through<br/>the layers
                </span>
                <ChevronDown className="w-4 h-4 text-[#00FFC2]/40" />
            </motion.div>
        </section>
    );
}
