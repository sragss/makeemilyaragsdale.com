import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-xl space-y-10">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Saturday, February 27, 2027
        </p>

        <h1 className="font-serif text-6xl font-light tracking-tight sm:text-7xl">
          Emily &amp; Sam
        </h1>

        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-border" />
          <p className="text-sm tracking-wide text-muted-foreground">
            San Miguel de Allende, Mexico
          </p>
          <span className="h-px w-12 bg-border" />
        </div>

        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          We are getting married at Luna Escondida and we want you there.
          A weekend in the high desert with the people we love.
        </p>

        <div className="pt-2">
          <Link
            href="/rsvp"
            className="inline-block rounded-full border border-foreground/80 px-7 py-3 text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            RSVP
          </Link>
        </div>
      </div>
    </section>
  );
}
