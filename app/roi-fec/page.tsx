"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";

export default function ROICalculatorPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState("1200px");

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let timers: ReturnType<typeof setTimeout>[] = [];

        const measureHeight = () => {
            try {
                const doc =
                    iframe.contentDocument ||
                    iframe.contentWindow?.document;

                if (!doc) return;

                const body = doc.body;
                const html = doc.documentElement;

                if (!body || !html) return;

                // Prevent internal iframe scrolling
                html.style.overflow = "hidden";
                body.style.overflow = "hidden";

                const height = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.scrollHeight,
                    html.offsetHeight,
                    html.clientHeight
                );

                if (height > 100) {
                    setIframeHeight(`${Math.ceil(height) + 30}px`);
                }
            } catch {
                // Same-origin fallback
            }
        };

        const handleLoad = () => {
            measureHeight();

            timers.push(
                setTimeout(measureHeight, 100),
                setTimeout(measureHeight, 500),
                setTimeout(measureHeight, 1000),
                setTimeout(measureHeight, 2000)
            );
        };

        iframe.addEventListener("load", handleLoad);

        if (iframe.contentDocument?.readyState === "complete") {
            handleLoad();
        }

        window.addEventListener("resize", measureHeight);

        return () => {
            iframe.removeEventListener("load", handleLoad);
            window.removeEventListener("resize", measureHeight);

            timers.forEach((timer) => clearTimeout(timer));
        };
    }, []);

    return (
        <>
            <main className="relative w-full p-0 m-0">
                <div className="w-full p-0 m-0 overflow-hidden">
                    <iframe
                        ref={iframeRef}
                        src="/roi-fec.html"
                        title="Parabolica ROI Calculator for FECs"
                        className="block w-full border-0 p-0 m-0"
                        style={{
                            height: iframeHeight,
                            display: "block",
                            border: "none",
                            margin: 0,
                            padding: 0,
                            colorScheme: "dark",
                        }}
                        scrolling="no"
                    />
                </div>
            </main>

            <Footer />
        </>
    );
}