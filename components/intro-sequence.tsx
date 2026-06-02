"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            className="absolute top-8 sm:top-12 left-6 sm:left-12 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ color: zone.accent }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {String(ZONES.indexOf(zone) + 1).padStart(2, "0")} / 03
          </motion.div>

          {/* Zone label — big */}
          <div className="absolute inset-0 flex flex-col items-start justify-end px-6 sm:px-12 lg:px-20 pb-12 sm:pb-20">
            <motion.p
              className="text-[10px] sm:text-xs tracking-[0.4em] uppercase font-medium mb-2 sm:mb-3"
              style={{ color: zone.accent }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {zone.sub}
            </motion.p>

            <motion.h2
              className="font-black uppercase text-white leading-[0.9] tracking-tighter"
              style={{ fontSize: "clamp(2.8rem, 9vw, 9rem)" }}
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {zone.label}
            </motion.h2>

            {/* Accent line */}
            <motion.div
              className="mt-4 sm:mt-6 h-[3px] rounded-full"
              style={{ backgroundColor: zone.accent }}
              initial={{ width: 0 }}
              animate={{ width: "clamp(60px, 12vw, 140px)" }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
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

import { useIntro } from "@/context/intro-context";

// ─── Main IntroSequence ──────────────────────────────────────────
export function IntroSequence() {
  const { introPlayed, setIntroPlayed, isFirstMount } = useIntro();
  const [zoneIndex, setZoneIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Initial Visibility Check
  useEffect(() => {
    if (introPlayed) {
      setShouldRender(false);
    }
  }, [introPlayed]);

  // Handle Body Scroll Locking
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  // Zone timer — advance through zones, then exit to rendering the true landing page
  useEffect(() => {
    if (isExiting || !shouldRender || introPlayed) return;

    const zone = ZONES[zoneIndex];
    const timer = setTimeout(() => {
      if (zoneIndex < ZONES.length - 1) {
        setZoneIndex((i) => i + 1);
      } else {
        // After last zone (F1) completes, fade out
        setIsExiting(true);
        setTimeout(() => {
          document.body.style.overflow = "";
          setIntroPlayed(true);
          setShouldRender(false);
        }, 600);
      }
    }, zone.duration);

    return () => clearTimeout(timer);
  }, [zoneIndex, isExiting, shouldRender, introPlayed, setIntroPlayed]);

  // Prevent flicker on first mount by checking context
  if (!shouldRender || introPlayed || isFirstMount) return null;

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="intro-wrapper"
          className="fixed inset-0 z-[99999] bg-black overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Zone slides */}
          {ZONES.map((zone, i) => (
            <ZoneSlide key={zone.id} zone={zone} isActive={i === zoneIndex} />
          ))}

          {/* White flash transition between zones */}
          <AnimatePresence>
            {zoneIndex < ZONES.length - 1 && (
              <motion.div
                key={`flash-${zoneIndex}`}
                className="absolute inset-0 bg-white pointer-events-none z-20"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

