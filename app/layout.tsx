import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { IntroSequence } from "@/components/intro-sequence";
import { CustomCursor } from "@/components/custom-cursor";
import Navbar from "@/components/navbar";
import { APP_CONFIG } from "@/lib/constants";
import { IntroProvider } from "@/context/intro-context";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.DESC,
  icons: {
    icon: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased`}>
        <LanguageProvider>
          <IntroProvider>
            <ThemeProvider>
              <CustomCursor />
              
              {/* Hydration Curtain: Prevents flashing the site before intro starts */}
              <div 
                id="hydration-guard" 
                className="transition-opacity duration-700 pointer-events-none"
                style={{ 
                  position: 'fixed', 
                  inset: 0, 
                  background: 'black', 
                  zIndex: 99998,
                  opacity: 1
                }} 
              />
              
              <IntroSequence />
              <SmoothScroll>
                <Navbar />
                {children}
              </SmoothScroll>
            </ThemeProvider>
          </IntroProvider>
        </LanguageProvider>

        {/* Script to remove the guard once IntroSequence is ready or if it fails to load */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', () => {
             // We keep it for a bit so IntroSequence can take over
             setTimeout(() => {
               const guard = document.getElementById('hydration-guard');
               if (guard) guard.style.opacity = '0';
               setTimeout(() => guard?.remove(), 500);
             }, 800);
          });
        `}} />
      </body>
    </html>
  );
}
