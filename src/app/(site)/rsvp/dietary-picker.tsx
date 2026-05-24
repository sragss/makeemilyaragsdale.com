"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BASE_OPTIONS = ["Vegetarian", "Vegan", "Gluten Free"] as const;
type DietaryOption = (typeof BASE_OPTIONS)[number];

function parseDietary(
  value: string,
  options: readonly DietaryOption[]
): { tags: string[]; custom: string } {
  if (!value) return { tags: [], custom: "" };
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const tags: string[] = [];
  const custom: string[] = [];
  for (const p of parts) {
    if ((options as readonly string[]).includes(p)) {
      tags.push(p);
    } else {
      custom.push(p);
    }
  }
  return { tags, custom: custom.join(", ") };
}

function serializeDietary(tags: string[], custom: string): string {
  const parts = [...tags];
  if (custom.trim()) parts.push(custom.trim());
  return parts.join(", ");
}

export function DietaryPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const { tags, custom } = parseDietary(value, BASE_OPTIONS);
  const [showCustom, setShowCustom] = useState(custom.length > 0);

  function toggleTag(tag: string) {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    onChange(serializeDietary(next, custom));
  }

  function updateCustom(v: string) {
    onChange(serializeDietary(tags, v));
  }

  const allOptions = [...BASE_OPTIONS, "Other" as const];

  return (
    <div className="space-y-3">
      <p className="font-edict text-[11px] font-medium uppercase tracking-[0.28em] text-garden-cream sm:text-[10px] sm:tracking-[0.36em]">
        Dietary needs
      </p>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((option) => {
          const isOther = option === "Other";
          const selected = isOther ? showCustom : tags.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                isOther ? setShowCustom(!showCustom) : toggleTag(option)
              }
              className={`min-h-12 border px-3.5 py-2.5 font-edict text-[12px] uppercase tracking-[0.16em] transition-colors sm:min-h-10 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.2em] ${
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
              value={custom}
              onChange={(event) => updateCustom(event.target.value)}
              className="w-full border-b border-garden-cream/40 bg-transparent py-3 font-serif text-[17px] text-garden-cream placeholder:text-garden-cream/35 focus:border-garden-cream focus:outline-none sm:py-2 sm:text-base"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
