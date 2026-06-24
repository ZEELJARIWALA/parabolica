"use client";

import React, { useState } from "react";
import { Send, Terminal, ShieldCheck, User, Radio, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function F1Chatbot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", text: "How can I help you with F1 news or strategy today?" }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "assistant",
                text: "Based on recent telemetry, it seems the high-speed upgrades for the upcoming race will favor the low-drag setups."
            }]);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="w-full bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#00ffd2]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">F1 Assistant</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="p-6 h-[300px] overflow-y-auto flex flex-col gap-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-4`}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-[#00ffd2]/10 border border-[#00ffd2]/20 flex items-center justify-center shrink-0">
                                    <Terminal className="w-4 h-4 text-[#00ffd2]" />
                                </div>
                            )}
                            <div className={`p-4 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
                                msg.role === "user" 
                                ? "bg-[#00ffd2] text-black font-bold" 
                                : "bg-white/5 border border-white/10 text-white font-light"
                            }`}>
                                {msg.text}
                            </div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div className="flex items-center gap-2 text-[#00ffd2] font-mono text-[10px] animate-pulse">
                        <Activity className="w-3 h-3" />
                        PROCESSING TELEMETRY...
                    </div>
                )}
            </div>

            {/* InputArea */}
            <form onSubmit={handleSend} className="p-6 pt-0">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ASK ABOUT LATEST F1 NEWS, DRIVER STATS, OR RACE PHYSICS..."
                        className="w-full bg-white/5 border border-white/10 p-4 pr-16 rounded-2xl text-sm text-white focus:border-[#00ffd2]/50 outline-none transition-all placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 p-2.5 bg-[#00ffd2] text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <Send className="w-5 h-5 font-black" />
                    </button>
                </div>
            </form>
        </div>
    );
}
