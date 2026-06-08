"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlurReveal } from "../blur-reveal";

const HARDWARE_SPECS = [
    {
        title: "The Velocity-X",
        category: "FPV CAR",
        stats: ["Top Speed: 120km/h", "0-60: 1.2s", "Weight: 800g"],
        image: "/assets/menu/fpv.png",
        color: "#00FFC2"
    },
    {
        title: "Digital Nexus Goggles",
        category: "VISION",
        stats: ["4K 120FPS", "4ms Latency", "OLED Panel"],
        image: "/assets/menu/fpv.png", // Using same placeholder for now
        color: "#ff00ff"
    }
];

export default function FPVHardware() {
    return (
        <section className="py-24 bg-black overflow-hidden">
            <div className="container mx-auto px-6">
                <BlurReveal>
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-16">
                        Engineered for<br/>
                        <span className="text-[#00FFC2]">Total Control</span>
                    </h2>
                </BlurReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {HARDWARE_SPECS.map((spec, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 p-8 relative group"
                        >
                            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-white/20">
                                {spec.category} // UNIT 0{idx + 1}
                            </div>
                            
                            <h3 className="text-2xl font-bold uppercase mb-4">{spec.title}</h3>
                            
                            <div className="flex flex-col gap-2 mb-12">
                                {spec.stats.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[#00FFC2]" />
                                        <span className="text-white/40 font-mono text-xs uppercase">{s}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="relative aspect-video bg-black/40 flex items-center justify-center overflow-hidden">
                                 {/* Placeholder image icon */}
                                 <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="w-20 h-20 border-2 border-white/10 rounded-full flex items-center justify-center"
                                 >
                                    <div className="w-12 h-12 border-2 border-[#00FFC2]/50 rounded-full animate-pulse" />
                                 </motion.div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FFC2]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
