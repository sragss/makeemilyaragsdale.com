import { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-2 py-16 sm:px-3 sm:py-24">
      <header className="mb-14 border-b border-garden-moss/20 pb-10 text-center sm:mb-16">
        {eyebrow && (
          <p className="font-edict text-[10px] uppercase tracking-[0.45em] text-garden-olive">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-eros text-[clamp(3.75rem,14vw,7rem)] font-normal uppercase leading-[0.88] text-garden-moss">
          {title}
        </h1>
        {intro && (
          <div className="mx-auto mt-5 max-w-2xl font-serif text-lg italic leading-snug text-[#493932]/78 sm:text-xl">
            {intro}
          </div>
        )}
      </header>
      <div className="space-y-16">{children}</div>
    </div>
  );
}

export function Section({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-5 border-t border-garden-moss/20 pt-7 sm:grid-cols-[12rem_1fr] sm:gap-8">
      {label && (
        <h2 className="font-edict text-[10px] uppercase leading-relaxed tracking-[0.36em] text-garden-olive">
          {label}
        </h2>
      )}
      <div className="space-y-4 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
