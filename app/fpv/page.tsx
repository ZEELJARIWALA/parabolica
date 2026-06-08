"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollProgress from "@/components/scroll-progress";
import Footer from "@/components/footer";
import { useLenis } from "@/components/smooth-scroll";

// We'll create these next
import FPVHero from "@/components/sections/fpv-hero";
import FPVCircuit from "@/components/sections/fpv-circuit";
import FPVHardware from "@/components/sections/fpv-hardware";
import FPVBookingCTA from "@/components/sections/fpv-booking-cta";

export default function FPVRacingPage() {
    const [isPreFlight, setIsPreFlight] = useState(true);
    const lenis = useLenis();

    useEffect(() => {
        // Pre-flight check timer
        const timer = setTimeout(() => setIsPreFlight(false), 3500);
        if (lenis) lenis.scrollTo(0, { immediate: true });
        return () => clearTimeout(timer);
    }, [lenis]);

    return (
        <main className="bg-black min-h-screen text-white overflow-hidden font-sans">
            <ScrollProgress />

            {/* ── Pre-Flight Check Intro ── */}
            <AnimatePresence>
                {isPreFlight && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center"
                    >
                        {/* Scanning HUD Effect */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div 
                                initial={{ y: "-100%" }}
                                animate={{ y: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-full h-[2px] bg-[#00FFC2]/30 shadow-[0_0_20px_#00FFC2]"
                            />
                        </div>

                        <div className="relative mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-40 h-40 border-t-2 border-[#00FFC2] rounded-full shadow-[0_0_30px_rgba(0,255,194,0.2)]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#00FFC2] font-mono text-[10px] animate-pulse tracking-[0.6em] uppercase">
                                    FPV ARMED
                                </span>
                            </div>
                        </div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-black italic uppercase tracking-[0.3em] text-2xl mb-4"
                        >
                            Pre-Flight System Check
                        </motion.h2>

                        <div className="flex flex-col gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                [ OK ] Video Link: 5.8GHz Stable
                            </motion.p>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                                [ OK ] Satellites: 18 Locked
                            </motion.p>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                                [ OK ] ESC Telemetry: Synchronized
                            </motion.p>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-[#00FFC2] font-bold">
                                [ READY ] Pilot Linked
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Page sections ── */}
            <div className={`transition-opacity duration-1000 ${isPreFlight ? "opacity-0" : "opacity-100"}`}>
                
                {/* 1. Hero — The Portal to Velocity */}
                <FPVHero />

                {/* 2. The Vertical Circuit — The 3D Scroll Journey */}
                <FPVCircuit />

                {/* 3. Hardware — The FPV Cars & Goggles */}
                <FPVHardware />

                {/* 4. Book a Flight CTA */}
                <FPVBookingCTA />

                <Footer />
            </div>
        </main>
    );
}
