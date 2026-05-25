"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SLIDES = [
  "/images/Belmond 1 upscale.jpg",
  "/images/Belmond 2 upscale.jpg",
  "/images/Belmond 3 Upscale.jpg",
  "/images/Belmond 4.png",
  "/images/Belmond 5 Upscale.jpg",
  "/images/belmond-6-upscale.png",
];

const AUTO_MS = 8000;

export function BelmondCarousel() {
  const [index, setIndex] = useState(0);

  const go = (next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <section className="relative aspect-[3/4] w-full overflow-hidden bg-[#1c1109] md:aspect-auto md:h-full">
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[index]}
              alt={`Belmond Casa de Sierra Nevada — view ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <a
            href="#"
            className="font-inter inline-block border border-[#f5e9c8]/85 bg-black/15 px-8 py-3.5 text-[11px] uppercase tracking-[0.28em] text-[#f5e9c8] backdrop-blur-sm transition-colors hover:bg-[#f5e9c8] hover:text-[#493932]"
          >
            Booking Link
          </a>
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5e9c8]/60 bg-black/30 text-[#f5e9c8] backdrop-blur-sm transition-all hover:scale-105 hover:border-[#f5e9c8] hover:bg-black/45 sm:left-8 sm:h-14 sm:w-14"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5e9c8]/60 bg-black/30 text-[#f5e9c8] backdrop-blur-sm transition-all hover:scale-105 hover:border-[#f5e9c8] hover:bg-black/45 sm:right-8 sm:h-14 sm:w-14"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[3px] w-10 transition-colors sm:w-14 ${
                i === index ? "bg-[#f5e9c8]" : "bg-[#f5e9c8]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
