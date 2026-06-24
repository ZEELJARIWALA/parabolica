"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageSquare, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockedNews = [
    {
        id: 1,
        title: "5 teams eliminated from FIFA World Cup 2026 round of 32 race",
        category: "News18",
        time: "6h",
        comments: 44,
        image: "/f1 red.png"
    },
    {
        id: 2,
        title: "McLaren Unveils High-Downforce Package for Spielberg",
        category: "Tech Report",
        time: "2h",
        comments: 12,
        image: "/f1 mcc.png"
    },
    {
        id: 3,
        title: "Max Verstappen masterclass in wet qualifying",
        category: "GP Update",
        time: "10h",
        comments: 89,
        image: "/vr_arena_hero.jpg"
    }
];

export default function NewsSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % mockedNews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const next = () => setIndex((index + 1) % mockedNews.length);
    const prev = () => setIndex((index - 1 + mockedNews.length) % mockedNews.length);

    const current = mockedNews[index];

    return (
        <div className="relative w-full h-[400px] md:h-[550px] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Sidebar / Bottom Overlay */}
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/60">
                    <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#ff006e]" />
                        {current.category} - {current.time}
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
                    {current.title}
                </h2>
                <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <MessageSquare className="w-4 h-4" />
                        {current.comments}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prev} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-[#00ffd2] hover:text-black transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={next} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-[#00ffd2] hover:text-black transition-all">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 right-12 flex gap-2">
                {mockedNews.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 transition-all duration-500 rounded-full ${i === index ? "w-12 bg-[#00ffd2]" : "w-4 bg-white/20"}`}
                    />
                ))}
            </div>
        </div>
    );
}
