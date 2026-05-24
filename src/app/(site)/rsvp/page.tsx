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
    <div className="relative -mt-12 overflow-hidden bg-[#f5e9c8] text-[#493932] md:-mt-10">
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

      <section className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-16 sm:gap-10 sm:px-6 sm:pb-24 sm:pt-28 lg:grid-cols-[minmax(0,0.78fr)_minmax(440px,0.92fr)] lg:items-start lg:gap-14">
        <header className="mx-auto max-w-xl pt-4 text-center text-garden-moss lg:sticky lg:top-24 lg:mx-0 lg:text-left">
          <p className="font-inter text-[10px] uppercase tracking-[0.45em] text-garden-moss/65">
            February 26-27, 2027
          </p>
          <h1 className="mt-4 font-eros text-[4rem] font-normal uppercase leading-[0.82] text-garden-moss sm:text-[5.8rem] lg:text-[8.6rem]">
            Kindly
            <br />
            Reply
          </h1>
          <p className="mx-auto mt-5 max-w-md font-edict text-[1.18rem] italic leading-snug text-[#493932]/82 sm:text-[1.45rem] lg:mx-0">
            Let us know who is joining us in San Miguel, which weekend events
            you can attend, and whether you would like to stay with us at the
            Belmond.
          </p>
        </header>

        <RsvpFlow />
      </section>
    </div>
  );
}
