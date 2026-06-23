"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlurReveal } from "../blur-reveal";
import { Eye, Cpu, Wifi, Layers } from "lucide-react";

const SPECS = [
    { icon: Eye,    label: "Visual Fidelity",  value: "4K per eye", desc: "Crystal-clear 120Hz per-eye display with no screen-door effect" },
    { icon: Cpu,    label: "Tracking",          value: "6DoF Inside-Out", desc: "Room-scale full body tracking — no external sensors needed" },
    { icon: Wifi,   label: "Latency",           value: "< 5ms",     desc: "Ultra-low latency pipeline so your brain never notices the delay" },
    { icon: Layers, label: "Field of View",     value: "120°",      desc: "Panoramic peripheral vision that consumes your entire sightline" },
];

export default function VRHeadset() {
    return (
        <section className="relative py-24 md:py-40 bg-black overflow-hidden">

            {/* Smoky atmosphere */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(255,107,0,0.07)_0%,transparent_70%)]" />
                <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_60%_80%_at_80%_30%,rgba(0,255,149,0.04)_0%,transparent_70%)]" />
                <div 
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
                    }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.15)_0%,transparent_70%)] blur-2xl" />
                        <img
                            src="/vr_headset_hero.png"
                            alt="VR Headset"
                            className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_0_80px_rgba(255,107,0,0.3)]"
                        />
                        {/* Floating badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-8 right-8 z-20 bg-black/80 border border-primary/30 backdrop-blur-md px-4 py-2"
                        >
                            <span className="text-primary font-mono text-[9px] tracking-[0.4em] uppercase block">Neural Link</span>
                            <span className="text-white font-black text-lg uppercase italic">ACTIVE</span>
                        </motion.div>
                    </motion.div>

                    {/* Text */}
                    <div>
                        <BlurReveal>
                            <span className="text-primary font-mono tracking-[0.5em] uppercase text-[10px] mb-4 block">
                                Hardware // Tier 1
                            </span>
                        </BlurReveal>
                        <BlurReveal>
                            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight mb-6">
                                SEE THE<br />
                                <span className="text-white/20" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
                                    IMPOSSIBLE
                                </span>
                            </h2>
                        </BlurReveal>
                        <BlurReveal>
                            <p className="text-white/40 text-sm md:text-base leading-relaxed mb-12 font-light">
                                Our headsets are like magic glasses. The moment you put them on, your real surroundings disappear, and you'll find yourself standing in a stunning 4K world. It's so clear and fast that your eyes and brain will believe <span className="text-white font-medium">everything you see is real</span>.
                            </p>
                        </BlurReveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SPECS.map((spec, i) => (
                                <motion.div
                                    key={spec.label}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="group p-5 bg-white/[0.03] border border-white/[0.07] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default"
                                >
                                    <spec.icon className="w-5 h-5 text-primary mb-3" />
                                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{spec.label}</div>
                                    <div className="text-white font-black italic text-lg uppercase tracking-tight mb-1">{spec.value}</div>
                                    <div className="text-[10px] text-white/30 leading-relaxed">{spec.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
