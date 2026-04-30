import type { Metadata } from "next";
import Link from "next/link";
import { RsvpFlow } from "./rsvp-flow";

export const metadata: Metadata = {
  title: "RSVP — Make Emily a Ragsdale",
  openGraph: {
    title: "RSVP — Emily & Sam",
    description: "Join us in San Miguel de Allende — February 27, 2027",
    images: [{ url: "/images/og-rsvp.jpg", width: 1536, height: 1024 }],
  },
};

export default async function RsvpPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

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
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter the code stamped on your invitation.
          </p>
        </header>

        <RsvpFlow initialCode={code} />
      </div>
    </main>
  );
}
