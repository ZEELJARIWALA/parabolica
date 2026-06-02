import Projects from "@/components/sections/projects";
import ManifestoFlow from "@/components/manifesto-flow";
import PhotoScroll from "@/components/sections/photo-scroll";
import Events from "@/components/sections/events";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import ScrollProgress from "@/components/scroll-progress";
import LandingHero from "@/components/sections/landing-hero";
import { IntroSequence } from "@/components/intro-sequence";

export default function Home() {
  return (
    <>
      <ScrollProgress />

      <main className="relative min-h-screen">
        <div className="relative z-10 w-full">
          {/* Simple PARABOLICA hero — no F1 cars/drivers */}
          <LandingHero />

          <div className="relative z-10 bg-background/80 backdrop-blur-sm border-t border-border">
            <section id="about">
              <About />
            </section>

            <ManifestoFlow />

            <section id="gallery">
              <PhotoScroll />
            </section>

            <ManifestoFlow reverse />

            <section id="projects">
              <Projects />
            </section>

            <ManifestoFlow />

            <section id="roadmap">
              <Events />
            </section>

            <ManifestoFlow reverse />

            <section id="contact">
              <Contact />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}