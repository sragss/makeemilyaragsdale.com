"use client";

const MAIN_COURSES = [
  "Beef",
  "Pork",
  "Chicken",
  "Fish",
  "Vegetarian",
] as const;

export function MainCoursePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
  id: string;
}) {
  return (
    <div className="space-y-3">
      <p className="font-edict text-[11px] font-medium uppercase tracking-[0.28em] text-garden-cream sm:text-[10px] sm:tracking-[0.36em]">
        Main course preference
        <span className="ml-1 text-garden-cream/70">*</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {MAIN_COURSES.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={`relative min-h-12 border px-3.5 py-2.5 font-edict text-[12px] uppercase tracking-[0.16em] transition-colors sm:min-h-10 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.2em] ${
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
