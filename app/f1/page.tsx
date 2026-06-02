"use client";

import { useEffect } from "react";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import ManifestoFlow from "@/components/manifesto-flow";
import Stack from "@/components/sections/stack";
import Events from "@/components/sections/events";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import ScrollProgress from "@/components/scroll-progress";
import { BackgroundCar } from "@/components/background-car";
import { useLenis } from "@/components/smooth-scroll";

export default function F1Page() {
  const lenis = useLenis();

  useEffect(() => {
    // Force scroll to top on mount
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis]);
  return (
    <>
      <ScrollProgress />

      <main className="relative min-h-screen">
        {/* Background Car */}
        <BackgroundCar />

        <div className="relative z-10 w-full">
          <Hero />

          <div className="relative z-10 bg-background/80 backdrop-blur-sm border-t border-border">
            <section id="about">
              <About />
            </section>

            <ManifestoFlow />

            <section id="stack">
              <Stack />
            </section>

            <ManifestoFlow reverse />

            <section id="projects">
              <Projects />
            </section>

            <ManifestoFlow />

            <section id="contact">
              <Contact />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
