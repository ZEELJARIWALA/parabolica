import Projects from "@/components/sections/projects";
import ManifestoFlow from "@/components/manifesto-flow";
import PhotoScroll from "@/components/sections/photo-scroll";
import DeckExplorer from "@/components/sections/deck-explorer";
import About from "@/components/sections/about";
import Booking from "@/components/sections/booking";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/scroll-progress";
import LandingHero from "@/components/sections/landing-hero";
import { IntroSequence } from "@/components/intro-sequence";
import ShopShowcase from "@/components/sections/shop-showcase";

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
              <ManifestoFlow />
              <PhotoScroll />
            </section>

            <ManifestoFlow reverse />

            <section id="projects">
              <Projects />
            </section>

            <ManifestoFlow />

            <section id="events">
              <DeckExplorer />
            </section>

            <ManifestoFlow reverse />

            <section id="shop-showcase">
              <ShopShowcase />
            </section>

            <ManifestoFlow />

            <Booking />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}