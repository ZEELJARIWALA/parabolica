"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { X } from "lucide-react";
import LanguageSwitcher from "./settings/language-switcher";
import ThemeSwitcher from "./settings/theme-switcher";
import { useLanguage } from "@/context/language-context";
import { useLenis } from "@/components/smooth-scroll";
import Image from "next/image";

// Custom 2-line Menu Icon (Lando Style)
const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-8 h-8 flex flex-col justify-center items-end gap-1.5 p-1">
    <motion.div
      animate={isOpen ? { rotate: 45, y: 4, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
      className="h-[2px] bg-foreground rounded-full"
    />
    <motion.div
      animate={isOpen ? { rotate: -45, y: -4, width: "100%" } : { rotate: 0, y: 0, width: "60%" }}
      className="h-[2px] bg-foreground rounded-full"
    />
  </div>
);

export default function Navbar() {
  const { content } = useLanguage();
  const lenis = useLenis();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1920);
  const [containerWidth, setContainerWidth] = useState(1280);
  const [scrollHeight, setScrollHeight] = useState(800);
  const dummyRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, (val) => Math.min(val / scrollHeight, 1));
  const backdropBlur = useTransform(scrollY, (val) => Math.min(val / scrollHeight, 1) * 16);
  const backdropFilter = useMotionTemplate`blur(${backdropBlur}px)`;

  const py = useTransform(scrollY, (val) => {
    const ratio = Math.min(val / scrollHeight, 1);
    return 24 - ratio * 12;
  });

  const startWidth = Math.max(screenWidth, containerWidth);
  const navMaxWidth = useTransform(scrollY, (val) => {
    const ratio = Math.min(val / scrollHeight, 1);
    return startWidth - ratio * (startWidth - containerWidth);
  });

  const navLinks = [
    { name: content.nav.home, href: "/" },
    { name: content.nav.about, href: "/#about" },
    { name: content.nav.projects, href: "/#projects" },
    { name: content.nav.stack, href: "/#stack" },
    { name: content.nav.roadmap, href: "/#roadmap" },
    { name: content.nav.contact, href: "/#contact" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      setScrollHeight(window.innerHeight);

      const updateDimensions = () => {
        setScreenWidth(window.innerWidth);
        setScrollHeight(window.innerHeight);
        if (dummyRef.current) {
          setContainerWidth(dummyRef.current.getBoundingClientRect().width);
        }
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
  }, [isMenuOpen, lenis]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isHomePage = typeof window !== "undefined" && window.location.pathname === "/";
    const isHomeLink = href === "/" || href === "/#home" || href === "#home";

    // If we are on the home page and clicking a home link OR an internal anchor
    if (isHomePage && (isHomeLink || href.includes("#"))) {
      e.preventDefault();
      const targetId = href.includes("#") ? href.split("#")[1] : "home";
      const elem = targetId === "home" ? null : document.getElementById(targetId);

      setIsMenuOpen(false);

      if (lenis) {
        lenis.scrollTo(targetId === "home" ? 0 : (elem || 0), {
          offset: targetId === "home" ? 0 : -80,
          duration: 1.5,
        });
      }
    } else {
      // Allow default Link behavior for cross-page navigation
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        style={{
          paddingTop: py,
          paddingBottom: py,
        }}
        className="fixed top-0 left-0 right-0 z-[100] transition-colors duration-300"
      >
        <div ref={dummyRef} className="container invisible absolute pointer-events-none -z-50" />

        <motion.div
          className="absolute inset-0 bg-transparent -z-10 pointer-events-none"
        />

        <motion.nav
          style={{
            maxWidth: navMaxWidth,
          }}
          className="mx-auto px-container flex items-center justify-between w-full"
        >
          <Link
            href="/"
            onClick={(e) => scrollToSection(e, "/")}
            className="relative z-[110] flex items-center gap-2 group"
          >
            <img
              src="/logo_final.png?v=2"
              alt="Parabolica"
              className="logo-branding"
            />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[110] p-1 text-foreground focus:outline-none transition-transform hover:scale-110"
              aria-label="Toggle Menu"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[95] bg-[#1a1d1a] text-white flex flex-col md:flex-row overflow-hidden"
          >
            {/* Topographical Background Lines */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 20 Q 30 10, 60 20 T 120 20" stroke="white" fill="transparent" strokeWidth="0.1" />
                <path d="M-20 40 Q 20 30, 50 40 T 110 40" stroke="white" fill="transparent" strokeWidth="0.1" />
                <path d="M0 60 Q 40 50, 70 60 T 130 60" stroke="white" fill="transparent" strokeWidth="0.1" />
                <path d="M-10 80 Q 30 70, 80 80 T 140 80" stroke="white" fill="transparent" strokeWidth="0.1" />
              </svg>
            </div>

            {/* Left Side: Image Grid */}
            <div className="hidden md:grid md:w-1/2 grid-cols-2 gap-4 p-12 lg:p-24 h-full relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              >
                <Image src="/assets/menu/f1.png" alt="F1 Racing" fill className="object-cover" />
              </motion.div>
              <div className="flex flex-col gap-4 h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <Image src="/assets/menu/vr.png" alt="VR Experience" fill className="object-cover" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <Image src="/assets/menu/fpv.png" alt="FPV Drone" fill className="object-cover" />
                </motion.div>
              </div>
            </div>

            {/* Right Side: Links */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 pt-32 pb-12 relative z-10">
              <nav className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.08), duration: 0.6 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="group flex items-center gap-4 text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter hover:text-[#ffd700] transition-colors duration-300"
                    >
                      <span className="text-xl sm:text-2xl font-light text-white/30 group-hover:text-[#ffd700]/50 transition-colors">
                        0{i + 1}
                      </span>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">Business Inquiries</span>
                  <a href="mailto:hello@parabolica.com" className="text-sm border-b border-white hover:border-[#ffd700] hover:text-[#ffd700] transition-all">hello@parabolica.com</a>
                </div>
                <div className="flex gap-6">
                  {['INSTAGRAM', 'YOUTUBE', 'TWITTER'].map((social) => (
                    <a key={social} href="#" className="text-[10px] tracking-[0.2em] font-bold hover:text-[#ffd700] transition-colors">{social}</a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
