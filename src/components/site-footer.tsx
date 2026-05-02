import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left sm:px-6">
        <div className="space-y-1">
          <p className="font-serif text-lg font-light tracking-tight">
            Emily &amp; Sam
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            February 27, 2027 &middot; San Miguel de Allende
          </p>
        </div>
        <Link
          href="/rsvp"
          className="rounded-full border border-foreground/80 px-5 py-2 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          RSVP
        </Link>
      </div>
    </footer>
  );
}
