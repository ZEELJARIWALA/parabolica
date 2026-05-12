"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./settings/language-switcher";
import ThemeSwitcher from "./settings/theme-switcher";
import { useLanguage } from "@/context/language-context";
import { useLenis } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { content } = useLanguage();
  const lenis = useLenis();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: content.nav.home, href: "#home" },
    { name: content.nav.about, href: "#about" },
    { name: content.nav.stack, href: "#stack" },
    { name: content.nav.projects, href: "#projects" },
    { name: content.nav.roadmap, href: "#roadmap" },
    { name: content.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);

    if (elem || targetId === "home") {
      setIsMobileMenuOpen(false);

      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(targetId === "home" ? 0 : elem!, {
            offset: targetId === "home" ? 0 : -80,
            duration: 1.5,
          });
        } else {
          if (targetId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            elem?.scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 py-4",
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/40 py-3"
          : "bg-transparent py-6"
      )}
    >
      <nav
        className={cn(
          "mx-auto px-container flex items-center justify-between transition-all duration-700",
          isScrolled
            ? "container"
            : "max-w-full"
        )}
      >
        <Link
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="relative z-[110] flex items-center gap-2 group"
        >
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Kintaro Logo"
              fill
              className="object-contain border border-border rounded-full"
              priority
            />
          </div>
        </Link>

        <div className="hidden xl:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="relative text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 pl-6 border-l border-border/50">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-4">
          <ThemeSwitcher />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-[110] p-2 text-foreground focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-background xl:hidden flex flex-col h-screen w-screen"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <div className="flex flex-col h-full pt-32 pb-12 px-8 overflow-y-auto relative z-10">
              <ul className="flex flex-col gap-6 sm:gap-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + (i * 0.05),
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="group flex items-baseline"
                    >
                      <span className="text-4xl font-black tracking-tighter uppercase text-foreground transition-all duration-300 group-hover:pl-4 group-hover:text-primary">
                        {link.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto pt-12 border-t border-border/50 flex flex-col gap-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">{content.others.select_language}</span>
                    <span className="text-xs text-foreground/50">{content.others.change_the_site_language}</span>
                  </div>
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
