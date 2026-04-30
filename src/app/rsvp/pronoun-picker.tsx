"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoiseBackground } from "@/components/ui/noise-background";
import { NOISE_GRADIENT_COLORS } from "@/lib/constants";

const OPTIONS = ["he/him", "she/her", "they/them", "daddy/sir"] as const;

export function PronounPicker({ id }: { id: string }) {
  const [selected, setSelected] = useState<string>("");
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState("");

  const allOptions = [...OPTIONS, "Other" as const];

  function pick(opt: string) {
    if (opt === "Other") {
      setShowCustom((s) => !s);
      if (showCustom) setSelected("");
      return;
    }
    setSelected((cur) => (cur === opt ? "" : opt));
    setShowCustom(false);
  }

  return (
    <div className="space-y-2">
      <Label>
        Pronouns <span className="text-destructive">*</span>
      </Label>
      <div className="relative rounded-sm overflow-hidden">
        <NoiseBackground
          containerClassName="absolute inset-0"
          gradientColors={[...NOISE_GRADIENT_COLORS]}
          noiseIntensity={0.1}
          speed={0.03}
        >
          <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none" />
        </NoiseBackground>

        <div className="relative z-10 flex flex-col gap-[3px] bg-background p-[3px]">
          <div className="flex flex-wrap gap-[3px]">
            {allOptions.map((opt) => {
              const isOther = opt === "Other";
              const isSelected = isOther ? showCustom : selected === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pick(opt)}
                  className="relative px-3 py-1.5 text-xs cursor-pointer bg-transparent"
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 28,
                        }}
                        className="absolute inset-0 bg-primary rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      />
                    )}
                  </AnimatePresence>
                  <span
                    className={`relative z-10 ${isSelected ? "text-primary-foreground font-medium" : "text-foreground/70 hover:text-foreground"} transition-colors`}
                  >
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence initial={false}>
            {showCustom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Input
                  id={id}
                  placeholder="e.g. twink/queen"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
