"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const offers = [
    {
        id: "1",
        title: "F1 MOTION RACING",
        category: "🏎️ SIMULATOR RACING",
        discount: "25% OFF",
        rates: [
            { label: "6 Laps", price: "₹599" },
            { label: "15 Min (10 Laps)", price: "₹699" },
            { label: "30 Min (15 Laps)", price: "₹899" },
            { label: "45 Min (20 Laps)", price: "₹1,099" }
        ],
        status: "READY FOR DEPLOYMENT"
    },
    {
        id: "2",
        title: "F1 STATIC RACING",
        category: "🚥 TECH SIMULATOR",
        discount: "25% OFF",
        rates: [
            { label: "6 Laps", price: "₹399" },
            { label: "15 Min (10 Laps)", price: "₹599" },
            { label: "30 Min (15 Laps)", price: "₹799" },
            { label: "45 Min (20 Laps)", price: "₹999" }
        ],
        status: "READY FOR DEPLOYMENT"
    },
    {
        id: "3",
        title: "VR GAMING",
        category: "🥽 IMMERSIVE VIRTUALITY",
        discount: "25% OFF",
        rates: [
            { label: "15 Min", price: "₹799" },
            { label: "30 Min", price: "₹999" },
            { label: "45 Min", price: "₹1,149" }
        ],
        status: "READY FOR DEPLOYMENT"
    },
    {
        id: "4",
        title: "CUSTOM COMBO",
        category: "🛠️ TAILORED EXPERIENCE",
        discount: "BEST VALUE",
        rates: [
            { label: "CONTACT INFO", price: "7383756561" }
        ],
        status: "UPLINK ESTABLISHED"
    }
];

export default function OffersScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Smooth background color morphing within dark cybernetic tones to match the website theme
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.4, 0.8, 1.0],
        ["var(--background)", "#0d0d0d", "#050505", "var(--background)"]
    );

    // Dynamic sticky title text color (keeping it light/readable against dark backgrounds)
    const textColor = useTransform(
        scrollYProgress,
        [0.1, 0.4, 0.7, 0.9],
        ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.2)"]
    );

    // Horizontal translation mapping to move cards across the viewport relative to scroll (Adjusted for 4 cards)
    const x = useTransform(scrollYProgress, [0.05, 0.95], ["-115%", "35%"]);

    return (
        <motion.section
            id="offers"
            ref={containerRef}
            style={{ backgroundColor }}
            className="relative h-[350vh] w-full"
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">

                {/* Smokey Background Effect (Drifting Volumetric Fog) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
                    {/* Smoke Puff 1: Soft Volumetric White */}
                    <motion.div
                        animate={{
                            x: [-150, 150, -150],
                            y: [-80, 80, -80],
                            scale: [1, 1.4, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-white/[0.03] to-transparent blur-[130px]"
                    />
                    {/* Smoke Puff 2: Cyber Teal Glow */}
                    <motion.div
                        animate={{
                            x: [150, -150, 150],
                            y: [80, -80, 80],
                            scale: [1.3, 0.9, 1.3],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-l from-[#00ffd2]/[0.025] to-transparent blur-[160px]"
                    />
                    {/* Smoke Puff 3: Drift Charcoal */}
                    <motion.div
                        animate={{
                            x: [-80, 80, -80],
                            y: [120, -120, 120],
                            scale: [0.9, 1.2, 0.9],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-white/[0.02] to-[#262626]/[0.05] blur-[110px]"
                    />
                </div>

                {/* Sticky Title "25% OFF" */}
                <div className="absolute top-12 md:top-20 left-0 w-full z-20 pointer-events-none">
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]),
                        }}
                        className="px-[10vw] flex flex-col items-center justify-center gap-2"
                    >
                        <motion.h2
                            style={{ color: textColor }}
                            className="text-6xl md:text-[8rem] lg:text-[12rem] font-black uppercase tracking-tighter italic leading-none text-center"
                        >
                            25% OFF
                        </motion.h2>
                        <span className="text-[#00ffd2] font-mono text-xs sm:text-sm tracking-[0.4em] uppercase font-black">
                            PARABOLICA - LAUNCH SPECIAL
                        </span>
                    </motion.div>
                </div>

                {/* Horizontal Scrolling Offers Track */}
                <motion.div
                    style={{ x, perspective: "1200px" }}
                    className="flex gap-8 md:gap-16 px-[10vw] z-30"
                >
                    {offers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ rotateY: 15, rotateX: 5 }}
                            whileHover={{
                                rotateY: 0,
                                rotateX: 0,
                                scale: 1.02,
                                z: 20,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            style={{
                                transformStyle: "preserve-3d",
                            }}
                            className="group relative h-[48vh] md:h-[58vh] w-[80vw] sm:w-[60vw] md:w-[32vw] flex-shrink-0 overflow-visible"
                        >
                            {/* Card Shadow/Glow (Neon Teal Accent on Hover) */}
                            <div className="absolute inset-0 rounded-3xl bg-black/50 blur-2xl group-hover:bg-[#00ffd2]/5 transition-colors duration-500 -z-10 translate-y-6" />

                            {/* Card Body - Sleek Cyberpunk Glassmorphism */}
                            <div className="relative h-full w-full flex flex-col justify-between p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] ring-1 ring-white/10 shadow-2xl bg-gradient-to-br from-white/[0.02] to-black/80 backdrop-blur-xl border border-white/5 group-hover:border-[#00ffd2]/40 transition-all duration-500 overflow-hidden">
                                
                                {/* Holographic Tactical HUD Grid Background */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06]" />

                                {/* Sci-Fi HUD Corner Brackets */}
                                <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-tl-sm pointer-events-none" />
                                <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-tr-sm pointer-events-none" />
                                <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-bl-sm pointer-events-none" />
                                <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-br-sm pointer-events-none" />

                                {/* Top Row: Discount Tag & Index */}
                                <div className="flex justify-between items-center w-full relative z-10">
                                    <div className="bg-[#00ffd2]/10 border border-[#00ffd2]/30 text-[#00ffd2] font-black italic px-3 py-1 text-[10px] md:text-xs uppercase tracking-wider rounded-md">
                                        {offer.discount}
                                    </div>
                                    <span className="text-white/20 font-mono text-xs md:text-sm font-bold tracking-widest">
                                        [ RATE CARD 0{index + 1} ]
                                    </span>
                                </div>

                                {/* Middle Row: Prominent Pricing Grid (Highly Visible Price Tags) */}
                                <div className="my-auto py-4 flex flex-col justify-center relative z-10 w-full">
                                    <span className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-3.5 block">
                                        LAUNCH RATES
                                    </span>
                                    
                                    {/* Pricing List with Styled High-Contrast Blocks */}
                                    <div className="space-y-2 md:space-y-3 w-full">
                                        {offer.rates.map((rate, rIdx) => {
                                            const isPhone = rate.price === "7383756561";
                                            return (
                                                <div 
                                                    key={rIdx} 
                                                    className="flex justify-between items-center px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl group-hover:border-[#00ffd2]/20 group-hover:bg-white/[0.03] transition-all duration-300"
                                                >
                                                    <span className="text-sm md:text-base font-black text-white uppercase tracking-wide">
                                                        {rate.label}
                                                    </span>
                                                    {isPhone ? (
                                                        <a 
                                                            href={`tel:${rate.price}`}
                                                            className="text-base md:text-lg lg:text-xl font-black text-[#00ffd2] font-mono tracking-tight hover:text-white transition-colors duration-300 hover:underline decoration-2 pointer-events-auto relative z-20"
                                                        >
                                                            {rate.price}
                                                        </a>
                                                    ) : (
                                                        <span className="text-base md:text-lg lg:text-xl font-black text-[#00ffd2] font-mono tracking-tight group-hover:text-white transition-colors duration-300">
                                                            {rate.price}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Bottom Row: Title, Category & Status */}
                                <div className="space-y-2 pt-6 border-t border-white/5 relative z-10 w-full">
                                    <div>
                                        <span className="block text-[#00ffd2] text-[9px] md:text-[10px] font-mono tracking-[0.4em] mb-1 font-black uppercase">
                                            {offer.category}
                                        </span>
                                        <h3 className="text-white text-xl md:text-2xl font-black tracking-tight uppercase leading-none italic">
                                            {offer.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Status HUD Tag */}
                                    <div className="flex items-center gap-2 pt-1 text-white/20 text-[9px] font-mono tracking-widest uppercase transition-colors group-hover:text-[#00ffd2]/40">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#00ffd2]/30 animate-pulse" />
                                        <span>[{offer.status}]</span>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Navigation Prompt & Booking CTA */}
                <div className="absolute bottom-12 md:bottom-20 right-0 w-full z-20 text-center md:text-right pointer-events-none px-[10vw]">
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0.4, 0.5, 1.0], [0, 1, 1]),
                            pointerEvents: "auto"
                        }}
                        className="flex flex-col items-center md:items-end gap-6"
                    >
                        <motion.p
                            style={{ color: textColor }}
                            className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase"
                        >
                            [ SCROLL TO DISCOVER ]
                        </motion.p>

                        <motion.div
                            style={{
                                opacity: useTransform(scrollYProgress, [0.8, 0.9], [0, 1])
                            }}
                        >
                            <Link
                                href="/booking"
                                className="pointer-events-auto bg-[#00ffd2] text-black px-10 py-4 font-black italic text-xl uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,210,0.3)]"
                            >
                                START MISSION
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
