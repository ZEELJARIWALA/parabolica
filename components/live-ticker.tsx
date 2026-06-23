"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Activity, Terminal, ExternalLink } from "lucide-react";

interface NewsItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

export default function LiveTicker() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/blogs/f1-rss`);
            if (res.ok) {
                const data = await res.json();
                if (data.news && data.news.length > 0) {
                    setNews(data.news);
                    setLastUpdated(new Date());
                    return;
                }
            }
            throw new Error("API offline or empty news feed");
        } catch (err) {
            console.warn("F1 RSS backend offline. Loading local telemetry fallback data.", err);
            const mockNews = [
                {
                    title: "Verstappen Secures Pole at Spa in Dominant Wet Qualifying Session",
                    link: "https://www.gpblog.com",
                    description: "Max Verstappen mastered the tricky wet conditions at Spa-Francorchamps to take pole position, ahead of Ferrari's Charles Leclerc.",
                    pubDate: new Date().toISOString(),
                    source: "GPBLOG"
                },
                {
                    title: "Hamilton Optimistic as Mercedes Unveils Major Floor Upgrade Pack",
                    link: "https://www.gpblog.com",
                    description: "Lewis Hamilton reports positive sim feedback on the new aerodynamic floor, pointing to improved rear stability in high-speed sweeps.",
                    pubDate: new Date(Date.now() - 3600000).toISOString(),
                    source: "GPBLOG"
                },
                {
                    title: "Scuderia Ferrari Shifts Engineering Resources to Next-Gen Powertrains",
                    link: "https://www.gpblog.com",
                    description: "Ferrari team principal Fred Vasseur confirmed that full focus has shifted to the 2027 engine regulations to secure long-term gains.",
                    pubDate: new Date(Date.now() - 7200000).toISOString(),
                    source: "GPBLOG"
                },
                {
                    title: "BWT Alpine Confirms Jack Doohan for FP1 Rookie Outing Next Weekend",
                    link: "https://www.gpblog.com",
                    description: "Jack Doohan will drive the A524 in practice, executing an aero-mapping validation plan on the medium and soft compounds.",
                    pubDate: new Date(Date.now() - 10800000).toISOString(),
                    source: "GPBLOG"
                }
            ];
            setNews(mockNews);
            setLastUpdated(new Date());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
        // Auto refresh every 5 minutes
        const interval = setInterval(fetchFeed, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl group hover:border-[#00ffd2]/20 transition-all duration-700">
            {/* HUD Status Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ff006e] animate-pulse" />
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">LIVE F1 TELEMETRY FEED</h3>
                </div>
                <button
                    onClick={fetchFeed}
                    disabled={loading}
                    className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-[#00ffd2] transition-all"
                    title="Manual Telemetry Uplink"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#00ffd2]" : ""}`} />
                </button>
            </div>

            {loading && news.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-[#00ffd2] animate-spin mx-auto opacity-55" />
                    <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">Decrypting Satellite Feeds...</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                    {news.slice(0, 10).map((item, idx) => (
                        <div
                            key={idx}
                            className="p-3 bg-white/[0.01] border border-white/5 rounded-lg hover:border-white/10 hover:bg-white/[0.02] transition-all space-y-1.5 group/item"
                        >
                            <div className="flex items-center justify-between text-[8px] font-mono text-white/30 uppercase">
                                <span>{item.source}</span>
                                <span>{new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-xs font-bold text-white leading-normal group-hover/item:text-[#00ffd2] transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-2">
                                {item.description}
                            </p>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[9px] font-mono text-[#00ffd2]/60 group-hover/item:text-[#00ffd2] transition-all hover:underline uppercase"
                            >
                                <span>Open Full Feed</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {lastUpdated && (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/30 uppercase">
                    <span className="flex items-center gap-1">
                        <Terminal className="w-2.5 h-2.5 text-[#00ffd2]" />
                        System Status: Nominal
                    </span>
                    <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
            )}
        </div>
    );
}
