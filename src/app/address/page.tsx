import type { Metadata } from "next";
import { AddressFlow } from "./address-flow";

export const metadata: Metadata = {
  title: "Emily & Sam — Mailing Address",
  robots: { index: false },
  openGraph: {
    title: "Emily & Sam — Mailing Address",
    description: "Tell us where to send your invitation.",
  },
};

export default function AddressPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-garden-cream px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        <AddressFlow />
      </div>
    </main>
  );
}
