"use client";

import { motion } from "framer-motion";
import { NoiseBackground } from "@/components/ui/noise-background";
import { NOISE_GRADIENT_COLORS } from "@/lib/constants";

export function AttendToggle({
  attending,
  onChange,
}: {
  attending: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <NoiseBackground
      containerClassName="rounded-sm cursor-pointer transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]"
      gradientColors={[...NOISE_GRADIENT_COLORS]}
      noiseIntensity={0.15}
      speed={0.04}
    >
      <div className="absolute inset-0 z-[5] shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),inset_0_0_12px_rgba(0,0,0,0.06)] pointer-events-none rounded-sm" />

      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-8px)] bg-primary rounded-[2px] z-[6] shadow-[0_2px_8px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
        animate={{ x: attending ? 4 : "calc(100% + 12px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
      />

      <div className="relative z-[11] flex">
        <button
          type="button"
          onClick={() => onChange(true)}
          className="flex-1 py-3 text-center cursor-pointer group/btn"
        >
          <motion.span
            animate={{
              color: attending
                ? "var(--primary-foreground)"
                : "var(--foreground)",
            }}
            transition={{ duration: 0.2 }}
            className={`font-serif text-base font-semibold transition-opacity duration-150 ${!attending ? "group-hover/btn:opacity-70" : ""}`}
          >
            Joyfully accept
          </motion.span>
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className="flex-1 py-3 text-center cursor-pointer group/btn"
        >
          <motion.span
            animate={{
              color: !attending
                ? "var(--primary-foreground)"
                : "var(--foreground)",
            }}
            transition={{ duration: 0.2 }}
            className={`font-serif text-base font-semibold transition-opacity duration-150 ${attending ? "group-hover/btn:opacity-70" : ""}`}
          >
            Regretfully decline
          </motion.span>
        </button>
      </div>
    </NoiseBackground>
  );
}
