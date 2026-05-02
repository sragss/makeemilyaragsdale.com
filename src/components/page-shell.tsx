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
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-14 space-y-4 text-center">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <div className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            {intro}
          </div>
        )}
      </header>
      <div className="space-y-14">{children}</div>
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
    <section className="space-y-5">
      {label && (
        <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </h2>
      )}
      <div className="space-y-4 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
