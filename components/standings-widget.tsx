"use client";

import React, { useState } from "react";
import { Trophy, Shield, Users } from "lucide-react";

export default function StandingsWidget() {
    const [activeTab, setActiveTab] = useState<"drivers" | "constructors">("drivers");

    const drivers = [
        { pos: 1, name: "Max Verstappen", team: "Red Bull Racing", points: 219, color: "#0c2340" },
        { pos: 2, name: "Lando Norris", team: "McLaren", points: 150, color: "#ff8700" },
        { pos: 3, name: "Charles Leclerc", team: "Ferrari", points: 148, color: "#e80020" },
        { pos: 4, name: "Carlos Sainz", team: "Ferrari", points: 116, color: "#e80020" },
        { pos: 5, name: "Oscar Piastri", team: "McLaren", points: 112, color: "#ff8700" },
        { pos: 6, name: "Lewis Hamilton", team: "Mercedes", points: 85, color: "#27f4d2" },
        { pos: 7, name: "Sergio Perez", team: "Red Bull Racing", points: 81, color: "#0c2340" },
        { pos: 8, name: "George Russell", team: "Mercedes", points: 81, color: "#27f4d2" }
    ];

    const constructors = [
        { pos: 1, team: "Red Bull Racing", points: 300, color: "#0c2340" },
        { pos: 2, team: "Ferrari", points: 264, color: "#e80020" },
        { pos: 3, team: "McLaren", points: 262, color: "#ff8700" },
        { pos: 4, team: "Mercedes", points: 166, color: "#27f4d2" },
        { pos: 5, team: "Aston Martin", points: 58, color: "#229977" }
    ];

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl group hover:border-[#00ffd2]/20 transition-all duration-700">
            {/* Visual Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#00ffd2]" />
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">F1 CHAMPIONSHIP TABLE</h3>
                </div>
            </div>

            {/* Selector tabs */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/5 mb-4 relative z-10">
                <button
                    onClick={() => setActiveTab("drivers")}
                    className={`flex-1 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${activeTab === "drivers" ? "bg-[#00ffd2] text-black" : "text-white/60 hover:text-white"}`}
                >
                    <Users className="w-3 h-3" />
                    <span>Drivers</span>
                </button>
                <button
                    onClick={() => setActiveTab("constructors")}
                    className={`flex-1 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${activeTab === "constructors" ? "bg-[#00ffd2] text-black" : "text-white/60 hover:text-white"}`}
                >
                    <Shield className="w-3 h-3" />
                    <span>Teams</span>
                </button>
            </div>

            {/* Table layout */}
            <div className="space-y-2 relative z-10">
                {activeTab === "drivers" ? (
                    drivers.map((driver) => (
                        <div
                            key={driver.pos}
                            className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/5 rounded-lg text-xs hover:bg-white/[0.02] hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] font-bold text-white/30 w-4">#{driver.pos}</span>
                                <div
                                    className="w-1 h-3 rounded-full"
                                    style={{ backgroundColor: driver.color }}
                                />
                                <div className="leading-none">
                                    <span className="font-bold text-white block uppercase text-[11px]">{driver.name}</span>
                                    <span className="text-[9px] text-white/40 font-mono uppercase">{driver.team}</span>
                                </div>
                            </div>
                            <span className="font-mono font-black text-[#00ffd2] text-sm">{driver.points} pts</span>
                        </div>
                    ))
                ) : (
                    constructors.map((team) => (
                        <div
                            key={team.pos}
                            className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/5 rounded-lg text-xs hover:bg-white/[0.02] hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] font-bold text-white/30 w-4">#{team.pos}</span>
                                <div
                                    className="w-1 h-3 rounded-full"
                                    style={{ backgroundColor: team.color }}
                                />
                                <span className="font-bold text-white uppercase text-[11px]">{team.team}</span>
                            </div>
                            <span className="font-mono font-black text-[#00ffd2] text-sm">{team.points} pts</span>
                        </div>
                    ))
                )}
            </div>

            {/* Subtle design element */}
            <div className="absolute -bottom-6 -right-6 text-white/[0.02] font-black italic text-8xl pointer-events-none select-none">
                F1
            </div>
        </div>
    );
}
