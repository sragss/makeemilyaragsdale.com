import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-lg text-center space-y-10">
        <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground font-light">
          February 27, 2027
        </p>

        <h1 className="font-serif text-6xl sm:text-7xl font-light tracking-tight">
          Emily & Sam
        </h1>

        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-border" />
          <p className="text-sm text-muted-foreground tracking-wide">
            San Miguel de Allende
          </p>
          <span className="h-px w-12 bg-border" />
        </div>

        <nav className="flex items-center justify-center gap-8 pt-2 text-xs tracking-[0.2em] uppercase">
          <Link
            href="/details"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Details
          </Link>
          <Link
            href="/rsvp"
            className="text-foreground hover:text-primary transition-colors"
          >
            RSVP
          </Link>
        </nav>
      </div>
    </main>
  );
}
