"use client";

import { AnimatePresence, motion } from "framer-motion";

export function AttendToggle({
  attending,
  onChange,
}: {
  attending: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <ReplyChoice
        selected={attending}
        onClick={() => onChange(true)}
        label="Joyfully accept"
        tone="accept"
      />
      <ReplyChoice
        selected={!attending}
        onClick={() => onChange(false)}
        label="Regretfully decline"
        tone="decline"
      />
    </div>
  );
}

function ReplyChoice({
  selected,
  onClick,
  label,
  tone,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  tone: "accept" | "decline";
}) {
  const selectedClass =
    tone === "accept"
      ? "border-[#d2cf53] bg-[#d2cf53] text-[#3f3e19]"
      : "border-[#6b692a] bg-[#6b692a] text-garden-cream";
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`relative min-h-14 overflow-hidden border px-4 py-4 text-left transition-colors sm:py-3 ${
        selected
          ? selectedClass
          : "border-garden-cream/35 text-garden-cream hover:border-garden-cream/70 hover:bg-garden-cream/10"
      }`}
    >
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className="absolute inset-x-3 bottom-2 h-px bg-current/45"
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <span className="relative block font-edict text-[13px] uppercase tracking-[0.2em] sm:text-[12px] sm:tracking-[0.24em]">
        {label}
      </span>
    </button>
  );
}
