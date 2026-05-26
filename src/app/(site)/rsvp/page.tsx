import type { Metadata } from "next";
import Image from "next/image";
import { RsvpFlow } from "./rsvp-flow";

export const metadata: Metadata = {
  title: "Emily & Sam — RSVP",
  openGraph: {
    title: "Emily & Sam — RSVP",
    description: "Join us in San Miguel de Allende — February 27, 2027",
    images: [{ url: "/images/og-rsvp.jpg", width: 1536, height: 1024 }],
  },
};

export default function RsvpPage() {
  return (
    <div
      data-route="rsvp"
      className="relative flex flex-1 flex-col overflow-hidden bg-[#f5e9c8] text-[#493932] md:-mt-10"
    >
      <div className="absolute inset-x-0 top-0 h-[46vh] overflow-hidden sm:h-[58vh]">
        <Image
          src="/images/Home.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%] opacity-35 saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5e9c8]/60 via-[#f5e9c8]/72 to-[#f5e9c8]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-2 py-4 sm:flex-none sm:justify-start sm:px-3 sm:py-28">
        <RsvpFlow />
      </section>
    </div>
  );
}
