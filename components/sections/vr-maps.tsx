"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlurReveal } from "../blur-reveal";
import { Map as MapIcon, Compass, Target, Globe } from "lucide-react";

const MAPS = [
  { id: 1, name: "Bunker", desc: "A high-octane urban battlefield set in a neon-lit future. Navigate through dense city streets and high-rise vantage points in this fast-paced environment.", tags: ["URBAN", "TACTICAL"] },
  { id: 2, name: "Factory", desc: "An industrial shipping yard featuring tight corners and long sightlines. Use abandoned machinery for cover as you battle for control.", tags: ["INDUSTRIAL", "CQC"] },
  { id: 3, name: "Sanctum", desc: "A sun-drenched desert outpost with traditional architecture. Classic tactical gameplay meets modern intensity in this iconic arena.", tags: ["DESERT", "SNIPER"] },
  { id: 4, name: "Borealis", desc: "Engage in combat amidst priceless exhibits. This multi-level indoor arena offers unique flanking routes and artistic surroundings.", tags: ["MUSEUM", "STEALTH"] },
  { id: 5, name: "Raven", desc: "Set on a towering skyscraper construction site, this map features dizzying heights and strategic cover points—perfect for team combat.", tags: ["VERTICAL", "INTENSE"] },
  { id: 6, name: "BackRooms", desc: "A haunting maze of endless yellow corridors and flickering lights. Disorienting and eerie, it tests your survival instincts.", tags: ["CQC", "HORROR"] },
  { id: 7, name: "Minecraft", desc: "A vibrant blocky world featuring multiple bases and portals. Experience fast-paced and chaotic team PVP in this blocky adventure.", tags: ["BLOCKY", "ARENA"] },
  { id: 8, name: "Island Assault", desc: "An open island battleground where teams fight for control. Capture zones and utilize the terrain to dominate your opponents.", tags: ["OPEN", "STRATEGY"] },
  { id: 9, name: "SkyScrappers", desc: "A futuristic combat arena designed for competitive gameplay. Focus on movement and precision across dynamic urban structures.", tags: ["FUTURE", "URBAN"] },
  { id: 10, name: "SpaceBattle", desc: "A multi-level space station featuring zero-gravity combat. Teleporters and open layouts create fast, fluid, and intense battles.", tags: ["SPACE", "DYNAMICS"] },
  { id: 11, name: "SpaceBattle-2", desc: "An enhanced version of space combat with higher intensity. Designed for players who enjoy fast reactions and competitive PVP.", tags: ["SPACE", "FAST"] },
  { id: 12, name: "Forts", desc: "A colorful and dynamic arena where teams battle using complex structures for cover. Focused on fun and fast-paced action.", tags: ["VIBRANT", "MOVEMENT"] },
];

export default function VRMaps() {
  return (
    <section className="py-24 md:py-40 bg-[#020202] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16 md:mb-24">
          <BlurReveal>
            <span className="text-primary font-mono tracking-[0.5em] uppercase text-[10px] mb-4 block">Deployment Zones</span>
          </BlurReveal>
          <BlurReveal>
            <h2 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
              CHOOSE YOUR<br />
              <span className="text-white/40">BATTLE-FIELD</span>
            </h2>
          </BlurReveal>
          <BlurReveal>
            <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-xl font-light">
              Explore our diverse range of virtual battlegrounds. From neon-lit cityscapes to zero-gravity space stations, every map is a new challenge with unique mechanics and secrets.
            </p>
          </BlurReveal>
        </div>

        {/* Maps Layout - Creative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {MAPS.map((map, i) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: i * 0.05
              }}
              className="group relative h-[400px] border border-white/10 bg-[#050505] overflow-hidden"
            >
              {/* Image Container */}
              <div className="absolute inset-0 z-0 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out">
                <img
                  src={`/Maps/${map.id}-Picsart-AiImageEnhancer.png`}
                  alt={map.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
              </div>

              {/* ID Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="text-[10px] font-mono text-white/40 bg-black/60 border border-white/10 px-2 py-1 backdrop-blur-sm">
                  SEC-0{map.id}
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex gap-2 mb-3">
                    {map.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-mono tracking-widest text-[#00ffd2] border border-[#00ffd2]/30 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none group-hover:text-primary transition-colors">
                    {map.name}
                  </h3>
                  <p className="text-xs text-white/40 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                    {map.desc}
                  </p>
                </div>
              </div>

              {/* Interactive Corner */}
              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-20 h-20 bg-primary/20 rotate-45 group-hover:bg-primary transition-colors duration-500" />
                <div className="absolute bottom-2 right-2 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Compass size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
