"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { BlurReveal } from "@/components/blur-reveal";

const TEAMS = [
  {
    id: "FERRARI",
    title: "Shop Ferrari",
    image: "/shop_photo/ferrari.png",
    borderColor: "group-hover:border-red-600",
    shadowClass: "group-hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]",
    textColor: "group-hover:text-red-600"
  },
  {
    id: "REDBULL",
    title: "Shop Redbull",
    image: "/shop_photo/redbull.png",
    borderColor: "group-hover:border-blue-700",
    shadowClass: "group-hover:shadow-[0_0_25px_rgba(29,78,216,0.25)]",
    textColor: "group-hover:text-blue-700"
  },
  {
    id: "MERCEDES",
    title: "Shop Mercedes",
    image: "/shop_photo/mercedes.png",
    borderColor: "group-hover:border-teal-600",
    shadowClass: "group-hover:shadow-[0_0_25px_rgba(13,148,136,0.25)]",
    textColor: "group-hover:text-teal-600"
  },
  {
    id: "MCLAREN",
    title: "Shop Mclaren",
    image: "/shop_photo/mclaren.jpeg",
    borderColor: "group-hover:border-orange-500",
    shadowClass: "group-hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]",
    textColor: "group-hover:text-orange-500"
  }
];

export default function ShopShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Smoke particles configuration
    type Particle = { x: number; y: number; r: number; alpha: number; vx: number; vy: number; va: number };
    const particles: Particle[] = [];
    const particleCount = 18;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 120 + Math.random() * 180,
        alpha: Math.random() * 0.05,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -Math.random() * 0.12 - 0.04,
        va: (Math.random() - 0.5) * 0.0001,
      });
    }

    // IntersectionObserver to pause loop when scrolled away
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    
    observer.observe(canvas);

    const tick = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const col = { r: 0, g: 255, b: 210 }; // Teal smoke

      particles.forEach((p) => {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${p.alpha})`);
        g.addColorStop(0.5, `rgba(${col.r},${col.g},${col.b},${p.alpha * 0.3})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.va;

        if (p.alpha < 0.005) p.alpha = 0.005;
        if (p.alpha > 0.06) p.va *= -1;
        if (p.y + p.r < 0) { 
          p.y = canvas.height + p.r; 
          p.x = Math.random() * canvas.width; 
        }
        if (p.x < -p.r || p.x > canvas.width + p.r) p.vx *= -1;
      });
      
      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => { 
      cancelAnimationFrame(animId); 
      window.removeEventListener("resize", resize); 
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-[80vh] bg-black overflow-hidden py-24 flex flex-col justify-center border-b border-white/5">
      {/* Canvas background smoke */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-30" />

      {/* Tech grid overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      <div className="container mx-auto px-container relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-2">
          <BlurReveal>
            <span className="title-counter text-[#00ffd2]">[006]</span>
          </BlurReveal>
          <BlurReveal>
            <h2 className="title text-5xl md:text-7xl lg:text-9xl mb-4">
              MERCHANDISE
            </h2>
          </BlurReveal>
          <BlurReveal>
            <p className="text-white/40 font-mono text-xs tracking-widest uppercase max-w-md mx-auto">
              CHOOSE TEAM OR EXPLORE THE STORAGE MODULE
            </p>
          </BlurReveal>
        </div>

        {/* 4 Team Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {TEAMS.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/shop?team=${team.id}`}
                className="flex flex-col text-left group cursor-pointer"
              >
                <div className={`w-full aspect-[4/5] relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 transition-all duration-500 ${team.borderColor} ${team.shadowClass} group-hover:scale-[1.02]`}>
                  <Image
                    src={team.image}
                    alt={team.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <span className={`mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-white/50 transition-colors ${team.textColor}`}>
                  {team.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Explore All CTA at the bottom */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-4 bg-white text-black px-8 py-4 font-black italic text-xs uppercase tracking-widest hover:bg-[#00ffd2] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,210,0.3)] duration-300"
            >
              EXPLORE ALL MERCHANDISE
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
