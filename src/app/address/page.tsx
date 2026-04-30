import type { Metadata } from "next";
import Link from "next/link";
import { AddressFlow } from "./address-flow";

export const metadata: Metadata = {
  title: "Mailing Address - Make Emily a Ragsdale",
  robots: { index: false },
  openGraph: {
    title: "Mailing Address - Emily & Sam",
    description: "Tell us where to send your invitation.",
    images: [{ url: "/images/og-rsvp.jpg", width: 1536, height: 1024 }],
  },
};

export default async function AddressPage({
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
            Mailing Address
          </h1>
        </header>

        <AddressFlow initialCode={code} />
      </div>
    </main>
  );
}
