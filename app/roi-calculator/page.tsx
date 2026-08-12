"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";

export default function ROICalculatorPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("1200px");

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let resizeObserver: ResizeObserver | null = null;

    const measureHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;
        const pageWrap = doc.querySelector(".page-wrap") as HTMLElement;
        if (pageWrap) {
          const height = pageWrap.getBoundingClientRect().height || pageWrap.offsetHeight;
          if (height > 100) {
            setIframeHeight(`${Math.ceil(height) + 10}px`);
          }
        }
      } catch {
        // Cross-origin fallback
      }
    };

    const handleLoad = () => {
      measureHeight();

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const pageWrap = doc.querySelector(".page-wrap");
          if (pageWrap && typeof window !== "undefined" && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
              measureHeight();
            });
            resizeObserver.observe(pageWrap);
          }
        }
      } catch {
        // fallback
      }
    };

    iframe.addEventListener("load", handleLoad);
    if (iframe.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    window.addEventListener("resize", measureHeight);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", measureHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <>
      <main className="relative min-h-screen bg-[#0a0a0f] pt-20">
        <iframe
          ref={iframeRef}
          src="/roi-calculator.html"
          title="Parabolica ROI Calculator"
          className="w-full border-0 block"
          style={{
            height: iframeHeight,
            colorScheme: "dark",
          }}
          scrolling="no"
        />
      </main>
      <Footer />
    </>
  );
}
