"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";

export default function ROICalculatorPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "resize" && event.data?.height) {
        setIframeHeight(`${event.data.height}px`);
      }
    };
    window.addEventListener("message", handleMessage);

    // Fallback: poll iframe content height
    const interval = setInterval(() => {
      try {
        const iframe = iframeRef.current;
        if (iframe?.contentDocument?.body) {
          const height = iframe.contentDocument.body.scrollHeight;
          if (height > 100) {
            setIframeHeight(`${height + 40}px`);
          }
        }
      } catch {
        // Cross-origin — will use default height
      }
    }, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <main className="relative min-h-screen bg-[#0a0a0f]">
        <iframe
          ref={iframeRef}
          src="/roi-calculator.html"
          title="Parabolica ROI Calculator"
          className="w-full border-0"
          style={{
            height: iframeHeight,
            minHeight: "100vh",
            colorScheme: "dark",
          }}
          allowFullScreen
        />
      </main>
      <Footer />
    </>
  );
}
