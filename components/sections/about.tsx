"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";

export default function About() {
    const { content } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 3D Text Parallax Effect
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);

    return (
        <section ref={containerRef} className="relative w-full bg-background overflow-hidden py-32 md:py-48">
            <div className="container mx-auto px-4 relative z-10">
                {/* 3D Text Container */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-8">
                    <motion.div 
                        style={{ perspective: "1000px" }}
                        className="relative"
                    >
                        <motion.h2 
                            style={{ rotateX, y: y1 }}
                            className="text-6xl md:text-[10rem] lg:text-[14rem] font-bold uppercase leading-none tracking-tighter text-foreground selection:bg-primary selection:text-black italic"
                        >
                            REDEFINING
                        </motion.h2>
                        
                        <motion.div 
                            style={{ rotateX, y: y2 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 blur-sm"
                        >
                             <h2 className="text-6xl md:text-[10rem] lg:text-[14rem] font-bold uppercase leading-none tracking-tighter italic">
                                REDEFINING
                            </h2>
                        </motion.div>
                    </motion.div>

                    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 text-foreground">
                         <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-4xl md:text-7xl lg:text-8xl font-bold uppercase text-balance"
                        >
                            FIGHTING FOR <span className="text-primary italic">WINS.</span>
                        </motion.h3>

                        <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-4xl md:text-7xl lg:text-8xl font-bold uppercase text-balance"
                        >
                            BRINGING <span className="text-[#00ffd2]">IT ALL</span> IN <span className="text-[#ff006e]">ALL WAYS.</span>
                        </motion.h3>

                        <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-4xl md:text-7xl lg:text-8xl font-bold uppercase text-balance leading-tight"
                        >
                            DEFINING A <span className="text-[#aaccff] italic underline decoration-primary/50 underline-offset-8">LEGACY</span> IN <span className="text-primary">RACING.</span>
                        </motion.h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 pt-10 border-t border-border/20">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-6 text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-12 bg-primary group-hover:w-20 transition-all duration-500" />
                                    <span className="text-sm font-mono uppercase tracking-[0.3em] text-primary">
                                        Philosophy
                                    </span>
                                </div>
                                <h4 className="text-3xl md:text-4xl font-bold italic">What is Parabolica?</h4>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                                    Parabolica is a <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">high-octane technological sanctuary</span> where the physical and digital blur. We aren&apos;t just a gaming zone; we are the engine of your next adventure.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-6 text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-12 bg-[#00ffd2] group-hover:w-20 transition-all duration-500" />
                                    <span className="text-sm font-mono uppercase tracking-[0.3em] text-[#00ffd2]">
                                        Our Edge
                                    </span>
                                </div>
                                <h4 className="text-3xl md:text-4xl font-bold italic">What we offer</h4>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                                    From <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(0,255,210,0.3)]">F1 Simulators</span> that pulse with raw power to <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,0,110,0.3)]">VR Arena</span> experiences that defy logic. We bring the elite edge to every pixel.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background 3D Text Stroke */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-[0.03] select-none">
                <h2 className="text-[25vw] font-bold uppercase italic stroke-text">PARABOLICA</h2>
            </div>
            
            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 2px white;
                    color: transparent;
                }
            `}</style>
        </section>
    );
}

