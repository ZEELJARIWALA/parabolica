"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Activity, CheckCircle2, Clock, MapPin, Search, 
    Shield, User, RefreshCcw, Calendar as CalendarIcon, 
    ChevronRight, Terminal, Zap, Users, Filter, X
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { verifyAdmin, getAdminBookings, updateBookingStatus } from "@/lib/api";

interface Booking {
    id: string;
    branch: string;
    status: string;
    created_at: string;
    booking_date: string | null;
    user_id: string;
    profiles: {
        full_name: string;
        phone_number: string;
    } | null | undefined;
    mission_configs: Array<{
        game_type: string;
        config: any;
    }> | undefined;
}

type GameFilter = "ALL" | "F1_STATIC" | "F1_MOTION" | "VR_ARENA";

const GAME_FILTER_LABELS: Record<GameFilter, string> = {
    ALL: "ALL GAMES",
    F1_STATIC: "F1 STATIC",
    F1_MOTION: "F1 MOTION",
    VR_ARENA: "VR ARENA",
};

export default function TerminalAdmin({ terminal }: { terminal: "SURAT" | "MUMBAI" }) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); // empty = no date filter (show all)
    const [gameFilter, setGameFilter] = useState<GameFilter>("ALL");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const adminData = await verifyAdmin();
                if (adminData && (adminData.terminal === terminal || adminData.terminal === 'ALL')) {
                    setIsAdmin(true);
                    fetchBookings();
                }
            } catch (err) {
                console.error("ADMIN VERIFY FAILED:", err);
            }
        };
        checkAdmin();
    }, [terminal]);

    // Re-fetch when date changes
    useEffect(() => {
        if (isAdmin) fetchBookings();
    }, [selectedDate, isAdmin]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            // Pass date only if selected, otherwise fetch ALL bookings
            const data = await getAdminBookings(terminal, selectedDate || undefined);
            setBookings(data || []);
        } catch (err) {
            console.error("BACKEND FETCH FAILED:", err);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await updateBookingStatus(id, status);
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            supabase.channel('booking-updates').send({
                type: 'broadcast',
                event: 'refresh_slots',
                payload: { bookingId: id, status }
            });
        } catch (err) {
            console.error("STATUS UPDATE FAILED:", err);
        }
    };

    // ── Client-side filtering ──────────────────────────────────────────────────
    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            b.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id.includes(searchQuery);

        const matchesGame =
            gameFilter === "ALL" ||
            (b.mission_configs || []).some(mc => {
                if (gameFilter === "F1_STATIC") return mc.game_type === "F1_STATIC" || mc.game_type === "f1_static";
                if (gameFilter === "F1_MOTION") return mc.game_type === "F1_MOTION" || mc.game_type === "f1_motion";
                if (gameFilter === "VR_ARENA")  return mc.game_type === "VR_ARENA"  || mc.game_type === "vr_arena";
                return true;
            });

        return matchesSearch && matchesGame;
    });

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <Shield className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-4xl font-black italic uppercase text-white">Access Denied</h1>
                <p className="text-white/40 mt-4 font-mono uppercase tracking-widest text-center max-w-sm">
                    Neural scan failed. Admin authorization required for Sector {terminal}.
                </p>
                <button onClick={() => window.location.href = '/'} className="mt-8 border-2 border-white/10 px-8 py-3 text-white uppercase font-black italic hover:bg-white hover:text-black transition-all">Abort</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ffd2] selection:text-black">
            <Navbar />
            
            <div className="container mx-auto px-6 pt-32 pb-20 relative">
                {/* HUD Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-end border-b border-white/5 pb-10">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-[#00ffd2] text-black px-3 py-1 text-[10px] font-black italic uppercase tracking-tighter">LIVE FEED</span>
                            <span className="text-[10px] font-mono text-white/40 tracking-[0.4em] uppercase">Sector // {terminal} // Terminal Alpha</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">MISSION LOGS</h1>
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#00ffd2]" />
                                <span className="text-sm font-mono uppercase">{filteredBookings.length} of {bookings.length} Bookings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-mono uppercase">System Nominal</span>
                            </div>
                        </div>
                    </div>

                    {/* Date + Search */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Filter by Date</label>
                                {selectedDate && (
                                    <button
                                        onClick={() => setSelectedDate("")}
                                        className="flex items-center gap-1 text-[9px] font-mono text-[#00ffd2] hover:text-white uppercase tracking-widest transition-colors"
                                    >
                                        <X className="w-2.5 h-2.5" /> Clear
                                    </button>
                                )}
                            </div>
                            <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-white/[0.03] border-2 border-white/10 p-4 font-mono text-lg uppercase outline-none focus:border-[#00ffd2] transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input 
                                type="text"
                                placeholder="FAST SEARCH PILOT / ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.03] border-2 border-white/10 p-4 pl-12 text-sm font-mono uppercase outline-none focus:border-[#00ffd2] transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Game Type Filter Pills ─────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/30 uppercase tracking-widest mr-2">
                        <Filter className="w-3 h-3" /> Filter by Game
                    </div>
                    {(Object.keys(GAME_FILTER_LABELS) as GameFilter[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setGameFilter(key)}
                            className={`px-4 py-2 text-[10px] font-black italic uppercase tracking-widest border-2 transition-all duration-200
                                ${gameFilter === key
                                    ? "bg-[#00ffd2] text-black border-[#00ffd2] shadow-[0_0_20px_rgba(0,255,210,0.3)]"
                                    : "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            {GAME_FILTER_LABELS[key]}
                        </button>
                    ))}
                    {(selectedDate || gameFilter !== "ALL" || searchQuery) && (
                        <button
                            onClick={() => { setSelectedDate(""); setGameFilter("ALL"); setSearchQuery(""); }}
                            className="ml-auto flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono text-red-400/60 hover:text-red-400 border-2 border-red-500/10 hover:border-red-500/30 uppercase tracking-widest transition-all"
                        >
                            <X className="w-3 h-3" /> Clear All Filters
                        </button>
                    )}
                </div>

                {/* Dashboard Grid */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="py-32 text-center space-y-4">
                            <RefreshCcw className="w-10 h-10 text-[#00ffd2] animate-spin mx-auto opacity-50" />
                            <p className="font-mono text-white/20 uppercase tracking-[0.5em] text-xs">Decrypting Sector Data...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="py-32 text-center border-2 border-dashed border-white/5 space-y-6">
                            <Terminal className="w-12 h-12 text-white/10 mx-auto" />
                            <p className="font-mono text-white/20 uppercase tracking-widest text-sm">
                                {bookings.length === 0
                                    ? `Quiet in ${terminal}. No missions found.`
                                    : "No missions match the current filters."}
                            </p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <SimpleMissionRow key={booking.id} booking={booking} onUpdateStatus={updateStatus} />
                        ))
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

function SimpleMissionRow({ booking, onUpdateStatus }: { booking: Booking, onUpdateStatus: (id: string, s: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const getStatusStyles = (s: string) => {
        switch (s) {
            case 'CONFIRMED': return "text-[#00ffd2] border-[#00ffd2]/20 bg-[#00ffd2]/5";
            case 'PENDING': return "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
            case 'COMPLETED': return "text-blue-400 border-blue-400/20 bg-blue-400/5";
            default: return "text-white/20 border-white/5 bg-white/5";
        }
    };

    const gameLabel = (type: string) => {
        const t = type.toUpperCase();
        if (t.includes("VR")) return "VR";
        if (t.includes("MOTION")) return "F1 MOTION";
        if (t.includes("STATIC")) return "F1 STATIC";
        if (t.includes("FPV")) return "FPV";
        return type;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white/[0.01] border-2 transition-all ${isOpen ? "border-white/20 bg-white/[0.04]" : "border-white/5 hover:border-white/10"}`}
        >
            <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-8 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                {/* Visual Status Line */}
                <div className={`w-1 lg:h-12 h-8 ${booking.status === 'CONFIRMED' ? 'bg-[#00ffd2]' : booking.status === 'COMPLETED' ? 'bg-blue-400' : booking.status === 'CANCELLED' ? 'bg-red-500/40' : 'bg-yellow-500/60'}`} />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Pilot */}
                    <div>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Pilot Identity</span>
                        <h3 className="text-xl font-black italic uppercase text-white group-hover:text-[#00ffd2] transition-colors line-clamp-1">{booking.profiles?.full_name || 'Anonymous Pilot'}</h3>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">{booking.profiles?.phone_number || 'No Uplink'}</p>
                    </div>

                    {/* Games */}
                    <div>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Mission Loadout</span>
                        <div className="flex flex-wrap gap-2">
                            {(booking.mission_configs || []).map((mc, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black italic uppercase text-white/60">
                                    {gameLabel(mc.game_type)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Booking Date</span>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3 text-white/30" />
                            <span className="text-base font-black italic uppercase text-white">
                                {booking.booking_date || "Walk-in"}
                            </span>
                        </div>
                        {booking.mission_configs?.[0]?.config?.time && (
                            <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-white/20" />
                                <span className="text-xs font-mono text-white/40">{booking.mission_configs[0].config.time}</span>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center md:justify-end gap-6">
                        <div className={`px-5 py-2 border-2 text-[10px] font-black italic uppercase tracking-widest ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                        </div>
                        <ChevronRight className={`w-5 h-5 text-white/20 transition-transform ${isOpen ? "rotate-90 text-[#00ffd2]" : ""}`} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/40 border-t border-white/5">
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Mission Chain */}
                            <div className="lg:col-span-2 space-y-6">
                                <h4 className="text-xs font-black italic uppercase tracking-widest text-[#00ffd2] flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Sequential Mission Protocol
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(booking.mission_configs || []).map((mc, i) => (
                                        <div key={i} className="bg-white/[0.03] border-2 border-white/5 p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-2xl font-black italic uppercase text-white">{gameLabel(mc.game_type)}</span>
                                                <span className="text-[10px] font-mono text-white/30">STEP 0{i+1}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-[8px] font-mono text-white/40 block">TIME</span>
                                                    <span className="text-sm font-black italic uppercase text-[#00ffd2]">{mc.config.time}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[8px] font-mono text-white/40 block">PARAMS</span>
                                                    <span className="text-xs font-mono uppercase text-white/60">{mc.config.players}P / {mc.config.duration || '20'}M</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-black italic uppercase tracking-widest text-white/40 flex items-center gap-2">
                                    <Terminal className="w-4 h-4" /> Command Override
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {(booking.status === 'PENDING') && (
                                        <button 
                                            onClick={() => onUpdateStatus(booking.id, 'CONFIRMED')}
                                            className="w-full bg-[#00ffd2] text-black py-4 font-black italic uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,210,0.2)]"
                                        >
                                            Authorize Mission
                                        </button>
                                    )}
                                    {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                        <button 
                                            onClick={() => onUpdateStatus(booking.id, 'COMPLETED')}
                                            className="w-full bg-white/5 border-2 border-white/10 text-white py-4 font-black italic uppercase hover:bg-white hover:text-black transition-all"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                    {booking.status !== 'CANCELLED' && (
                                        <button 
                                            onClick={() => onUpdateStatus(booking.id, 'CANCELLED')}
                                            className="w-full py-4 text-[10px] font-mono text-red-500/30 hover:text-red-500 uppercase tracking-[0.2em] transition-all"
                                        >
                                            Abort Request
                                        </button>
                                    )}
                                    {booking.status === 'CANCELLED' && (
                                        <div className="py-4 text-center border-2 border-red-500/20 text-red-500 text-[10px] font-mono uppercase tracking-widest">
                                            Mission Aborted
                                        </div>
                                    )}
                                    {booking.status === 'COMPLETED' && (
                                        <div className="py-4 text-center border-2 border-[#00ffd2]/20 text-[#00ffd2] text-[10px] font-mono uppercase tracking-widest">
                                            Mission Success
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 space-y-2">
                                    <span className="text-[8px] font-mono text-white/20 uppercase">Global Serial ID</span>
                                    <p className="text-[9px] font-mono text-white/40 break-all leading-none">{booking.id}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
