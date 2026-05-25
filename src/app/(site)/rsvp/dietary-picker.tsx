"use client";

const BASE_OPTIONS = [
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Nut Allergy",
  "Shellfish Allergy",
] as const;
type DietaryOption = (typeof BASE_OPTIONS)[number];

function parseDietary(value: string): DietaryOption[] {
  if (!value) return [];
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const tags: DietaryOption[] = [];
  for (const p of parts) {
    if ((BASE_OPTIONS as readonly string[]).includes(p)) {
      tags.push(p as DietaryOption);
    }
  }
  return tags;
}

export function DietaryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const tags = parseDietary(value);

  function toggleTag(tag: DietaryOption) {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    onChange(next.join(", "));
  }

  return (
    <div className="space-y-3">
      <p className="font-edict text-[11px] font-medium uppercase tracking-[0.28em] text-garden-cream sm:text-[10px] sm:tracking-[0.36em]">
        Dietary needs
      </p>
      <div className="flex flex-wrap gap-2">
        {BASE_OPTIONS.map((option) => {
          const selected = tags.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleTag(option)}
              className={`min-h-12 border px-3.5 py-2.5 font-edict text-[12px] uppercase tracking-[0.16em] transition-colors sm:min-h-10 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.2em] ${
                selected
                  ? "border-[#d2cf53] bg-[#d2cf53] text-[#3f3e19]"
                  : "border-garden-cream/35 text-garden-cream hover:border-garden-cream/70 hover:bg-garden-cream/10"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
