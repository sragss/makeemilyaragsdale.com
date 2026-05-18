"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SAndELogo, SamAndEmilyLogo } from "@/components/logos";

export function HomeCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 18, mass: 0.6 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-[920px] will-change-transform"
    >
      <svg
        viewBox="0 0 920 600"
        preserveAspectRatio="none"
        className="block h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
        aria-hidden="true"
      >
        <path
          d="M 24 0 L 896 0 A 24 24 0 0 0 920 24 L 920 576 A 24 24 0 0 0 896 600 L 24 600 A 24 24 0 0 0 0 576 L 0 24 A 24 24 0 0 0 24 0 Z"
          fill="#f2e4bc"
        />
        <path
          d="M 52 40 L 868 40 A 12 12 0 0 0 880 52 L 880 548 A 12 12 0 0 0 868 560 L 52 560 A 12 12 0 0 0 40 548 L 40 52 A 12 12 0 0 0 52 40 Z"
          fill="none"
          stroke="#514f22"
          strokeOpacity="0.5"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center sm:px-20">
        <SAndELogo className="h-16 w-auto text-[#888834] sm:h-20" />

        <p className="mt-5 font-edict text-[12px] font-medium uppercase tracking-[0.34em] text-[#2a2a10] sm:mt-6 sm:text-[13px]">
          February 27, 2027
        </p>

        <SamAndEmilyLogo className="mt-5 h-auto w-full max-w-[620px] text-[#3f3e19] sm:mt-6" />

        <p className="mt-4 font-edict text-lg italic text-[#2a2a10] sm:mt-5 sm:text-xl">
          San Miguel De Allende, Mexico
        </p>

        <Link
          href="/rsvp"
          className="mt-7 inline-block bg-[#898834] px-10 py-3 font-edict text-sm font-medium uppercase tracking-[0.28em] text-[#f2e4bc] transition-colors hover:bg-[#514f22] sm:mt-8"
        >
          RSVP
        </Link>
      </div>
    </motion.div>
  );
}
