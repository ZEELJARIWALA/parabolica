"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useState } from "react";
import { ProjectModal } from "@/components/project-modal";

const photos = [
  { id: 2, src: "https://images.unsplash.com/photo-1622325075902-7eaccd5a882a?q=80&w=2070&auto=format&fit=crop", title: "VR ARENA", category: "Virtual Reality", year: "2026", description: "Our next-gen VR arena features full-body tracking and haptic feedback for the most immersive digital experiences on the planet." },
  { id: 3, src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop", title: "FPV DRONE", category: "Drone Tech", year: "2026", description: "Train with professional-grade FPV drones in our custom-built flight zone, designed for both beginners and elite pilots." },
  { id: 4, src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop", title: "NEXT-GEN TECH", category: "Hardware", year: "2026", description: "We utilize the latest in computing and display technology to power our high-fidelity simulations." },
  { id: 5, src: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2070&auto=format&fit=crop", title: "IMMERSIVE WORLDS", category: "Experience", year: "2026", description: "Step into limitless digital landscapes crafted with cinematic detail and interactive complexity." },
  { id: 6, src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop", title: "ELITE RACING", category: "F1 Simulation", year: "2026", description: "Professional-grade motion simulators with custom direct-drive wheelbases and precise pedal telemetry." },
];

export default function PhotoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const handleCardClick = (photo: any) => {
    setSelectedPhoto({
        id: photo.id.toString(),
        title: photo.title,
        category: photo.category,
        year: photo.year,
        description: photo.description,
        image: photo.src,
        stack: ["F1 Simulator", "VR Arena", "FPV Drone"]
    });
    setIsModalOpen(true);
  };

// Calculate background color transition
  // Much smoother transition over a wider range
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1.0],
    ["var(--background)", "#262626", "#d4d4d4", "var(--background)"]
  );

  // Text color transition for the sticky title to ensure it is BOLD and VISIBLE
  const textColor = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 0.9],
    ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.8)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)"]
  );

  // INCREASED MOTION: Widened range to make cards fly across faster relative to scroll
  // Start from further left and end further right to ensure full visibility and high-speed feel
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["-200%", "60%"]);

  return (
    <motion.section
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative h-[350vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
        
        {/* Sticky Title */}
        <div className="absolute top-12 md:top-20 left-0 w-full z-20 pointer-events-none">
            <motion.div 
                style={{ 
                    opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]),
                }}
                className="px-[10vw] flex justify-center"
            >
                <motion.h2 
                    style={{ color: textColor }}
                    className="text-6xl md:text-[8rem] lg:text-[12rem] font-black uppercase tracking-tighter italic leading-none text-center"
                >
                    EXPLORE
                </motion.h2>
            </motion.div>
        </div>

        <motion.div 
            style={{ x, perspective: "1200px" }} 
            className="flex gap-8 md:gap-16 px-[10vw] z-30"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              onClick={() => handleCardClick(photo)}
              initial={{ rotateY: 15, rotateX: 5 }}
              whileHover={{ 
                rotateY: 0, 
                rotateX: 0, 
                scale: 1.02,
                z: 20,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className="group relative h-[45vh] md:h-[60vh] w-[70vw] sm:w-[50vw] md:w-[30vw] flex-shrink-0 cursor-pointer overflow-visible"
            >
              {/* Card Shadow/Glow */}
              <div className="absolute inset-0 rounded-3xl bg-black/40 blur-2xl group-hover:bg-primary/20 transition-colors duration-500 -z-10 translate-y-6" />
              
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] ring-1 ring-white/20 shadow-2xl bg-muted">
                <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                
                <div 
                    style={{ transform: "translateZ(40px)" }}
                    className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10"
                >
                    <span className="block text-[#00ffd2] text-[10px] md:text-xs font-mono tracking-[0.5em] mb-2 font-bold">
                        EXPLORE 0{index + 1}
                    </span>
                    <h3 className="text-white text-xl md:text-3xl font-black tracking-tight uppercase leading-none">
                    {photo.title}
                    </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Prompt */}
        <div className="absolute bottom-12 md:bottom-20 right-0 w-full z-20 text-center md:text-right pointer-events-none px-[10vw]">
             <motion.p 
                style={{ 
                    opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.8, 0.9], [0, 1, 1, 0]),
                    color: textColor
                }}
                className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase"
              >
                  [ SCROLL TO DISCOVER ]
              </motion.p>
        </div>
      </div>
      
      <ProjectModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        project={selectedPhoto} 
      />
    </motion.section>
  );
}




