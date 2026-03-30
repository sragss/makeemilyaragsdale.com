import Link from "next/link";
import { RsvpFlow } from "../rsvp-flow";

export default async function RsvpCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16 sm:py-24">
      <div className="max-w-lg w-full space-y-8">
        <header className="text-center space-y-3">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Emily & Sam
          </Link>
          <h1 className="font-serif text-4xl font-light tracking-tight">
            RSVP
          </h1>
        </header>

        <RsvpFlow initialCode={code.toUpperCase()} />
      </div>
    </main>
  );
}
