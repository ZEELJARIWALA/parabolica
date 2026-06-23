"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Radio, User, Terminal, HelpCircle, Activity, ShieldCheck, MessageSquare } from "lucide-react";

interface QnaItem {
    id: string;
    username: string;
    question: string;
    answer: string | null;
    answered_by: string | null;
    created_at: string;
    likes: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

const mockQnas: QnaItem[] = [
    {
        id: "mock-1",
        username: "LEWIS_44",
        question: "HOW IS THE TYRE DEGRADATION ON THE HARD COMPONENT COMPARED TO SIMULATIONS?",
        answer: "BASED ON OUR LATEST TELEMETRY RUNS, THE HARD COMPONENT (C2) SHOWS A DEGRADATION GRADIENT OF 0.08S PER LAP, ALIGNING WITH CURRENT SIM MODELS.",
        answered_by: "Pitwall AI",
        created_at: new Date(Date.now() - 1800000).toISOString(),
        likes: 12
    },
    {
        id: "mock-2",
        username: "MAX_33",
        question: "CAN THE SIMULATOR SIMULATE THE BUMPINESS OF MONACO ACCURATELY?",
        answer: "YES, PARABOLICA'S HYDRAULIC ACTUATORS OPERATE AT 150HZ, MAPPING THE MONACO TRACK SURFACE SCAN DOWN TO 2MM SPECIFIC BUMPS.",
        answered_by: "Pitwall AI",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        likes: 8
    }
];

export default function PitwallRadioChat() {
    const [messages, setMessages] = useState<QnaItem[]>([]);
    const [username, setUsername] = useState("");
    const [question, setQuestion] = useState("");
    const [askAi, setAskAi] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initial seed username
    useEffect(() => {
        const storedUser = localStorage.getItem("parabolica_chat_user");
        if (storedUser) {
            setUsername(storedUser);
        } else {
            const randId = Math.floor(1000 + Math.random() * 9000);
            const generated = `PILOT_#${randId}`;
            setUsername(generated);
            localStorage.setItem("parabolica_chat_user", generated);
        }
        fetchQnas();
    }, []);

    // Scroll to bottom on new message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const fetchQnas = async () => {
        try {
            const res = await fetch(`${API_BASE}/blogs/qna`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                return;
            }
            throw new Error("Response not OK");
        } catch (err) {
            console.warn("Failed to fetch Q&As from server, loading mock telemetry database:", err);
            setMessages(mockQnas);
        }
    };

    const handleUsernameChange = (val: string) => {
        const cleaned = val.replace(/\s+/g, "_").slice(0, 15);
        setUsername(cleaned);
        localStorage.setItem("parabolica_chat_user", cleaned);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError("");
        
        const payload = {
            username: username || "ANON_PILOT",
            question: question.trim(),
            ask_ai: askAi
        };

        try {
            const res = await fetch(`${API_BASE}/blogs/qna`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newQna = await res.json();
                setMessages(prev => [newQna, ...prev]);
                setQuestion("");
            } else {
                throw new Error("Transmission packet lost");
            }
        } catch (err) {
            console.warn("Uplink failed. Local server offline. Operating in simulation mode:", err);
            
            // Create a local mock item
            const userQna: QnaItem = {
                id: `local-${Date.now()}`,
                username: username || "ANON_PILOT",
                question: question.trim(),
                answer: null,
                answered_by: null,
                created_at: new Date().toISOString(),
                likes: 0
            };
            
            setMessages(prev => [userQna, ...prev]);
            setQuestion("");

            if (askAi) {
                // Simulate AI response delay
                setTimeout(() => {
                    setMessages(prev => {
                        return prev.map(m => {
                            if (m.id === userQna.id) {
                                let simulatedAnswer = "SYSTEM TELEMETRY RECEIVED. SIMULATION ENGINE ONLINE. SECURE LINK STABLE.";
                                const q = userQna.question.toUpperCase();
                                if (q.includes("TYRE") || q.includes("TIRE") || q.includes("DEGRADATION")) {
                                    simulatedAnswer = "TYRE INFLATION SPECS VERIFIED. C3 SOFT COMPOUND PEAKS AT LAP 4, DEGRADING AT 0.18S/LAP. RECOMMEND STRATEGY SWAP.";
                                } else if (q.includes("WET") || q.includes("RAIN") || q.includes("WEATHER")) {
                                    simulatedAnswer = "SAT-FEED DETECTS 40% CHANCE OF PRECIPITATION IN SECTOR 2 WITHIN 15 MINUTES. PREPARE INTERMEDIATE WHEELSETS.";
                                } else if (q.includes("ENGINE") || q.includes("POWER") || q.includes("MGU")) {
                                    simulatedAnswer = "MGU-K RECOVERY PERCENTAGE CAP AT 85% TO PRESERVE THERMAL SENSORS. DEPLOY OVERTAKE BUTTON ONLY ON RECTILINEAR STRETCHES.";
                                } else if (q.includes("TRACK") || q.includes("MONACO") || q.includes("SPA")) {
                                    simulatedAnswer = "SIMULATION MAPS 100% OF CORNER APEXES. HAPTIC PLATFORM CONFIGURATION SET TO NOMINAL TRACK SURFACE VIBRATIONS.";
                                }
                                return {
                                    ...m,
                                    answer: simulatedAnswer,
                                    answered_by: "Pitwall AI (Simulated)"
                                };
                            }
                            return m;
                        });
                    });
                }, 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative backdrop-blur-xl group hover:border-[#00ffd2]/30 transition-all duration-700 shadow-2xl">
            {/* Smokey Backdrop Highlight */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#00ffd2]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#00ffd2]/15 transition-all duration-700" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#ff006e]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#ff006e]/15 transition-all duration-700" />

            {/* Tech HUD Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Radio className="w-5 h-5 text-[#00ffd2] animate-pulse" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#00ffd2] rounded-full animate-ping" />
                    </div>
                    <div>
                        <h3 className="font-black italic uppercase tracking-wider text-white text-base sm:text-lg flex items-center gap-2">
                            PITWALL RADIO <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded font-mono font-normal tracking-normal uppercase">COMMS ON</span>
                        </h3>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Sector Comms Link // Telemetry Port active</p>
                    </div>
                </div>

                {/* Pilot ID configuration */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg max-w-xs">
                    <User className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-[10px] font-mono text-white/40 uppercase mr-1">ID:</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className="bg-transparent text-xs font-mono text-white outline-none border-none w-28 uppercase font-bold tracking-wider focus:text-[#00ffd2] transition-colors"
                        placeholder="PILOT_ID"
                    />
                </div>
            </div>

            {/* Chat logs */}
            <div className="p-4 sm:p-6 h-[400px] overflow-y-auto custom-scrollbar flex flex-col-reverse gap-4 bg-black/60 relative">
                {/* HUD Grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />

                <div ref={chatEndRef} />

                {loading && (
                    <div className="flex gap-3 justify-start items-start animate-pulse self-start max-w-[85%] bg-white/[0.02] border border-white/5 p-4 rounded-xl font-mono text-xs text-[#00ffd2] uppercase">
                        <Activity className="w-4 h-4 animate-spin text-[#00ffd2]" />
                        <span>PITWALL RECEIVING TRANSMISSION... STANDBY FOR TELEMETRY OVERLAY...</span>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <div className="text-center py-20 text-white/30 font-mono text-xs uppercase space-y-2 flex flex-col items-center">
                            <HelpCircle className="w-8 h-8 opacity-40 text-[#00ffd2]" />
                            <p>No telemetry logs registered in database.</p>
                            <p className="text-[10px] text-white/20">Ask the Pitwall AI or post a community message to launch comms.</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/10 rounded-xl relative group/item hover:border-white/20 hover:bg-white/[0.03] transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#00ffd2]" />
                                        <span className="font-mono text-xs font-bold text-white uppercase">{msg.username}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-white/30">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-white/80 font-light leading-relaxed">{msg.question}</p>

                                {msg.answer && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mt-3 p-3 bg-[#00ffd2]/5 border-l-2 border-[#00ffd2] rounded-r-lg font-mono text-xs text-white/90 space-y-1.5"
                                    >
                                        <div className="flex items-center gap-1.5 text-[#00ffd2] font-black uppercase text-[10px] tracking-wider">
                                            <Terminal className="w-3.5 h-3.5" />
                                            <span>{msg.answered_by || "Pitwall AI"}</span>
                                            <ShieldCheck className="w-3 h-3 text-[#00ffd2]/80 ml-auto" />
                                        </div>
                                        <p className="leading-relaxed text-white/80">{msg.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Controls input */}
            <form onSubmit={handleSend} className="p-4 sm:p-6 border-t border-white/10 bg-white/[0.02] flex flex-col gap-4">
                {error && (
                    <div className="text-xs font-mono text-red-500 uppercase tracking-wider flex items-center gap-2 border border-red-500/20 bg-red-500/5 p-2 rounded">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                    {/* Ask AI toggle */}
                    <button
                        type="button"
                        onClick={() => setAskAi(true)}
                        className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 border ${askAi ? "bg-[#00ffd2] text-black border-[#00ffd2]" : "text-white/60 border-white/10 hover:text-white"}`}
                    >
                        <Radio className="w-3.5 h-3.5" />
                        <span>Radio Pitwall AI</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setAskAi(false)}
                        className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 border ${!askAi ? "bg-white/10 text-white border-white/20" : "text-white/60 border-white/10 hover:text-white"}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Post to Board</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 relative">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={askAi ? "ASK PITWALL AI ABOUT TYRE DEGRADATION, RACERS, SIMULATORS..." : "POST A QUESTION TO THE COMMUNITY BOARD..."}
                        className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-[#00ffd2] focus:bg-white/[0.08] transition-all uppercase tracking-wide font-mono"
                        maxLength={150}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="bg-[#00ffd2] text-black font-black italic p-3 rounded-xl uppercase hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono text-white/30 uppercase">
                    <span>MAX CHARS: 150</span>
                    <span>ENCRYPTION ALGORITHM: AES-256 TELEMETRY LINK</span>
                </div>
            </form>
        </div>
    );
}
