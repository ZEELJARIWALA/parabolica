"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "@/context/intro-context";

// ─── Zone config ────────────────────────────────────────────────
const ZONES = [
  {
    id: "vr",
    label: "VR ARENA",
    sub: "IMMERSIVE REALITY",
    video: "/intro/VR_home.mp4",
    accent: "#4DAAFF",
    accentRgb: "77, 170, 255",
    duration: 2600,
  },
  {
    id: "fpv",
    label: "FPV RACING",
    sub: "AERIAL DOMINANCE",
    video: "/intro/FPV Video.mp4",
    accent: "#39FF8F",
    accentRgb: "57, 255, 143",
    duration: 2600,
  },
  {
    id: "f1",
    label: "F1 RACING",
    sub: "SPEED REDEFINED",
    video: "/intro/F1_home.mp4",
    accent: "#E84040",
    accentRgb: "232, 64, 64",
    duration: 2600,
  },
] as const;

// ─── Individual Zone Slide ───────────────────────────────────────
function ZoneSlide({
  zone,
  isActive,
}: {
  zone: (typeof ZONES)[number];
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      // Handle autoplay with proper error handling for AbortError
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video playback started successfully
          })
          .catch((err) => {
            // Autoplay was prevented, try with muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {
                // Silent fail if still can't play
              });
            }
          });
      }
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={zone.id}
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src={zone.video}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Colored accent glow — bottom bloom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(${zone.accentRgb}, 0.35) 0%, transparent 100%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Colored accent glow — top vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 pointer-events-none" />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
            }}
          />

          {/* Zone number */}
          <motion.div
            className="absolute top-6 sm:top-12 left-6 sm:left-12 font-mono text-[10px] sm:text-sm tracking-[0.3em] uppercase z-30"
            style={{ color: zone.accent }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {String(ZONES.indexOf(zone) + 1).padStart(2, "0")} / 03
          </motion.div>

          {/* Zone label content */}
          <div className="absolute inset-0 flex flex-col items-start justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 z-10">
            <motion.p
              className="text-[9px] sm:text-xs tracking-[0.4em] uppercase font-medium mb-1 sm:mb-3"
              style={{ color: zone.accent }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {zone.sub}
            </motion.p>

            <motion.h2
              className="font-black uppercase text-white leading-[0.85] tracking-tighter"
              style={{ fontSize: "clamp(2rem, 12vw, 9rem)" }}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {zone.label.split(' ').map((word, i) => (
                <span key={i} className="block sm:inline mr-4 last:mr-0">
                  {word}
                </span>
              ))}
            </motion.h2>

            {/* Accent line */}
            <motion.div
              className="mt-4 sm:mt-6 h-[2px] sm:h-[3px] rounded-full"
              style={{ backgroundColor: zone.accent }}
              initial={{ width: 0 }}
              animate={{ width: "clamp(40px, 15vw, 140px)" }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Progress bar at top */}
          <motion.div
            className="absolute top-0 left-0 h-[3px]"
            style={{ backgroundColor: zone.accent }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: zone.duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main IntroSequence ──────────────────────────────────────────
export function IntroSequence() {
  const { introPlayed, setIntroPlayed, isFirstMount } = useIntro();
  const [zoneIndex, setZoneIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted true on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial Visibility Check
  useEffect(() => {
    if (introPlayed) {
      setShouldRender(false);
    }
  }, [introPlayed]);

  // Handle Body Scroll Locking
  useEffect(() => {
    if (shouldRender && mounted) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender, mounted]);

  const triggerFinalReveal = () => {
    // Normal auto-progression reveal (keep it pretty)
    setShowFinalReveal(true);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        document.body.style.overflow = "";
        setIntroPlayed(true);
        setShouldRender(false);
      }, 500);
    }, 2000);
  };

  const skipToContent = () => {
    // Instant jump for the "Skip Intro" button
    document.body.style.overflow = "";
    setIntroPlayed(true);
    setShouldRender(false);
  };

  // Zone timer
  useEffect(() => {
    if (isExiting || !shouldRender || introPlayed || showFinalReveal || !mounted) return;

    const zone = ZONES[zoneIndex];
    const timer = setTimeout(() => {
      if (zoneIndex < ZONES.length - 1) {
        setZoneIndex((i) => i + 1);
      } else {
        triggerFinalReveal();
      }
    }, zone.duration);

    return () => clearTimeout(timer);
  }, [zoneIndex, isExiting, shouldRender, introPlayed, setIntroPlayed, showFinalReveal, mounted]);

  if (!mounted || !shouldRender || introPlayed) return null;

  const letters = "PARABOLICA".split("");

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="intro-wrapper"
          className="fixed inset-0 z-[99999] bg-black overflow-hidden flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Zone slides */}
          {!showFinalReveal && ZONES.map((zone, i) => (
            <ZoneSlide key={zone.id} zone={zone} isActive={i === zoneIndex} />
          ))}

          {/* Final Letter Reveal */}
          <AnimatePresence>
            {showFinalReveal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-50 flex items-baseline justify-center"
              >
                {letters.map((char, i) => {
                  const isItalicA = (i === 1 || i === 3 || i === 9) && char === "A";
                  const isRedC = i === 8 && char === "C";
                  
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ 
                        delay: i * 0.08, 
                        duration: 1.2, 
                        ease: [0.19, 1, 0.22, 1] 
                      }}
                      className={`
                        text-5xl sm:text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-none
                        ${isRedC ? 'text-[#E84040]' : 'text-[#fdefef]'}
                      `}
                      style={isItalicA ? { 
                        fontStyle: "italic", 
                        transform: "skewX(-15deg)", 
                        display: "inline-block", 
                        letterSpacing: "-0.02em" 
                      } : {}}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* White flash transition between zones */}
          <AnimatePresence mode="wait">
            {!showFinalReveal && zoneIndex < ZONES.length && (
              <motion.div
                key={`flash-${zoneIndex}`}
                className="absolute inset-0 bg-white pointer-events-none z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Skip Button */}
          {!showFinalReveal && (
            <motion.button
              onClick={skipToContent}
              className="absolute bottom-10 right-10 z-[100] px-8 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl text-[10px] tracking-[0.4em] uppercase text-white font-mono hover:bg-primary hover:text-black hover:border-primary transition-all group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Skip Intro
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </span>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

