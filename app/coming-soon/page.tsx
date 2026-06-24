import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Terminal, ShieldAlert, Radio, ChevronLeft } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ffd2] selection:text-black relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Premium Aesthetic Backdrops */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff006e]/10 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00ffd2]/5 blur-[130px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center pt-24 pb-12">
                <div className="space-y-10 max-w-4xl">
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                             <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-[#00ffd2]" />
                                <span className="font-mono text-[10px] text-[#00ffd2] uppercase tracking-[0.4em]">Stay Tuned Pilot</span>
                                <span className="h-px w-8 bg-[#00ffd2]" />
                             </div>
                        </div>
                        
                        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.9]">
                            SOMETHING <span className="text-[#00ffd2]">E</span>XCITING <br/> 
                            <span className="text-[#ff006e]">I</span>S ON THE WAY
                        </h1>
                        
                        <p className="text-white/40 font-light text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                            We&apos;re preparing something new for the arena. <br className="hidden md:block" /> Check back shortly for the full reveal.
                        </p>
                    </div>

                    <div className="flex justify-center pt-8">
                        <Link 
                            href="/"
                            className="group relative flex items-center gap-3 px-12 py-5 bg-white text-black rounded-full hover:bg-[#00ffd2] transition-all duration-500 text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,210,0.4)]"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Take Me Home
                        </Link>
                    </div>
                </div>
            </main>

            {/* Bottom HUD Bar */}
            <div className="relative z-10 border-t border-white/5 bg-black/80 backdrop-blur-md py-4">
                <div className="container mx-auto px-6 flex justify-between items-center font-mono text-[9px] text-white/20 tracking-widest">
                    <span>ESTABLISHING SECURE CONNECTION</span>
                    <span className="hidden md:block italic">PARABOLICA OPERATIONS CENTER //Surat, India</span>
                    <span>CODE: 404_UPCOMING</span>
                </div>
            </div>

            <Footer />
        </div>
    );
}
