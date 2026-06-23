import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PitwallRadioChat from "@/components/pitwall-radio-chat";
import LiveTicker from "@/components/live-ticker";
import StandingsWidget from "@/components/standings-widget";
import { Terminal, Flame, BookOpen, Clock, Tag, User } from "lucide-react";

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
        image_url: "/vr_arena_hero.png",
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
    const featuredBlog = personalBlogs[0] || fallbackBlogs[0];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ffd2] selection:text-black relative overflow-hidden">
            <Navbar />

            {/* Custom Smokey theme backdrops */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                {/* Smoke particle nodes */}
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 blur-[130px] animate-smoke" />
                <div className="absolute bottom-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 blur-[150px] animate-smoke-slow" />
                {/* Cyber grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative z-10">
                
                {/* Telemetry Status Line */}
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-6 mb-12 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00ffd2] animate-ping" />
                            <span className="font-mono text-[10px] text-[#00ffd2] uppercase tracking-[0.3em]">MISSION CONTROL // BROADCAST OVERLAY</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">F1 NEWS & PILOT PORTAL</h1>
                    </div>
                    <div className="flex gap-4 font-mono text-[10px] text-white/40 uppercase tracking-wider bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                        <span>NEXT GRAND PRIX: AUSTRIA (SPIELBERG)</span>
                        <span className="text-[#ff006e]">LIVE TIMING CONNECTED</span>
                    </div>
                </div>

                {/* Hero Layout (GPBlog style) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* Main Featured Block (Left / 8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Flame className="w-4 h-4 text-[#ff006e] animate-pulse" />
                            <span>FEATURED REPORT // LATENCY STABLE</span>
                        </div>

                        <Link
                            href={`/blogs/${featuredBlog.id}`}
                            className="group relative h-[320px] sm:h-[480px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-end p-6 sm:p-10 hover:border-[#00ffd2]/40 transition-all duration-700 shadow-2xl"
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0 scale-100 group-hover:scale-105 transition-all duration-1000">
                                <Image
                                    src={featuredBlog.image_url || "/f1 red.png"}
                                    alt={featuredBlog.title}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-4">
                                <span className="px-3 py-1 bg-[#00ffd2] text-black text-[9px] font-black italic uppercase tracking-wider rounded-md">
                                    {featuredBlog.category}
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight leading-tight group-hover:text-[#00ffd2] transition-colors">
                                    {featuredBlog.title}
                                </h2>
                                <p className="text-sm text-white/70 font-light leading-relaxed max-w-2xl line-clamp-2">
                                    {featuredBlog.summary}
                                </p>
                                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 uppercase pt-2">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5 text-white/30" />
                                        BY {featuredBlog.author}
                                    </span>
                                    <span>//</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-white/30" />
                                        {new Date(featuredBlog.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* F1 Standings Sidebar (Right / 4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#00ffd2]" />
                            <span>TELEMETRY STANDINGS</span>
                        </div>
                        <StandingsWidget />
                    </div>
                </div>

                {/* Sub Hero Live Feeds */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* RSS Live Ticker (Left / 4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#00ffd2]" />
                            <span>SATELLITE RSS NEWS FEED</span>
                        </div>
                        <LiveTicker />
                    </div>

                    {/* Pitwall Radio chat (Right / 8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#00ffd2]" />
                            <span>ENCRYPTED PILOT FREQUENCY</span>
                        </div>
                        <PitwallRadioChat />
                    </div>
                </div>

                {/* Personal Blogs grid */}
                <div className="space-y-8">
                    <div className="border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-black italic uppercase tracking-wider flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-[#ff006e]" />
                            <span>PERSONAL PILOT LOGS</span>
                        </h2>
                        <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Telemetry analysis from Parabolica engineers</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {personalBlogs.map((blog: any) => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.id}`}
                                className="group bg-white/[0.02] border border-white/10 hover:border-[#00ffd2]/30 rounded-2xl overflow-hidden flex flex-col hover:bg-white/[0.04] transition-all duration-500 shadow-xl"
                            >
                                <div className="relative h-48 w-full bg-zinc-900">
                                    <Image
                                        src={blog.image_url || "/f1 red.png"}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded-md text-[9px] font-mono text-white tracking-widest uppercase">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black italic uppercase text-white group-hover:text-[#00ffd2] transition-colors leading-snug">
                                            {blog.title}
                                        </h3>
                                        <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-2">
                                            {blog.summary}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-[9px] font-mono text-white/30 uppercase pt-4 border-t border-white/5">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {blog.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {new Date(blog.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />

            {/* Local animation style keyframes */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes smoke {
                    0% { transform: scale(1) translate(0, 0) rotate(0deg); opacity: 0.25; }
                    50% { transform: scale(1.1) translate(3%, 4%) rotate(180deg); opacity: 0.35; }
                    100% { transform: scale(1) translate(0, 0) rotate(360deg); opacity: 0.25; }
                }
                @keyframes smoke-slow {
                    0% { transform: scale(1) translate(0, 0) rotate(0deg); opacity: 0.2; }
                    50% { transform: scale(1.15) translate(-4%, 2%) rotate(-180deg); opacity: 0.3; }
                    100% { transform: scale(1) translate(0, 0) rotate(-360deg); opacity: 0.2; }
                }
                .animate-smoke {
                    animation: smoke 25s infinite ease-in-out;
                }
                .animate-smoke-slow {
                    animation: smoke-slow 35s infinite ease-in-out;
                }
            ` }} />
        </div>
    );
}
