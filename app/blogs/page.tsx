import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PitwallRadioChat from "@/components/pitwall-radio-chat";
import LiveTicker from "@/components/live-ticker";
import StandingsWidget from "@/components/standings-widget";
import NewsSlider from "@/components/news-slider";
import F1Chatbot from "@/components/f1-chatbot";
import { Terminal, Flame, BookOpen, Clock, Tag, User, Radio, Activity, Send } from "lucide-react";

export const metadata: Metadata = {
    title: "F1 Live News Feed & Telemetry Blogs | Parabolica",
    description: "Catch the latest Formula 1 news, GP standing analysis, live team telemetry charts, and Parabolica's personal engineering blogs.",
    keywords: ["Formula 1", "F1 news", "GP standings", "Live F1 updates", "McLaren F1", "Red Bull Racing", "F1 simulator telemetry", "Parabolica"],
    openGraph: {
        title: "F1 Live News Feed & Telemetry Blogs | Parabolica",
        description: "Catch the latest Formula 1 news, GP standings, and Parabolica's personal simulation engineering blogs.",
        type: "website",
        images: [
            {
                url: "/f1 red.png",
                width: 1200,
                height: 630,
                alt: "Parabolica F1 Simulator"
            }
        ]
    }
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

const fallbackBlogs = [
    {
        id: "p1",
        title: "Entering the Parabolica: F1 Motion Simulation Redefined",
        summary: "Discover the core engineering powering Parabolica's motion simulators and how we merge real physics with VR gaming.",
        category: "F1 Simulation",
        author: "Parabolica Team",
        image_url: "/f1 red.png",
        created_at: "2026-06-22 10:00:00"
    },
    {
        id: "p2",
        title: "FPV Drone Academy: Master The Art of High-Speed Flight",
        summary: "FPV drone flight is defining modern electronic sports. Learn about our certification path and courses.",
        category: "FPV Drones",
        author: "Flight Control",
        image_url: "/vr_arena_hero.jpg",
        created_at: "2026-06-21 14:30:00"
    },
    {
        id: "p3",
        title: "F1 Spanish GP Preview: Can Norris Challenge Verstappen's Dominance?",
        summary: "As F1 heads to Barcelona, McLaren's high-speed package could pose the biggest threat to Red Bull's winning streak.",
        category: "F1 News",
        author: "F1 Analyst",
        image_url: "/f1 mcc.png",
        created_at: "2026-06-22 12:00:00"
    }
];

async function fetchBlogs() {
    try {
        const res = await fetch(`${API_BASE}/blogs?type=PERSONAL`, { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) return data;
        }
    } catch (err) {
        console.error("Backend offline. Loading fallback blogs telemetry:", err);
    }
    return fallbackBlogs;
}

export default async function BlogsPage() {
    const personalBlogs = await fetchBlogs();

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ffd2] selection:text-black relative overflow-hidden">
            <Navbar />

            {/* Aesthetic Backgrounds */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00ffd2]/10 blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ff006e]/5 blur-[130px]" />
            </div>

            <div className="container mx-auto px-container pt-32 pb-24 relative z-10 space-y-16">
                
                {/* 0. MINIMALIST TOP HEADING */}
                <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-12">
                     <span className="h-px w-12 bg-[#00ffd2]" />
                     <h1 className="text-sm font-light uppercase tracking-[1em] text-white/40">Pilot Logs // Blog</h1>
                </div>

                {/* 1. NEWS SLIDER SECTION */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Flame className="w-5 h-5 text-[#ff006e] animate-pulse" />
                        <h2 className="text-sm font-black italic uppercase tracking-[0.4em] text-white/60">Global Broadcast // Headlines</h2>
                    </div>
                    <NewsSlider />
                </section>

                {/* 2. DUAL TELEMETRY HUB */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-20" style={{ pointerEvents: "auto" }}>
                    <div className="space-y-6 relative z-30">
                        <div className="flex items-center gap-3 px-2">
                            <Activity className="w-5 h-5 text-[#00ffd2]" />
                            <h2 className="text-sm font-black italic uppercase tracking-[0.4em] text-white/60">Static Live Feed</h2>
                        </div>
                        <div className="relative">
                            <LiveTicker />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Terminal className="w-5 h-5 text-[#ff006e]" />
                            <h2 className="text-sm font-black italic uppercase tracking-[0.4em] text-white/60">GP Leaderboard</h2>
                        </div>
                        <StandingsWidget />
                    </div>
                </section>

                {/* 3. PITWALL AI CHATBOT */}
                <section className="space-y-6 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-3 justify-center">
                        <Radio className="w-5 h-5 text-[#00ffd2]" />
                        <h2 className="text-sm font-black italic uppercase tracking-[0.4em] text-white/60">F1 Uplink</h2>
                    </div>
                    <F1Chatbot />
                </section>

                {/* 4. PARABOLICA BLOG MARQUEE */}
                <section className="space-y-12">
                    <div className="text-center space-y-2">
                        <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">WHAT&apos;S NEW AT <span className="text-[#00ffd2]">P</span>ARABOLICA</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.5em]">LATEST DISPATCHES & OPERATIONS</p>
                    </div>

                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-8 animate-scroll hover:pause-animation">
                            {[...personalBlogs, ...personalBlogs].map((blog: any, i: number) => (
                                <Link
                                    key={`${blog.id}-${i}`}
                                    href={`/blogs/${blog.id}`}
                                    className="w-[350px] shrink-0 group/card bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#00ffd2]/40 transition-all p-6 space-y-4"
                                >
                                    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={blog.image_url || "/f1 red.png"}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover/card:scale-110 transition-transform duration-700 opacity-80"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono text-[#00ffd2] font-black uppercase italic tracking-widest">{blog.category}</span>
                                        <h4 className="text-xl font-bold italic uppercase leading-none group-hover/card:text-[#00ffd2] transition-colors">{blog.title}</h4>
                                        <p className="text-xs text-white/50 line-clamp-2 font-light">{blog.summary}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-350px * ${personalBlogs.length} - 2rem * ${personalBlogs.length})); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .pause-animation:hover {
                    animation-play-state: paused;
                }
            ` }} />
        </div>
    );
}
