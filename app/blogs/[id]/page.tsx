import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, User, Calendar, Tag, Terminal, Clock, Eye } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

const fallbackBlogs = [
    {
        id: "p1",
        title: "Entering the Parabolica: F1 Motion Simulation Redefined",
        summary: "Discover the core engineering powering Parabolica's motion simulators and how we merge real physics with VR gaming.",
        content: `<p>Welcome to the Parabolica news portal. Today, we are opening the garage door to our state-of-the-art motion simulation technology.</p>
        <p>Using professional-grade VR headsets, actively responsive haptic feedback vests, and high-frequency direct-drive steering bases, we simulate precise physical feedback. When you brush the curb at Eau Rouge, you experience the telemetry feed exactly as a real driver would.</p>
        <p>Our custom software stack syncs directly with the telemetry outputs of industry-leading racing platforms, achieving latency times below 5 milliseconds. The result is a neural connection between driver inputs, physical simulation, and visual updates.</p>
        <p>This telemetric connection allows drivers to calibrate brake pressures, suspension rebounds, and steering maps, mirroring exact Formula 1 setups. Our simulation telemetry matches that used by professional constructors globally.</p>`,
        category: "F1 Simulation",
        author: "Parabolica Team",
        image_url: "/f1 red.png",
        tags: "F1, Simulator, Haptics, VR",
        seo_keywords: "F1 Simulator, Motion Platform, VR Racing, Parabolica, Telemetry, Haptics",
        seo_meta_desc: "An inside look at Parabolica's professional grade motion simulation engines, virtual reality telemetry, and telemetry sync.",
        created_at: "2026-06-22 10:00:00"
    },
    {
        id: "p2",
        title: "FPV Drone Academy: Master The Art of High-Speed Flight",
        summary: "FPV drone flight is defining modern electronic sports. Learn about our certification path and courses.",
        content: `<p>FPV drone flight has officially transformed from a hobbyist pass-time into a high-stakes aerial motorsport. Here at Parabolica, we've built a custom training stadium equipped with responsive neon gates and tracking rigs.</p>
        <p>Our curriculum is structured to support both newcomers learning hover mechanics in our software simulators, and experienced pilots seeking tactical certifications on the custom micro-quads.</p>
        <p>With high-definition digital video links running on high-gain antennae, the video stream is delivered to goggles with near-zero latency, allowing immediate reflex corrections at 80km/h.</p>`,
        category: "FPV Drones",
        author: "Flight Control",
        image_url: "/vr_arena_hero.png",
        tags: "Drones, FPV, Training, Neon Gate",
        seo_keywords: "FPV Drones, Drone Racing, Pilot Academy, Parabolica, Flight Control",
        seo_meta_desc: "Explore the thrills, digital video links, and racing course designs of the indoor FPV drone piloting setup.",
        created_at: "2026-06-21 14:30:00"
    },
    {
        id: "p3",
        title: "F1 Spanish GP Preview: Can Norris Challenge Verstappen's Dominance?",
        summary: "As F1 heads to Barcelona, McLaren's high-speed package could pose the biggest threat to Red Bull's winning streak.",
        content: `<p>Formula 1 arrives in Barcelona with the championship battle tightening up. McLaren's recent aero upgrades have shown exceptional performance in high-speed corners, making Lando Norris a genuine contender at the Circuit de Barcelona-Catalunya.</p>
        <p>Red Bull, meanwhile, is bringing local floor upgrades to counter their recent ride-height limitations over curbs. With Ferrari also sporting new sidepods, qualifying is set to be decided by thousandths of a second.</p>
        <p>In high track temperatures, tire preservation will determine the race winner. Verstappen's tire management skills will go head-to-head with Norris's qualifying speed.</p>`,
        category: "F1 News",
        author: "F1 Analyst",
        image_url: "/f1 mcc.png",
        tags: "F1, Spanish GP, Barcelona, Verstappen, Norris",
        seo_keywords: "Spanish Grand Prix, Lando Norris, Max Verstappen, Circuit de Catalunya, F1 Upgrade",
        seo_meta_desc: "A detailed technical preview of the F1 Spanish GP, analyzing the aerodynamic battle between Red Bull and McLaren.",
        created_at: "2026-06-22 12:00:00"
    }
];

async function fetchBlogById(id: string) {
    try {
        const res = await fetch(`${API_BASE}/blogs`, { cache: "no-store" });
        if (res.ok) {
            const list = await res.json();
            const found = list.find((b: any) => b.id === id);
            if (found) return found;
        }
    } catch (e) {
        console.error("Backend offline. Searching local telemetry:", e);
    }
    const foundFallback = fallbackBlogs.find((b) => b.id === id);
    return foundFallback || fallbackBlogs[0];
}

async function fetchRelatedBlogs(category: string, currentId: string) {
    try {
        const res = await fetch(`${API_BASE}/blogs`, { cache: "no-store" });
        if (res.ok) {
            const list = await res.json();
            return list.filter((b: any) => b.category === category && b.id !== currentId).slice(0, 3);
        }
    } catch (e) {
        console.error(e);
    }
    return fallbackBlogs.filter((b) => b.category === category && b.id !== currentId).slice(0, 3);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const blog = await fetchBlogById(id);
    return {
        title: `${blog.title} | Parabolica F1 Portal`,
        description: blog.seo_meta_desc || blog.summary || "Read this telemetry report on Parabolica.",
        keywords: blog.seo_keywords ? blog.seo_keywords.split(", ") : ["F1", "Motorsport", "Parabolica"],
        openGraph: {
            title: blog.title,
            description: blog.summary,
            images: [{ url: blog.image_url || "/f1 red.png" }],
            type: "article"
        }
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await fetchBlogById(id);
    const related = await fetchRelatedBlogs(blog.category, blog.id);

    // JSON-LD structured data for Google Crawlers
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://parabolica.com/blogs/${blog.id}`
        },
        "headline": blog.title,
        "description": blog.seo_meta_desc || blog.summary,
        "image": blog.image_url || "https://parabolica.com/f1 red.png",
        "author": {
            "@type": "Person",
            "name": blog.author || "Parabolica Team"
        },
        "datePublished": blog.created_at,
        "publisher": {
            "@type": "Organization",
            "name": "Parabolica",
            "logo": {
                "@type": "ImageObject",
                "url": "https://parabolica.com/logo_final.png"
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ffd2] selection:text-black relative overflow-hidden">
            {/* Inject Schema structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            {/* Smokey theme backdrops */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-zinc-800 blur-[150px] animate-smoke" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <main className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative z-10">
                
                {/* Back button & HUD telemetry strip */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-[#00ffd2] uppercase transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to feeds</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-white/30 uppercase">
                        <Terminal className="w-3 h-3 text-[#ff006e]" />
                        <span>TELEMETRY OVERLAY // DECRYPTED SECURE LINK</span>
                    </div>
                </div>

                {/* Article Header */}
                <div className="max-w-4xl mx-auto space-y-6 mb-10 text-center sm:text-left">
                    <span className="px-3 py-1 bg-[#ff006e] text-white text-[9px] font-black italic uppercase tracking-widest rounded">
                        {blog.category}
                    </span>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic uppercase leading-none tracking-tight">
                        {blog.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 font-light leading-relaxed max-w-3xl">
                        {blog.summary}
                    </p>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-[10px] font-mono text-white/40 uppercase pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#00ffd2]" />
                            BY {blog.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#00ffd2]" />
                            {new Date(blog.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#00ffd2]" />
                            7 MIN READ
                        </span>
                        <span className="flex items-center gap-1.5 ml-auto">
                            <Eye className="w-3.5 h-3.5 text-white/20" />
                            {Math.floor(100 + Math.random() * 900)} SECTOR CLICKS
                        </span>
                    </div>
                </div>

                {/* Featured image banner */}
                <div className="max-w-5xl mx-auto h-[240px] sm:h-[450px] relative rounded-2xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
                    <Image
                        src={blog.image_url || "/f1 red.png"}
                        alt={blog.title}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
                    {/* Main post text (8 cols) */}
                    <div className="lg:col-span-8 space-y-6 font-light text-white/80 text-base sm:text-lg leading-relaxed prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />

                        {/* Article Tags */}
                        {blog.tags && (
                            <div className="flex flex-wrap gap-2 pt-8 border-t border-white/5">
                                {blog.tags.split(",").map((tag: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-white/60 uppercase"
                                    >
                                        <Tag className="w-2.5 h-2.5" />
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Metadata sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl space-y-6">
                            <h3 className="font-mono text-xs font-black uppercase text-white tracking-widest pb-3 border-b border-white/5 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-[#00ffd2]" />
                                Telemetry overlay
                            </h3>
                            <div className="space-y-4 font-mono text-[10px] text-white/60 uppercase">
                                <div className="flex justify-between">
                                    <span className="text-white/30">Sector Node:</span>
                                    <span>Parabolica Alpha</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/30">Index Status:</span>
                                    <span className="text-[#00ffd2]">Crawling Ready</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/30">SEO Tags:</span>
                                    <span className="text-right max-w-[150px] truncate">{blog.seo_keywords || "General"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Related articles if any */}
                        {related.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-mono text-xs font-black uppercase text-white tracking-widest">
                                    READ NEXT LOGS
                                </h3>
                                <div className="space-y-3">
                                    {related.map((item: any) => (
                                        <Link
                                            key={item.id}
                                            href={`/blogs/${item.id}`}
                                            className="group block p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:border-[#00ffd2]/30 hover:bg-white/[0.02] transition-all"
                                        >
                                            <span className="text-[8px] font-mono text-white/30 uppercase block mb-1">
                                                {item.category}
                                            </span>
                                            <h4 className="text-xs font-bold text-white group-hover:text-[#00ffd2] transition-colors leading-snug">
                                                {item.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </main>

            <Footer />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes smoke {
                    0% { transform: scale(1) translate(0, 0) rotate(0deg); opacity: 0.15; }
                    50% { transform: scale(1.1) translate(2%, 3%) rotate(180deg); opacity: 0.25; }
                    100% { transform: scale(1) translate(0, 0) rotate(360deg); opacity: 0.15; }
                }
                .animate-smoke {
                    animation: smoke 20s infinite ease-in-out;
                }
            ` }} />
        </div>
    );
}
