"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BlurReveal } from "@/components/blur-reveal";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, ArrowLeft, MapPin, CheckCircle2, Zap, Activity, Cpu, Shield, Search,
    Users, Clock, Calendar, ChevronRight, ChevronLeft, Info, Trophy, User, Monitor,
    Eye, Rocket, CreditCard, Gamepad2, Dices, Palmtree, Building2, PartyPopper, Mail, Send, Fingerprint, Lock, ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useLenis } from "@/components/smooth-scroll";
import { supabase } from "@/lib/supabase";
import { createBooking, submitInquiry, getSlotsAvailability } from "@/lib/api";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ✅ 15-MIN INTERVAL SLOT GENERATOR
// From 11:00 AM to 11:00 PM (23:00)
// Hides slots that have already passed if the date is today.
function generateTimeSlots(dateStr: string) {
    const slots = [];
    const start = 11 * 60; // 11:00 AM
    const finalTime = 23 * 60; // 11:00 PM (1380 mins)

    const today = new Date();
    // Use local time for comparison
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const isToday = dateStr === todayStr;
    const currentMinutes = today.getHours() * 60 + today.getMinutes();

    for (let time = start; time <= finalTime; time += 15) {
        // If today, only show future slots (with a 5 min grace)
        if (isToday && time <= currentMinutes + 5) continue;

        const hours = Math.floor(time / 60);
        const mins = time % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        slots.push(timeStr);
    }
    return slots;
}
type Step = "AUTH" | "LOCATION" | "EXPERIENCES" | "GAME_CONFIG" | "DETAILS" | "CONFIRM" | "INQUIRY" | "SUCCESS";

export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-[2px] bg-[#00ffd2]" />
                    <span className="text-[10px] font-mono text-[#00ffd2] tracking-[1em] uppercase animate-pulse">Initializing Hub...</span>
                </div>
            </div>
        }>
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const { content } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const lenis = useLenis();
    const [isBooted, setIsBooted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // FOR DEMO, WE START FALSE
    const [step, setStep] = useState<Step>("AUTH");
    const [branch, setBranch] = useState<"SURAT" | "MUMBAI" | "">("");
    const [selectedExps, setSelectedExps] = useState<string[]>([]);

    const [pilot, setPilot] = useState({ name: "", phone: "", email: "", msg: "" });
    const [inquiry, setInquiry] = useState({ type: "BIRTHDAY", location: "" });
    const [vrConfig, setVrConfig] = useState({ players: 1, duration: 30, time: "", date: "" });
    const [f1Config, setF1Config] = useState({ type: "" as any, mode: "" as any, players: 1, time: "", date: "" });
    const [fpvConfig, setFpvConfig] = useState({ package: "" as any, players: 1, time: "", date: "" });


    const [currentConfigIndex, setCurrentConfigIndex] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    setStep("AUTH");
  };


    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ REALTIME SYNC - Listen for status updates from Admin
    useEffect(() => {
        const channel = supabase.channel('booking-updates')
            .on('broadcast', { event: 'refresh_slots' }, (payload) => {
                console.log("REALTIME: SLOT REFRESH TRIGGERED", payload);
                setRefreshKey(prev => prev + 1);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
            setTimeout(() => lenis.scrollTo(0, { immediate: true }), 50);
        }
    }, [lenis, step, currentConfigIndex]);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("BOOKING AUTH CHANGE:", event, session);
            if (session) {
                setIsAuthenticated(true);
                setUserEmail(session.user.email ?? null);
            } else {
                setIsAuthenticated(false);
                setUserEmail(null);
                setStep("AUTH");
            }
            setIsBooted(true);
        });

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                setUserEmail(session.user.email ?? null);
            }
            setIsBooted(true);
        };
        checkSession();

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const autoGame = searchParams.get("game");
        const isEvent = searchParams.get("event") === "true";
        const eventType = searchParams.get("type");

        if (isAuthenticated) {
            if (isEvent) {
                setStep("INQUIRY");
                if (eventType) setInquiry(prev => ({ ...prev, type: eventType.toUpperCase() }));
            } else if (autoGame && !selectedExps.includes(autoGame)) {
                if (autoGame === "SPECIAL_EVENT") {
                    setStep("INQUIRY");
                } else {
                    setSelectedExps([autoGame]);
                    setStep("LOCATION");
                }
            } else if (step === "AUTH") {
                setStep("LOCATION");
            }
        }
    }, [searchParams, isAuthenticated]);

    const steps = [
        { id: "LOCATION", label: "TERMINAL" },
        { id: "EXPERIENCES", label: "MISSIONS" },
        { id: "GAME_CONFIG", label: "CALIBRATE" },
        { id: "DETAILS", label: "PILOT" },
        { id: "CONFIRM", label: "TRANSMIT" },
    ];

    const availableGames = [
        { id: "VR_ARENA", title: "VR ARENA", sub: "FULL MOTION DECK", icon: Shield },
        { id: "F1_MOTION", title: "F1 MOTION", sub: "KINETIC RACING", icon: Activity },
        { id: "FPV_GAMING", title: "FPV GAMING", sub: "DRONE PILOTING", icon: Cpu, branch: "SURAT" },
        { id: "SPECIAL_EVENT", title: "SPECIAL EVENT", sub: "PRIVATE MODULES", icon: PartyPopper, isSpecial: true },
    ];

    const filteredGames = availableGames.filter(g => !g.branch || g.branch === branch);

    const handleBack = () => {
        if (step === "EXPERIENCES") setStep("LOCATION");
        if (step === "INQUIRY") setStep("LOCATION");
        if (step === "GAME_CONFIG") {
            if (currentConfigIndex > 0) setCurrentConfigIndex(p => p - 1);
            else setStep("EXPERIENCES");
        }
        if (step === "DETAILS") setStep("GAME_CONFIG");
        if (step === "CONFIRM") setStep("DETAILS");
    };

    const handleNextConfig = () => {
        if (currentConfigIndex < selectedExps.length - 1) {
            setCurrentConfigIndex(idx => idx + 1);
        } else {
            setStep("DETAILS");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#00ffd2] selection:text-black font-sans">
            <AnimatePresence>
                {!isBooted && (
                    <motion.div key="loader" exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-[2px] bg-[#00ffd2]" />
                            <span className="text-[10px] font-mono text-[#00ffd2] tracking-[1em] uppercase animate-pulse">Syncing Network...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Navbar />

            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 10] }}>
                    <PlexusBackground />
                </Canvas>
            </div>

            <div className="container mx-auto px-container pt-32 md:pt-44 pb-20 md:pb-32 relative z-10">
                {isAuthenticated && userEmail && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8 bg-white/[0.03] border border-white/5 p-4 rounded-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-[#00ffd2] rounded-full animate-pulse" />
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Active Pilot ID</span>
                                <p className="text-[10px] font-mono text-white/60 uppercase">{userEmail}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-[9px] font-mono text-white/20 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                        >
                            [ TERMINATE_SESSION ]
                        </button>
                    </motion.div>
                )}

                {step !== "SUCCESS" && step !== "AUTH" && (
                    <div className="flex items-center justify-between mb-8 md:mb-16 border-b border-white/5 pb-6 md:pb-8">
                        <div className="flex items-center gap-8">
                            {step !== "LOCATION" && (
                                <button onClick={handleBack} className="flex items-center gap-3 text-[9px] md:text-[10px] font-mono text-white/40 hover:text-[#00ffd2] transition-colors uppercase tracking-[0.2em] md:tracking-[0.3em]">
                                    <ChevronLeft className="w-3 h-3" /> [ BACK ]
                                </button>
                            )}
                        </div>
                        {step !== "INQUIRY" && (
                            <div className="flex gap-1.5 md:gap-2">
                                {steps.map((s, i) => (
                                    <div key={s.id} className={`h-0.5 md:h-1 w-4 md:w-8 transition-all duration-700 ${steps.findIndex(st => st.id === step) >= i ? "bg-[#00ffd2]" : "bg-white/10"}`} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === "AUTH" && !isAuthenticated && (
                        <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} className="max-w-md mx-auto py-12">
                            <AuthScreen onAuthenticated={async () => { setIsAuthenticated(true); const { data: { session } } = await supabase.auth.getSession(); setUserEmail(session?.user?.email ?? null); setStep("LOCATION"); }} />
                        </motion.div>
                    )}

                    {step === "AUTH" && isAuthenticated && (
                        <motion.div key="auth-signed-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-12 text-center space-y-8">
                            <div className="space-y-4">
                                <span className="text-[#00ffd2] font-mono text-[10px] tracking-[0.5em] uppercase">Pilot Authenticated</span>
                                <h2 className="text-4xl font-black italic uppercase">Ready for Mission?</h2>
                                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Active ID: {userEmail}</p>
                            </div>
                            <button onClick={() => setStep("LOCATION")} className="w-full bg-[#00ffd2] text-black py-6 font-black uppercase text-xl italic hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,210,0.3)]">
                                INITIALIZE HUB TERMINAL
                            </button>
                            <button onClick={handleLogout} className="text-[10px] font-mono text-white/20 hover:text-red-500 transition-colors uppercase tracking-[0.3em]">
                                Change Pilot ID
                            </button>
                        </motion.div>
                    )}

                    {step === "LOCATION" && (
                        <motion.div key="st1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-16">
                            <h1 className="text-4xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">SELECT <br /><span className="text-white/10">TERMINAL.</span></h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                <PrecisionCard name="SURAT" code="VT-01" loc="VESU, SURAT" active={branch === "SURAT"} onClick={() => { setBranch("SURAT"); setStep("EXPERIENCES"); }} />
                                <PrecisionCard name="MUMBAI" code="MH-02" loc="MAHARASHTRA" active={branch === "MUMBAI"} onClick={() => { setBranch("MUMBAI"); setStep("EXPERIENCES"); }} />
                            </div>
                        </motion.div>
                    )}

                    {step === "EXPERIENCES" && (
                        <motion.div key="st2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-16">
                            <h1 className="text-4xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">MISSION <br /><span className="text-white/10">SELECT.</span></h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredGames.map((game, i) => (
                                    <PrecisionGameCard
                                        key={game.id}
                                        title={game.title}
                                        sub={game.sub}
                                        icon={game.icon}
                                        selected={selectedExps.includes(game.id)}
                                        onClick={() => {
                                            if (game.isSpecial) {
                                                setInquiry({ ...inquiry, location: branch });
                                                setStep("INQUIRY");
                                            } else {
                                                setSelectedExps(prev => prev.includes(game.id) ? prev.filter(p => p !== game.id) : [...prev, game.id]);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end pt-8 md:pt-12 border-t border-white/5">
                                <button onClick={() => setStep("GAME_CONFIG")} disabled={selectedExps.length === 0} className="group bg-[#00ffd2] text-black px-10 md:px-16 py-4 md:py-6 font-black uppercase text-lg md:text-xl italic hover:bg-white disabled:opacity-20 transition-all flex items-center gap-4 md:gap-6">
                                    INITIALIZE CONFIG <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "INQUIRY" && (<InquiryForm data={inquiry} pilot={pilot} setPilot={setPilot} onChange={(v: any) => setInquiry({ ...inquiry, ...v })} onSubmit={() => setStep("SUCCESS")} />)}

                    {step === "GAME_CONFIG" && (
                        <div className="space-y-8 md:space-y-12">
                            <h1 className="text-4xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">CALIBRATE <br /><span className="text-white/10">{selectedExps[currentConfigIndex].replace('_', ' ')}</span></h1>
                            {selectedExps[currentConfigIndex] === "VR_ARENA" && (<PrecisionVRModule config={vrConfig} onChange={(v: any) => setVrConfig({ ...vrConfig, ...v })} onComplete={handleNextConfig} branch={branch} refreshKey={refreshKey} />)}
                            {selectedExps[currentConfigIndex] === "F1_MOTION" && (<F1ConfigModule config={f1Config} onChange={(v: any) => setF1Config({ ...f1Config, ...v })} onComplete={handleNextConfig} branch={branch} refreshKey={refreshKey} />)}
                            {selectedExps[currentConfigIndex] === "FPV_GAMING" && (<FPVConfigModule config={fpvConfig} onChange={(v: any) => setFpvConfig({ ...fpvConfig, ...v })} onComplete={handleNextConfig} branch={branch} refreshKey={refreshKey} />)}
                        </div>
                    )}

                    {step === "DETAILS" && (
                        <motion.div key="st4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12 md:space-y-20">
                            <div className="text-center space-y-2 md:space-y-4">
                                <span className="text-[#00ffd2] font-mono text-[9px] md:text-[10px] tracking-[0.5em] md:tracking-[1em] uppercase block">Identity Registry</span>
                                <h1 className="text-4xl md:text-8xl font-black italic uppercase">PILOT INTEL</h1>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:gap-12">
                                <input value={pilot.name} onChange={(e) => setPilot({ ...pilot, name: e.target.value })} className="w-full bg-transparent border-b-2 border-white/10 pb-2 md:pb-4 text-2xl md:text-5xl font-black italic uppercase outline-none focus:border-[#00ffd2] transition-all placeholder:text-white/5" placeholder="FULL NAME" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    <input value={pilot.phone} onChange={(e) => setPilot({ ...pilot, phone: e.target.value })} className="w-full bg-transparent border-b-2 border-white/10 pb-2 md:pb-4 text-lg md:text-2xl font-bold uppercase outline-none focus:border-[#00ffd2] transition-all placeholder:text-white/10" placeholder="UPLINK NUMBER" />
                                    <input value={pilot.email} onChange={(e) => setPilot({ ...pilot, email: e.target.value })} className="w-full bg-transparent border-b-2 border-white/10 pb-2 md:pb-4 text-lg md:text-2xl font-bold uppercase outline-none focus:border-[#00ffd2] transition-all placeholder:text-white/10" placeholder="EMAIL IDENTITY" />
                                </div>
                            </div>
                            <button onClick={() => setStep("CONFIRM")} disabled={!pilot.name || !pilot.email} className="w-full bg-[#00ffd2] text-black py-6 md:py-10 font-black uppercase text-xl md:text-3xl italic hover:bg-white transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(0,255,210,0.2)]">PREVIEW MISSION</button>
                        </motion.div>
                    )}

                    {step === "CONFIRM" && (<MissionReview data={{ branch, selectedExps, vrConfig, f1Config, fpvConfig, pilot }} onFinalize={() => setStep("SUCCESS")} />)}

                    {step === "SUCCESS" && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto text-center space-y-8 md:space-y-12 py-12 md:py-24 px-4">
                            <div className="flex justify-center"><div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-[#00ffd2] flex items-center justify-center"><CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-[#00ffd2]" /></div></div>
                            <div className="space-y-4 md:space-y-6"><h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none">MISSION <br />TRANSMITTED.</h1><p className="text-white/40 font-mono text-[10px] md:text-xs tracking-widest uppercase leading-relaxed max-w-md mx-auto">System scan complete. Our operations tactical team will establish a neural uplink with you shortly to finalize deployment.</p></div>
                            <button onClick={() => {
                                handleLogout(); // Force logout and return to start
                                router.push("/");
                            }} className="px-10 py-4 border-2 border-white/10 font-black italic uppercase hover:bg-white hover:text-black transition-all text-sm md:text-base">Return to Reality</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}

// ── AUTH SCREEN ──

function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
    const [mode, setMode] = useState<"LOGIN" | "JOIN">("JOIN");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [connStatus, setConnStatus] = useState<"SYNCING" | "ONLINE" | "ERROR">("SYNCING");

    useEffect(() => {
        // QUICK CHECK: Try to get a non-existent session just to verify the URL/Key are working
        supabase.auth.getSession().then(({ error }) => {
            if (error) setConnStatus("ERROR");
            else setConnStatus("ONLINE");
        }).catch(() => setConnStatus("ERROR"));
    }, []);

    const handleAuth = async () => {
        if (!email || !pass) return;
        setLoading(true);
        setError("");
        console.log("INITIATING AUTH PROTOCOL:", { mode, email });

        try {
            if (mode === "JOIN") {
                const { data, error: signupError } = await supabase.auth.signUp({
                    email,
                    password: pass,
                    options: {
                        data: {
                            full_name: "New Pilot",
                        }
                    }
                });

                if (signupError) {
                    console.error("SIGNUP ERROR:", signupError);
                    throw signupError;
                }

                if (data.user) {
                    console.log("SIGNUP SUCCESS:", data.user);
                    if (data.session) {
                        onAuthenticated();
                    } else {
                        alert("ID REGISTERED. Please check your email for a verification link to activate your uplink.");
                        setMode("LOGIN");
                    }
                }
            } else {
                const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password: pass });
                if (loginError) {
                    console.error("LOGIN ERROR:", loginError);
                    throw loginError;
                }
                console.log("LOGIN SUCCESS:", data.user);
                onAuthenticated();
            }
        } catch (err: any) {
            console.error("AUTH EXCEPTION:", err);
            // Translate common fetch errors to user-friendly messages
            if (err.message === "Failed to fetch") {
                setError("NETWORK BLOCKED: Could not reach Mission Control. Check your internet or Supabase URL.");
            } else {
                setError(err.message || "Uplink failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-10 border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Lock className="w-20 h-20" /></div>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <span className="text-[9px] font-mono text-[#00ffd2] tracking-[0.6em] uppercase block">Security Gate</span>
                    <h2 className="text-4xl font-black italic uppercase">LOGIN / SIGN UP</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${connStatus === 'ONLINE' ? 'bg-[#00ffd2] animate-pulse' : connStatus === 'ERROR' ? 'bg-red-500' : 'bg-white/20'}`} />
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{connStatus}</span>
                </div>
            </div>

            {connStatus === "ERROR" && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-[9px] font-mono uppercase leading-relaxed">
                    CRITICAL: INVALID BACKEND KEYS. <br /> CHECK .env.local AND RESTART SERVER.
                </div>
            )}

            <div className="flex border-b border-white/5">
                <button onClick={() => setMode("JOIN")} className={`flex-1 py-4 font-black italic uppercase text-xs tracking-widest transition-all ${mode === "JOIN" ? "text-[#00ffd2] border-b-2 border-[#00ffd2]" : "text-white/20"}`}>New Account</button>
                <button onClick={() => setMode("LOGIN")} className={`flex-1 py-4 font-black italic uppercase text-xs tracking-widest transition-all ${mode === "LOGIN" ? "text-[#00ffd2] border-b-2 border-[#00ffd2]" : "text-white/20"}`}>Existing User</button>
            </div>

            <div className="space-y-6">
                {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-mono uppercase tracking-widest">{error}</div>}

                <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 font-bold text-sm outline-none focus:border-[#00ffd2] transition-all" placeholder="YOUR@EMAIL.COM" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 font-bold text-sm outline-none focus:border-[#00ffd2] transition-all" placeholder="********" />
                    </div>
                </div>
            </div>

            <button
                onClick={handleAuth}
                disabled={loading || !email || !pass}
                className="w-full bg-[#00ffd2] text-black py-5 font-black uppercase text-xl italic flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-20"
            >
                {loading ? "PROCESSING..." : mode === "JOIN" ? "CREATE ACCOUNT" : "LOGIN NOW"} <ShieldCheck className="w-6 h-6" />
            </button>

            <p className="text-[9px] font-mono text-center text-white/20 uppercase leading-relaxed font-bold tracking-widest">
                Parabolica Booking System. <br /> Your data is safe and secure.
            </p>
        </motion.div>
    )
}

// ── SPECIAL INQUIRY FORM ──

function InquiryForm({ data, pilot, setPilot, onChange, onSubmit }: any) {
    const [submitting, setSubmitting] = useState(false);

    const handleInquirySubmit = async () => {
        setSubmitting(true);
        try {
            // Use the Backend API instead of direct Supabase
            await submitInquiry({
                event_type: data.type,
                location: data.location,
                pilot_name: pilot.name,
                pilot_email: pilot.email,
                pilot_phone: pilot.phone,
                message: pilot.msg
            });

            onSubmit();
        } catch (err: any) {
            console.error("INQUIRY ERROR:", err);
            alert(`Protocol Request Failed: ${err.message || 'Unknown error'}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8 md:space-y-16">
            <div className="text-center space-y-2 md:space-y-4"><span className="text-[9px] md:text-[10px] font-mono text-[#00ffd2] tracking-[0.5em] md:tracking-[1em] uppercase block">Special Protocol Inquiry</span><h1 className="text-4xl md:text-7xl font-black italic uppercase">PRIVATE EVENT</h1></div>
            <div className="grid grid-cols-1 gap-8 md:gap-12 border border-white/10 bg-white/[0.02] p-8 md:p-24 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12"><div className="space-y-2 md:space-y-4"><label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">Event Classification</label><select value={data.type} onChange={(e) => onChange({ type: e.target.value })} className="w-full bg-black border-2 border-white/10 p-3 md:p-4 font-black italic uppercase text-lg md:text-xl outline-none focus:border-[#00ffd2] appearance-none cursor-pointer"><option value="BIRTHDAY">BIRTHDAY PARTY</option><option value="KITTY">KITTY PARTY</option><option value="CORPORATE">CORPORATE DECK</option><option value="WALKTHROUGH">PRIVATE WALKTHROUGH</option></select></div><div className="space-y-2 md:space-y-4"><label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">Deployment Terminal</label><select value={data.location} onChange={(e) => onChange({ location: e.target.value })} className="w-full bg-black border-2 border-white/10 p-3 md:p-4 font-black italic uppercase text-lg md:text-xl outline-none focus:border-[#00ffd2] appearance-none cursor-pointer"><option value="">SELECT HUB</option><option value="SURAT">VESU, SURAT</option><option value="MUMBAI">MUMBAI TERMINAL</option></select></div></div>
                <div className="grid grid-cols-1 gap-8 md:gap-12"><div className="space-y-2 md:space-y-4"><label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">Lead Pilot Name</label><input value={pilot.name} onChange={(e) => setPilot({ ...pilot, name: e.target.value })} className="w-full bg-transparent border-b-2 border-white/10 pb-2 md:pb-4 text-xl md:text-3xl font-black italic uppercase outline-none focus:border-[#00ffd2] transition-all" placeholder="FULL NAME" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"><input value={pilot.phone} onChange={(e) => setPilot({ ...pilot, phone: e.target.value })} className="w-full bg-transparent border-b-2 border-white/10 pb-2 md:pb-4 text-lg font-bold uppercase outline-none focus:border-[#00ffd2] transition-all" placeholder="CONTACT NUMBER" /> <input value={pilot.email} onChange={(e) => setPilot({ ...pilot, email: e.target.value })} className="w-full bg-transparent border-b-2 border-white/10 pb-2 md:pb-4 text-lg font-bold uppercase outline-none focus:border-[#00ffd2] transition-all" placeholder="EMAIL IDENTITY" /></div><div className="space-y-2 md:space-y-4"><label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em]">Mission Parameters</label><textarea rows={3} value={pilot.msg} onChange={(e) => setPilot({ ...pilot, msg: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 p-4 md:p-6 font-bold uppercase text-xs outline-none focus:border-[#00ffd2] transition-all resize-none" placeholder="DESCRIBE YOUR VISION..." /></div></div>
                <button onClick={handleInquirySubmit} disabled={submitting || !data.location || !pilot.name || !pilot.email} className="w-full bg-[#00ffd2] text-black py-6 md:py-8 font-black uppercase text-xl md:text-2xl italic flex items-center justify-center gap-4 md:gap-6 group hover:bg-white transition-all disabled:opacity-20 text-center">
                    {submitting ? "SENDING REQUEST..." : "REQUEST PROTOCOL"} <Send className={`w-5 h-5 md:w-6 md:h-6 transition-transform ${!submitting ? 'group-hover:translate-x-3' : ''}`} />
                </button>
            </div>
        </motion.div>
    )
}

// ── SHARED COMPONENTS ──

function MissionReview({ data, onFinalize }: any) {
    const [transmitting, setTransmitting] = useState(false);

    const handleTransmit = async () => {
        setTransmitting(true);
        try {
            // 1. Prepare Mission Configs
            const mission_configs = [];
            if (data.selectedExps.includes("VR_ARENA")) {
                mission_configs.push({ game_type: 'VR_ARENA', config: data.vrConfig });
            }
            if (data.selectedExps.includes("F1_MOTION")) {
                mission_configs.push({ game_type: 'F1_MOTION', config: data.f1Config });
            }
            if (data.selectedExps.includes("FPV_GAMING")) {
                mission_configs.push({ game_type: 'FPV_GAMING', config: data.fpvConfig });
            }

            // 2. Transmit to FastAPI Backend
            await createBooking({
                branch: data.branch,
                pilot_name: data.pilot.name,
                pilot_phone: data.pilot.phone,
                booking_date: data.vrConfig.date || data.f1Config.date || data.fpvConfig.date || undefined,
                mission_configs: mission_configs
            });

            onFinalize();
            // Automatically sign out after 5 seconds or upon returning home
            setTimeout(() => {
                supabase.auth.signOut();
            }, 5000);
        } catch (err: any) {
            console.error("TRANSMISSION FAILURE:", err);
            alert(`Mission Transmission Failed: ${err.message || 'Check terminal'}`);
        } finally {
            setTransmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto space-y-8 md:space-y-16 pb-12 md:pb-20">
            <div className="text-center space-y-2"><span className="text-[9px] md:text-[10px] font-mono text-white/20 tracking-[0.5em] md:tracking-[1em] uppercase block">Manifest Summary</span><h1 className="text-4xl md:text-8xl font-black italic uppercase leading-none">MISSION <br className="md:hidden" /> PACK.</h1></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
                <div className="lg:col-span-4 border border-white/10 bg-white/[0.02] p-6 md:p-10 space-y-6 md:space-y-8">
                    <div className="text-[9px] font-mono text-[#00ffd2] uppercase tracking-widest border-b border-white/5 pb-2 md:pb-4">Registrar</div>
                    <div className="space-y-2 md:space-y-4"><div className="text-2xl md:text-4xl font-black italic uppercase truncate">{data.pilot.name}</div><div className="text-[10px] font-mono text-white/30 uppercase">{data.pilot.phone}</div><div className="text-[10px] font-mono text-white/30 truncate">{data.pilot.email}</div></div>
                </div>
                <div className="lg:col-span-8 border border-white/10 bg-white/[0.02] p-6 md:p-10 space-y-6 md:space-y-10">
                    <div className="text-[9px] font-mono text-[#00ffd2] uppercase tracking-widest border-b border-white/5 pb-2 md:pb-4">Sequence</div>
                    <div className="space-y-3 md:space-y-4">
                        {data.selectedExps.includes("VR_ARENA") && <ReviewItem title="VR ARENA" meta={`${data.vrConfig.players}P // ${data.vrConfig.duration} MIN`} time={data.vrConfig.time} />}
                        {data.selectedExps.includes("F1_MOTION") && <ReviewItem title={`F1 ${data.f1Config.type}`} meta={`${data.f1Config.players}P // ${data.f1Config.mode}`} time={data.f1Config.time} />}
                        {data.selectedExps.includes("FPV_GAMING") && <ReviewItem title={`FPV ${data.fpvConfig.package}`} meta={`${data.fpvConfig.players}P`} time={data.fpvConfig.time} />}
                    </div>
                    <div className="pt-6 md:pt-8 border-t border-white/5 flex justify-between items-center text-[#00ffd2]"><span className="font-mono text-[9px] md:text-xs uppercase tracking-widest">Sector: {data.branch} HUB</span><div className="text-2xl md:text-4xl font-black italic">MISSION READY</div></div>
                </div>
            </div>
            <button onClick={handleTransmit} disabled={transmitting} className="w-full bg-[#00ffd2] text-black py-8 md:py-10 font-black uppercase text-2xl md:text-3xl italic flex items-center justify-center gap-4 md:gap-6 group hover:bg-white transition-all disabled:opacity-50">
                {transmitting ? <><Activity className="w-6 h-6 animate-pulse" /> UPLOADING MANIFEST...</> : <><Rocket className="w-6 h-6 md:w-8 md:h-8" /> TRANSMIT MISSION</>}
            </button>
        </motion.div>
    )
}

function ReviewItem({ title, meta, time }: any) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-4 md:p-6 border-l-2 border-[#00ffd2]">
            <div><div className="text-lg md:text-xl font-black italic uppercase truncate max-w-[150px] md:max-w-none">{title}</div><div className="text-[9px] font-mono text-white/30 uppercase">{meta}</div></div>
            <div className="text-xl md:text-2xl font-mono text-[#00ffd2]">{time}</div>
        </div>
    )
}

function FPVConfigModule({ config, onChange, onComplete, branch, refreshKey }: any) {
    const today = new Date().toISOString().split('T')[0];
    const packages = [{ id: "VEGAS", name: "LAS VEGAS", sub: "CASINO CITY", icon: Dices }, { id: "MIAMI", name: "MIAMI", sub: "NEON COAST", icon: Palmtree }, { id: "CALI", name: "CALIFORNIA", sub: "TECH CITY", icon: Building2 },];
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    useEffect(() => {
        if (config.date) {
            getSlotsAvailability(branch, "FPV_GAMING", config.date)
                .then(res => setBookedSlots(res.booked_slots || []))
                .catch(() => setBookedSlots([]));
        }
    }, [config.date, branch, refreshKey]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-16 border border-white/10 bg-white/[0.02] p-6 md:p-24 relative overflow-hidden">
            <div className="space-y-4 md:space-y-8"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-[#00ffd2]">Select Global Sector</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">{packages.map(p => (<button key={p.id} onClick={() => onChange({ package: p.id })} className={`p-6 md:p-10 border-2 text-left transition-all ${config.package === p.id ? "bg-[#00ffd2] border-[#00ffd2] text-black" : "border-white/5 hover:border-white/20 text-white"}`}><p.icon className={`w-6 h-6 md:w-10 md:h-10 mb-4 md:mb-6 ${config.package === p.id ? "text-black" : "text-[#00ffd2]"}`} /><h5 className="text-xl md:text-3xl font-black italic uppercase leading-none mb-2">{p.name}</h5><p className={`text-[9px] font-mono uppercase tracking-widest ${config.package === p.id ? "text-black/60" : "text-white/30"}`}>{p.sub}</p></button>))}</div></div>
            <div className="space-y-4 pt-8 border-t border-white/5">
                <h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-[#00ffd2]">Flight Date</h4>
                <input
                    type="date"
                    min={today}
                    value={config.date}
                    onChange={(e) => onChange({ date: e.target.value })}
                    className="bg-white/[0.03] border-2 border-white/10 p-4 font-mono text-lg uppercase outline-none focus:border-[#00ffd2] transition-all w-full md:w-auto [color-scheme:dark]"
                />
            </div>
            {config.package && config.date && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-8 md:pt-12 border-t border-white/5"><div className="space-y-6 md:space-y-8"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-white/40">Driver Squadron</h4><div className="flex flex-wrap gap-2 md:gap-3">{[1, 2, 4, 6].map(n => (<button key={n} onClick={() => onChange({ players: n })} className={`w-12 h-12 md:w-16 md:h-16 border-2 font-black text-lg md:text-xl ${config.players === n ? "bg-white text-black border-white" : "border-white/5"}`}>{n}P</button>))}</div></div><div className="space-y-6 md:space-y-8"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-white/40">Launch Time</h4><div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 md:gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">{generateTimeSlots(config.date).map(s => {
                const isBooked = bookedSlots.includes(s);
                return (<button key={s} disabled={isBooked} onClick={() => onChange({ time: s })} className={`py-3 md:py-4 border-2 font-mono text-[9px] md:text-xs transition-all ${isBooked ? "opacity-20 bg-red-900/10 border-red-900/30 cursor-not-allowed" : config.time === s ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "border-white/5"}`}>{isBooked ? "OCCUPIED" : s}</button>);
            })}</div></div></motion.div>)}
            <button onClick={onComplete} disabled={!config.time || !config.date} className="w-full bg-[#00ffd2] text-black py-6 md:py-8 font-black uppercase text-xl md:text-2xl italic hover:bg-white transition-all mt-8 md:mt-12 disabled:opacity-20 shadow-[0_0_20px_rgba(0,255,210,0.2)]">CONNECT FPV DRIFT</button>
        </motion.div>
    )
}

function F1ConfigModule({ config, onChange, onComplete, branch, refreshKey }: any) {
    const today = new Date().toISOString().split('T')[0];
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    useEffect(() => {
        if (config.date) {
            getSlotsAvailability(branch, "F1_MOTION", config.date)
                .then(res => setBookedSlots(res.booked_slots || []))
                .catch(() => setBookedSlots([]));
        }
    }, [config.date, branch, refreshKey]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-16 border border-white/10 bg-white/[0.02] p-6 md:p-24 relative overflow-hidden">
            <div className="space-y-4 md:space-y-8"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-[#00ffd2]">Choose Tier</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">{[{ id: "FULL", label: "MOTION + VR", sub: "PEAK SENSORY", icon: Eye }, { id: "MOTION", label: "MOTION ONLY", sub: "G-FORCE SIM", icon: Activity }, { id: "STATIC", label: "STATIC COCKPIT", sub: "TECHNICAL FOCUS", icon: Monitor }].map(t => (<button key={t.id} onClick={() => onChange({ type: t.id })} className={`p-6 md:p-10 border-2 text-left transition-all ${config.type === t.id ? "bg-[#00ffd2] border-[#00ffd2] text-black" : "border-white/5 hover:border-white/20 text-white"}`}><t.icon className={`w-6 h-6 md:w-10 md:h-10 mb-4 md:mb-6 ${config.type === t.id ? "text-black" : "text-[#00ffd2]"}`} /><h5 className="text-xl md:text-3xl font-black italic uppercase leading-none mb-2">{t.label}</h5><p className={`text-[9px] font-mono uppercase tracking-widest ${config.type === t.id ? "text-black/60" : "text-white/20"}`}>{t.sub}</p></button>))}</div></div>
            <div className="space-y-4 pt-8 border-t border-white/5">
                <h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-[#00ffd2]">Race Date</h4>
                <input
                    type="date"
                    min={today}
                    value={config.date}
                    onChange={(e) => onChange({ date: e.target.value })}
                    className="bg-white/[0.03] border-2 border-white/10 p-4 font-mono text-lg uppercase outline-none focus:border-[#00ffd2] transition-all w-full md:w-auto [color-scheme:dark]"
                />
            </div>
            {config.type && config.date && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-8 md:pt-12 border-t border-white/5"><div className="space-y-4 md:space-y-6"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-white/40">Race Protocol</h4><div className="flex gap-2"><button onClick={() => onChange({ mode: "SOLO", players: 1 })} className={`flex-1 p-4 md:p-6 border-2 font-black italic uppercase text-sm md:text-base ${config.mode === "SOLO" ? "bg-white text-black border-white" : "border-white/10"}`}>SOLO PRACTICE</button><button onClick={() => onChange({ mode: "RACE" })} className={`flex-1 p-4 md:p-6 border-2 font-black italic uppercase text-sm md:text-base ${config.mode === "RACE" ? "bg-white text-black border-white" : "border-white/10"}`}>GRAND PRIX</button></div><AnimatePresence>{config.mode === "RACE" && (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 md:space-y-6 mt-6"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-white/40">Number of Pilots</h4><div className="flex flex-wrap gap-2 md:gap-3">{[1, 2, 4, 6, 8].map(n => (<button key={n} onClick={() => onChange({ players: n })} className={`w-12 h-12 md:w-16 md:h-16 border-2 font-black text-lg md:text-xl transition-all ${config.players === n ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "border-white/5"}`}>{n}P</button>))}</div></motion.div>)}</AnimatePresence></div><div className="space-y-6 md:space-y-8"><h4 className="text-lg md:text-xl font-black italic uppercase tracking-widest text-white/40">Select Grid Time</h4><div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 md:gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">{generateTimeSlots(config.date).map(s => {
                const isBooked = bookedSlots.includes(s);
                return (<button key={s} disabled={isBooked} onClick={() => onChange({ time: s })} className={`py-3 md:py-4 border-2 font-mono text-[9px] md:text-xs transition-all ${isBooked ? "opacity-20 bg-red-900/10 border-red-900/30 cursor-not-allowed" : config.time === s ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "border-white/5"}`}>{isBooked ? "OCCUPIED" : s}</button>);
            })}</div></div></motion.div>)}
            <button onClick={onComplete} disabled={!config.time || !config.date} className="w-full bg-[#00ffd2] text-black py-6 md:py-8 font-black uppercase text-xl md:text-2xl italic hover:bg-white transition-all mt-8 md:mt-12 disabled:opacity-20 shadow-[0_0_20px_rgba(0,255,210,0.2)]">CONFIRM F1 RACER</button>
        </motion.div>
    )
}

function PrecisionCard({ name, code, loc, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`group relative p-6 md:p-12 text-left border transition-all duration-700 min-h-[280px] md:min-h-[400px] flex flex-col justify-between overflow-hidden ${active ? "border-[#00ffd2] bg-white/[0.03]" : "border-white/10 bg-white/[0.01] hover:border-white/20"}`}>
            <div className={`absolute top-0 right-0 w-12 md:w-24 h-12 md:h-24 border-t border-r transition-colors duration-700 ${active ? "border-[#00ffd2]" : "border-white/5"}`} />
            <div className="relative z-10 pt-2 md:pt-4"><span className="text-[#00ffd2] font-mono text-[8px] md:text-[9px] tracking-[0.4em] md:tracking-[0.6em] mb-2 md:mb-4 block uppercase opacity-40">System Node // {code}</span><h3 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.75] tracking-tighter">{name}<br /><span className="text-white/5">HUB.</span></h3></div>
            <div className="flex items-center justify-between border-t border-white/5 pt-4 md:pt-8 relative z-10"><div className="space-y-1"><p className="text-white/30 font-mono text-[8px] md:text-[10px] uppercase tracking-widest">{loc}</p><div className="flex items-center gap-2 md:gap-3"><div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${active ? "bg-[#00ffd2] animate-pulse" : "bg-white/10"}`} /><span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight">{active ? "SYNC_OK" : "STANDBY"}</span></div></div><ArrowRight className={`w-8 h-8 md:w-12 md:h-12 transition-transform ${active ? "translate-x-2 text-[#00ffd2]" : "text-white/5"}`} /></div>
        </button>
    )
}

function PrecisionGameCard({ title, sub, icon: Icon, selected, onClick }: any) {
    return (
        <button onClick={onClick} className={`group relative p-6 md:p-8 text-left border transition-all duration-700 min-h-[280px] md:min-h-[420px] flex flex-col justify-between ${selected ? "border-[#00ffd2] bg-white/[0.05]" : "border-white/5 bg-white/[0.01] hover:border-white/10"}`}>
            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8 py-4 md:py-10 border-b border-white/5 mb-4 md:mb-8"><Icon className={`w-12 h-12 md:w-20 md:h-20 transition-all duration-700 ${selected ? "text-[#00ffd2] scale-110 drop-shadow-[0_0_15px_rgba(0,255,210,0.4)]" : "text-white/10 group-hover:text-white/30"}`} /></div>
            <div className="space-y-2 md:space-y-4"><h4 className="text-2xl md:text-4xl font-black italic uppercase leading-none">{title}</h4><p className="text-[8px] md:text-[9px] font-mono text-white/30 tracking-widest uppercase">{sub}</p></div>
            <div className="flex items-center justify-between mt-4 md:mt-8 pt-4 md:pt-8 border-t border-white/5"><span className={`text-[8px] md:text-[10px] font-mono uppercase tracking-widest ${selected ? "text-[#00ffd2]" : "text-white/20"}`}>{selected ? "ARMED" : "READY"}</span><div className={`w-4 h-4 md:w-5 md:h-5 border-2 flex items-center justify-center ${selected ? "border-[#00ffd2]" : "border-white/10"}`}>{selected && <motion.div layoutId="check-sq" className="w-2 md:w-2.5 h-2 md:h-2.5 bg-[#00ffd2]" />}</div></div>
        </button>
    )
}

function PrecisionVRModule({ config, onChange, onComplete, branch, refreshKey }: any) {
    const today = new Date().toISOString().split('T')[0];
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    useEffect(() => {
        if (config.date) {
            getSlotsAvailability(branch, "VR_ARENA", config.date)
                .then(res => setBookedSlots(res.booked_slots || []))
                .catch(() => setBookedSlots([]));
        }
    }, [config.date, branch, refreshKey]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-8 md:gap-12 border border-white/10 bg-white/[0.02] p-8 md:p-24 relative overflow-hidden">
            <div className="space-y-6 md:space-y-12 relative z-10 pt-8 md:pt-12 border-b border-white/5 pb-12"><h4 className="text-2xl md:text-5xl font-black italic uppercase text-[#00ffd2]">Mission Date</h4><input type="date" min={today} value={config.date} onChange={(e) => onChange({ date: e.target.value })} className="bg-white/[0.03] border-2 border-white/10 p-4 md:p-6 font-mono text-lg md:text-2xl uppercase outline-none focus:border-[#00ffd2] transition-all w-full md:w-auto [color-scheme:dark]" /></div>
            
            {config.date && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 md:space-y-24"><div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative z-10"><div className="space-y-6 md:space-y-12"><h4 className="text-2xl md:text-5xl font-black italic uppercase text-white/40">Squad Count</h4><div className="flex flex-wrap gap-2 md:gap-3">{[1, 2, 4, 6].map(n => (<button key={n} onClick={() => onChange({ players: n })} className={`w-14 h-14 md:w-20 md:h-20 border-2 font-black text-xl md:text-2xl transition-all ${config.players === n ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "border-white/5"}`}>{n}P</button>))}</div></div><div className="space-y-6 md:space-y-12"><h4 className="text-2xl md:text-5xl font-black italic uppercase text-white/40">Deployment</h4><div className="flex gap-2 md:gap-4">{[30, 45].map(d => (<button key={d} onClick={() => onChange({ duration: d })} className={`flex-1 p-4 md:p-8 border-2 text-left transition-all ${config.duration === d ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "border-white/5"}`}><span className="text-2xl md:text-4xl font-black italic block uppercase">{d} MIN</span></button>))}</div></div></div><div className="space-y-6 md:space-y-12 relative z-10 pt-8 md:pt-12 border-t border-white/5"><h4 className="text-2xl md:text-5xl font-black italic uppercase text-white/40">Secure Uplink Slot</h4><div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">{generateTimeSlots(config.date).map(s => {
                const isBooked = bookedSlots.includes(s);
                return (<button key={s} disabled={isBooked} onClick={() => onChange({ time: s })} className={`py-4 md:py-6 border-2 font-mono text-[10px] md:text-sm transition-all ${isBooked ? "opacity-20 bg-red-900/10 border-red-900/30 cursor-not-allowed" : config.time === s ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "border-white/5"}`}>{isBooked ? "OCCUPIED" : s}</button>);
            })}</div></div></motion.div>)}
            <button onClick={onComplete} disabled={!config.time || !config.date} className="w-full bg-[#00ffd2] text-black py-6 md:py-8 font-black uppercase text-xl md:text-2xl italic hover:bg-white disabled:opacity-30 mt-8 md:mt-12 shadow-[0_0_20px_rgba(0,255,210,0.2)]">COMPLETE CALIBRATION</button>
        </motion.div>
    )
}

function PlexusBackground() {
    const mesh = useRef<THREE.Points>(null!);
    const linesRef = useRef<THREE.LineSegments>(null!);
    const count = 40;
    const positions = useRef(new Float32Array(count * 3));
    const vels = useRef(new Float32Array(count * 3));
    useEffect(() => {
        for (let i = 0; i < count; i++) {
            positions.current.set([(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10], i * 3);
            vels.current.set([(Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01], i * 3);
        }
    }, []);
    useFrame((state) => {
        const pos = mesh.current.geometry.attributes.position.array as Float32Array;
        const lines: number[] = [];
        for (let i = 0; i < count; i++) {
            const i3 = i * 3; pos[i3] += vels.current[i3]; pos[i3 + 1] += vels.current[i3 + 1];
            if (Math.abs(pos[i3]) > 10) vels.current[i3] *= -1;
            if (Math.abs(pos[i3 + 1]) > 10) vels.current[i3 + 1] *= -1;
            for (let j = i + 1; j < count; j++) {
                const j3 = j * 3; const dx = pos[i3] - pos[j3]; const dy = pos[i3 + 1] - pos[j3 + 1];
                if (Math.sqrt(dx * dx + dy * dy) < 3.5) { lines.push(pos[i3], pos[i3 + 1], pos[i3 + 2], pos[j3], pos[j3 + 1], pos[j3 + 2]); }
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
        linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    });
    return (<group><points ref={mesh}> <bufferGeometry> <bufferAttribute attach="attributes-position" count={count} array={positions.current} itemSize={3} args={[positions.current, 3]} /> </bufferGeometry> <pointsMaterial size={0.1} color="#00ffd2" transparent opacity={0.2} /> </points><lineSegments ref={linesRef}> <bufferGeometry /> <lineBasicMaterial color="#00ffd2" transparent opacity={0.05} /> </lineSegments></group>);
}