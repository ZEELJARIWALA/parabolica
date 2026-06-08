"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlurReveal } from "@/components/blur-reveal";
import { useLanguage } from "@/context/language-context";

const DECKS = [
  {
    id: "birthday",
    title: "BIRTHDAY DECK",
    images: ["5.png"],
    folder: "Birthday Deck",
    accent: "#FF4D4D",
    description: "Unforgettable celebrations with high-tech racing and VR adventures."
  },
  {
    id: "kitty",
    title: "KITTY PARTY",
    images: ["1.png"],
    folder: "Kitty Party Deck",
    accent: "#FF4DFF",
    description: "Elegant social gatherings redefined with immersive digital leisure."
  },
  {
    id: "corporate",
    title: "CORPORATE DECK",
    images: ["17.png"],
    folder: "Corporate Deck",
    accent: "#4DFFFF",
    description: "Next-level team building and innovation-focused corporate events."
  },
  {
    id: "walkthrough",
    title: "WALKTHROUGH",
    images: ["24.png"],
    folder: "Parabolica Walkthrough Deck",
    accent: "#4DFF4D",
    description: "A deep dive into the architecture and engineering of Parabolica."
  }
];

export default function DeckExplorer() {
  const { content } = useLanguage();
  return (
    <section className="relative min-h-[80vh] bg-black overflow-hidden flex flex-col border-b border-white/5">
      <div className="container mx-auto px-container pt-24 pb-16 z-10 text-center">
        <BlurReveal>
          <span className="title-counter text-[#00ffd2]">[005]</span>
        </BlurReveal>
        <BlurReveal>
          <h2 className="title text-5xl md:text-7xl lg:text-9xl mb-4">{content.nav.roadmap}</h2>
        </BlurReveal>
        <BlurReveal>
          <p className="text-white/40 font-mono text-xs tracking-widest uppercase">Explore our specialized experience volumes</p>
        </BlurReveal>
      </div>

      <motion.div layout className="flex-1 w-full relative flex flex-col lg:flex-row border-t border-white/10">
        {DECKS.map((deck) => (
          <div
            key={deck.id}
            onClick={(e) => {
                // If the user clicked the Inquiry button (or anything inside it), don't trigger the card link
                if ((e.target as HTMLElement).closest('a')) return;
                window.location.href = `/${deck.id}`;
            }}
            className="flex-1 border-b lg:border-b-0 lg:border-l border-white/10 relative group overflow-hidden h-[40vh] lg:h-auto cursor-pointer"
          >
            <motion.div
              layout
              className="absolute inset-0 z-0 h-full w-full"
            >
              <Image
                src={`/${deck.folder}/${deck.images[0]}`}
                alt={deck.title}
                fill
                className="object-cover opacity-30 group-hover:opacity-70 transition-all duration-1000 grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-1000" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center lg:items-start justify-center lg:justify-between p-8 lg:p-12">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl lg:text-5.5xl font-black italic tracking-tighter text-white/50 group-hover:text-white transition-all duration-700 leading-none">
                  {deck.title.split(' ')[0]}
                  <span className="block text-primary/50 group-hover:text-primary transition-colors">{deck.title.split(' ')[1] || "DECK"}</span>
                </h3>
              </div>
              
              <div className="hidden lg:block">
                 <p className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 max-w-xs text-sm font-light leading-relaxed text-white/60 mb-6">
                    {deck.description}
                 </p>
                 <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100"
                 >
                    <Link 
                        href={`/booking?event=true&type=${deck.id}`}
                        className="inline-flex items-center gap-4 bg-white text-black px-6 py-3 font-black italic text-xs uppercase tracking-widest hover:bg-[#00ffd2] transition-colors"
                    >
                        Request Inquiry
                    </Link>
                 </motion.div>
              </div>

              <div className="flex items-center gap-4 mt-6 lg:mt-0">
                 <div className="w-12 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-primary transition-all duration-700" />
                 <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 group-hover:text-white transition-colors uppercase">Enter Deck</span>
              </div>
            </div>

            {/* Hover Accent Line */}
            <div 
                className="absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                style={{ backgroundColor: deck.accent }}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
