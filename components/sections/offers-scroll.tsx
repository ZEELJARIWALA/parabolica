"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";

const offers = [
    {
        id: "1",
        title: "F1 STATIC RACING",
        category: "TECH SIMULATOR",
        discount: "25% OFF",
        rates: [
            { label: "6 Laps", price: "₹399", originalPrice: "₹499" },
            { label: "15 Min (10 Laps)", price: "₹599", originalPrice: "₹749" },
            { label: "30 Min (15 Laps)", price: "₹799", originalPrice: "₹999" },
            { label: "45 Min (20 Laps)", price: "₹999", originalPrice: "₹1,249" }
        ],
        status: "READY FOR DEPLOYMENT"
    },
    {
        id: "2",
        title: "F1 MOTION RACING",
        category: "SIMULATOR RACING",
        discount: "25% OFF",
        rates: [
            { label: "6 Laps", price: "₹599", originalPrice: "₹749" },
            { label: "15 Min (10 Laps)", price: "₹699", originalPrice: "₹899" },
            { label: "30 Min (15 Laps)", price: "₹899", originalPrice: "₹1,149" },
            { label: "45 Min (20 Laps)", price: "₹1,099", originalPrice: "₹1,399" }
        ],
        status: "READY FOR DEPLOYMENT"
    },
    {
        id: "3",
        title: "VR GAMING",
        category: "IMMERSIVE VIRTUALITY",
        discount: "25% OFF",
        rates: [
            { label: "15 Min", price: "₹799", originalPrice: "₹999" },
            { label: "30 Min", price: "₹999", originalPrice: "₹1,249" },
            { label: "45 Min", price: "₹1,149", originalPrice: "₹1,449" }
        ],
        status: "READY FOR DEPLOYMENT"
    },
    {
        id: "4",
        title: "CUSTOM COMBO",
        category: "TAILORED EXPERIENCE",
        discount: "BEST VALUE",
        rates: [
            { label: "CONTACT INFO", price: "7383756561", originalPrice: "" }
        ],
        status: "UPLINK ESTABLISHED"
    }
];

export default function OffersScroll() {
    return (
        <section
            id="offers"
            className="relative w-full py-20 md:py-32 bg-gradient-to-b from-[#030303] via-[#080808] to-[#030303] border-t border-b border-white/5 overflow-hidden"
        >
            {/* Ambient Animated Cyber-Smoke Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
                {/* Smoke Puff 1: Soft Volumetric White */}
                <motion.div
                    animate={{
                        x: [-150, 150, -150],
                        y: [-80, 80, -80],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-white/[0.02] to-transparent blur-[120px]"
                />
                {/* Smoke Puff 2: Cyber Teal Glow */}
                <motion.div
                    animate={{
                        x: [150, -150, 150],
                        y: [80, -80, 80],
                        scale: [1.2, 0.9, 1.2],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-l from-[#00ffd2]/[0.02] to-transparent blur-[150px]"
                />
                {/* Smoke Puff 3: Drift Charcoal */}
                <motion.div
                    animate={{
                        x: [-80, 80, -80],
                        y: [100, -100, 100],
                        scale: [0.95, 1.15, 0.95],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-white/[0.01] to-[#1a1a1a]/[0.04] blur-[100px]"
                />
            </div>

            {/* Static Section Header */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-20 text-center flex flex-col items-center gap-2">
                <span className="text-[#00ffd2] font-mono text-xs sm:text-sm tracking-[0.4em] uppercase font-black">
                    PARABOLICA - LAUNCH SPECIAL
                </span>
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black uppercase tracking-tighter italic leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.03)]">
                    25% OFF
                </h2>
                <div className="w-12 h-1 bg-[#00ffd2]/60 mt-4 mb-2 rounded-full" />
                <p className="text-white/40 font-mono text-[9px] md:text-xs tracking-[0.2em] uppercase">
                    HIGH-OCTANE MISSION RATES
                </p>
            </div>

            {/* Responsive Card Grid Container - Expanded to fill screen width and look premium */}
            <div className="relative z-30 max-w-[95vw] xl:max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className="group relative w-full flex flex-col justify-between overflow-visible"
                        >
                            {/* Card Glow Shadow Accent on Hover */}
                            <div className="absolute inset-0 rounded-[2rem] bg-black/50 blur-xl group-hover:bg-[#00ffd2]/5 transition-all duration-500 -z-10 translate-y-4" />

                            {/* Card Body - Sleek Cyberpunk Glassmorphism */}
                            <div className="relative flex flex-col justify-between h-full p-5 sm:p-6 lg:p-7 rounded-[2rem] ring-1 ring-white/10 shadow-2xl bg-gradient-to-br from-white/[0.04] to-black/98 backdrop-blur-xl border border-white/5 group-hover:border-[#00ffd2]/40 group-hover:shadow-[0_0_40px_rgba(0,255,210,0.1)] transition-all duration-500 min-h-[480px] overflow-hidden">
                                
                                {/* Holographic Tactical HUD Grid Background */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06]" />

                                {/* Sci-Fi HUD Corner Brackets */}
                                <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-tl-sm pointer-events-none" />
                                <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-tr-sm pointer-events-none" />
                                <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-bl-sm pointer-events-none" />
                                <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-[#00ffd2]/20 group-hover:border-[#00ffd2]/60 transition-all duration-500 rounded-br-sm pointer-events-none" />

                                {/* Top Row: Discount Tag & Index */}
                                <div className="flex justify-between items-center w-full relative z-10">
                                    <div className="bg-[#00ffd2]/10 border border-[#00ffd2]/30 text-[#00ffd2] font-black italic px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-wider rounded-md">
                                        {offer.discount}
                                    </div>
                                    <span className="text-white/20 font-mono text-[9px] sm:text-[10px] font-bold tracking-widest">
                                        [ RATE CARD 0{index + 1} ]
                                    </span>
                                </div>

                                {/* Middle Row: Content (Specialized for Custom Combo Event/Contact Card) */}
                                {offer.id === "4" ? (
                                    /* Special Custom Combo / Contact Ops Layout */
                                    <div className="my-auto flex flex-col items-center justify-center text-center relative z-10 w-full flex-grow py-4">
                                        <div className="w-16 h-16 rounded-full bg-[#00ffd2]/10 border border-[#00ffd2]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#00ffd2]/60 group-hover:shadow-[0_0_20px_rgba(0,255,210,0.2)] transition-all duration-300">
                                            <Phone className="w-6 h-6 text-[#00ffd2]" />
                                        </div>
                                        <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6 max-w-[200px] sm:max-w-[240px] font-mono uppercase tracking-wide">
                                            Planning a group event, tournament, or custom corporate mission?
                                        </p>
                                        <div className="w-full space-y-3">
                                            <span className="text-[9px] font-mono tracking-[0.4em] text-[#00ffd2] uppercase block">
                                                CONTACT INFO
                                            </span>
                                            <a 
                                                href="tel:7383756561"
                                                className="block w-full py-3 bg-[#00ffd2]/10 hover:bg-[#00ffd2] border border-[#00ffd2]/30 hover:border-transparent text-[#00ffd2] hover:text-black font-black font-mono tracking-wider rounded-xl transition-all duration-300 text-center text-sm sm:text-base cursor-pointer pointer-events-auto relative z-20"
                                            >
                                                +91 73837 56561
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    /* Standard Pricing Grid */
                                    <div className="my-6 flex flex-col justify-start relative z-10 w-full flex-grow">
                                        <span className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-3 block">
                                            LAUNCH RATES
                                        </span>
                                        
                                        {/* Pricing List with Styled High-Contrast Blocks */}
                                        <div className="space-y-3 w-full">
                                            {offer.rates.map((rate, rIdx) => {
                                                return (
                                                    <div 
                                                        key={rIdx} 
                                                        className="flex justify-between items-center px-3.5 sm:px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl group-hover:border-[#00ffd2]/30 group-hover:bg-white/[0.04] transition-all duration-300"
                                                    >
                                                        <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wide flex-shrink-0">
                                                            {rate.label}
                                                        </span>
                                                        <div className="flex items-baseline gap-1.5 flex-shrink-0">
                                                            <span className="text-sm sm:text-base lg:text-lg xl:text-xl font-black text-[#00ffd2] font-mono tracking-tight group-hover:text-white transition-colors duration-300">
                                                                {rate.price}
                                                            </span>
                                                            <span className="text-xs sm:text-sm font-bold text-white/70 font-mono line-through decoration-red-500/90 tracking-tight">
                                                                {rate.originalPrice}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Row: Title, Category & Status */}
                                <div className="space-y-2 pt-4 border-t border-white/5 relative z-10 w-full mt-auto">
                                    <div>
                                        <span className="block text-[#00ffd2] text-[9px] font-mono tracking-[0.4em] mb-1.5 font-black uppercase">
                                            {offer.category}
                                        </span>
                                        <h3 className="text-white text-lg sm:text-xl font-black tracking-tight uppercase leading-snug italic group-hover:text-[#00ffd2] transition-colors duration-300">
                                            {offer.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Status HUD Tag */}
                                    <div className="flex items-center gap-2 pt-1 text-white/20 text-[9px] font-mono tracking-widest uppercase transition-colors group-hover:text-white/40">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#00ffd2]/50 animate-pulse" />
                                        <span>[{offer.status}]</span>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Centered Booking CTA Button */}
            <div className="relative z-30 mt-16 md:mt-24 text-center">
                <Link
                    href="/booking"
                    className="inline-block bg-[#00ffd2] text-black px-10 py-4 font-black italic text-xl uppercase tracking-tighter hover:bg-white hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,210,0.25)] rounded-none cursor-pointer"
                >
                    START MISSION
                </Link>
            </div>
        </section>
    );
}
