"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MAIN_COURSES = [
  "Steak",
  "Chicken",
  "Fish",
  "Vegetarian",
  "Vegan",
] as const;

export function MainCoursePicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id: string;
}) {
  const isPreset = (MAIN_COURSES as readonly string[]).includes(value);
  const [showCustom, setShowCustom] = useState(value.length > 0 && !isPreset);
  const customValue = showCustom && !isPreset ? value : "";
  const allOptions = [...MAIN_COURSES, "Other" as const];

  return (
    <div className="space-y-3">
      <p className="font-edict text-[11px] font-medium uppercase tracking-[0.28em] text-garden-cream sm:text-[10px] sm:tracking-[0.36em]">
        Main course preference
        <span className="ml-1 text-garden-cream/70">*</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((option) => {
          const isOther = option === "Other";
          const selected = isOther ? showCustom : value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                if (isOther) {
                  setShowCustom(true);
                  if (isPreset) onChange("");
                } else {
                  setShowCustom(false);
                  onChange(option);
                }
              }}
              className={`relative min-h-12 border px-3.5 py-2.5 font-edict text-[12px] uppercase tracking-[0.16em] transition-colors sm:min-h-10 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.2em] ${
                selected
                  ? "border-garden-cream bg-garden-cream text-garden-olive"
                  : "border-garden-cream/35 text-garden-cream hover:border-garden-cream/70 hover:bg-garden-cream/10"
              }`}
            >
              {option}
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
            <input
              id={id}
              placeholder="e.g. can only eat goose meat"
              value={customValue}
              onChange={(event) => onChange(event.target.value)}
              className="w-full border-b border-garden-cream/40 bg-transparent py-3 font-serif text-[17px] text-garden-cream placeholder:text-garden-cream/35 focus:border-garden-cream focus:outline-none sm:py-2 sm:text-base"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
