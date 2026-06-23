"use client";

import { useLanguage } from "@/context/language-context";

export default function ManifestoFlow({ reverse = false, items }: { reverse?: boolean; items?: string[] }) {
  const { content } = useLanguage();

  const manifestoItems = items || content?.manifesto?.items || [];

  if (!manifestoItems || manifestoItems.length === 0) return null;

  // Calculate total characters to keep linear scroll speed constant
  const totalChars = manifestoItems.reduce((acc: number, item: string) => acc + item.length, 0);
  // Reference: 92 characters takes 60 seconds (approx 1.5s per character)
  const duration = (totalChars / 92) * 60;

  const Separator = () => (
    <div className="aspect-square h-3 w-3 rounded-full bg-foreground/10 sm:h-4 sm:w-4 md:h-5 md:w-5 xl:h-6 xl:w-6" />
  );

  return (
    <div className="relative w-full overflow-hidden border-y border-border/50 py-10 select-none pointer-events-none bg-background/50 backdrop-blur-sm">

      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />

      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex w-full overflow-hidden marquee-track pointer-events-auto">

        <div 
          style={{ animationDuration: `${duration}s` }}
          className={`animate-scroll flex min-w-full shrink-0 items-center justify-around gap-8 pr-8 xl:gap-16 xl:pr-16 ${reverse ? 'direction-reverse' : ''}`}
        >
          {manifestoItems.map((item: string, index: number) => (
            <div key={`t1-${index}`} className="flex items-center gap-8 xl:gap-16">
              <span
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase text-foreground/25 whitespace-nowrap"
              >
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>

        <div 
          style={{ animationDuration: `${duration}s` }}
          className={`animate-scroll flex min-w-full shrink-0 items-center justify-around gap-8 pr-8 xl:gap-16 xl:pr-16 ${reverse ? 'direction-reverse' : ''}`}
        >
          {manifestoItems.map((item: string, index: number) => (
            <div key={`t2-${index}`} className="flex items-center gap-8 xl:gap-16">
              <span
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase text-foreground/25 whitespace-nowrap"
              >
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}