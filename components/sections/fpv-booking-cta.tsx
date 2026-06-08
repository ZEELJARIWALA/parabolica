"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlurReveal } from "../blur-reveal";
import Link from "next/link";

export default function FPVBookingCTA() {
    return (
        <section className="py-32 relative overflow-hidden bg-[#00FFC2]/5">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FFC2]/10 blur-[150px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[150px] -z-10" />

            <div className="container mx-auto px-6 text-center">
                <BlurReveal>
                    <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                        TAKE THE<br />
                        <span className="text-[#00FFC2]">CONTROLS</span>
                    </h2>
                </BlurReveal>

                <BlurReveal>
                    <p className="max-w-2xl mx-auto text-white/40 text-sm md:text-lg mb-12 uppercase tracking-widest font-mono">
                        Slots are limited for the Vertical Circuit experience.<br />
                        Book your flight window now.
                    </p>
                </BlurReveal>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link href="/booking">
                        <button className="bg-white text-black px-16 py-6 font-black uppercase tracking-[0.4em] text-xs hover:bg-[#00FFC2] transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                            Book Session
                        </button>
                    </Link>
                </motion.div>

                <div className="mt-16 flex justify-center items-center gap-8 text-white/20 font-mono text-[9px] tracking-[0.2em] uppercase">
                    <span>Vegas Base</span>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <span>Miami Mid</span>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <span>Cali Peak</span>
                </div>
            </div>
        </section>
    );
}
