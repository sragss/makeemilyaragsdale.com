"use client";

import Image from "next/image";
import { ScrollStackPanels } from "@/components/scroll-stage";
import { BelmondCarousel } from "./belmond-carousel";

const HOTELS = [
  {
    name: "Numu",
    src: "/images/Numu.png",
    note: "One block from the Jardín. Tasteful, intimate, an excellent bar.",
    href: "https://www.hyatt.com/unbound-collection/en-US/bjxub-numu",
  },
  {
    name: "Live Aqua",
    src: "/images/Live Aqua.png",
    note: "Larger urban resort with spa, pool, and full amenities.",
    href: "https://www.fiestamericanatravelty.com/en/live-aqua/hotels/live-aqua-san-miguel-de-allende",
  },
  {
    name: "Hacienda El Santuario",
    src: "/images/Hacienda el santurario.png",
    note: "Whitewashed boutique in Centro with a rooftop onto the Parroquia.",
    href: "https://www.haciendaelsantuario.com/es/",
  },
  {
    name: "Casa Carmen",
    src: "/images/Casa Carmen.png",
    note: "Longtime B&B with a courtyard and included breakfast.",
    href: "https://casa-carmen.san-miguel-de-allendehotels.com/en/",
  },
];

const AIRPORTS = [
  { code: "QRO", name: "Querétaro", distance: "~1 hour by car." },
  { code: "MEX", name: "Mexico City", distance: "~3 hours by car." },
  { code: "BJX", name: "Bajío", distance: "~1.5 hours by car." },
];

export function TravelScroll() {
  return (
    <ScrollStackPanels className="relative -mt-12 w-full md:-mt-10">
      <HeroPanel />
      <BelmondIntroPanel />
      <BelmondCarousel />
      <HotelsPanel />
      <TransportationPanel />
    </ScrollStackPanels>
  );
}

function HeroPanel() {
  return (
    <section className="relative h-full w-full overflow-hidden">
      <Image
        src="/images/TravelandStay-Hero.png"
        alt="San Miguel de Allende skyline at golden hour"
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1 className="font-eros text-[clamp(5.07rem,18.59vw,15.21rem)] font-normal uppercase leading-[0.85] tracking-[-0.01em] text-[#f5e9c8] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
          Travel &amp; Stay
        </h1>
      </div>
    </section>
  );
}

function BelmondIntroPanel() {
  return (
    <section className="flex h-full items-center justify-center overflow-hidden bg-[#f5e9c8] px-6 pb-[14vh] text-[#493932]">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h2 className="font-edict text-[2.25rem] font-medium uppercase tracking-[0.08em] sm:text-[2.7rem]">
          The Belmond
        </h2>
        <p className="font-edict text-[1.44rem] italic font-normal sm:text-[1.73rem]">
          Casa de Sierra Nevada
        </p>
        <p className="font-inter mx-auto max-w-2xl text-[15px] leading-relaxed sm:text-base">
          We have reserved the Belmond as our home base for the weekend, and we
          would love for as many of you as possible to stay with us. Friday&apos;s
          pool party and the Callejoneada both begin here, so staying at the
          Belmond means you are in the middle of everything. With 37 rooms, the
          block will fill up. Please book early to secure a spot.
        </p>
      </div>
    </section>
  );
}

function HotelsPanel() {
  return (
    <section className="flex h-full flex-col overflow-hidden bg-[#f5e9c8] text-[#493932]">
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="font-edict text-3xl font-light italic sm:text-4xl">
            Other hotels we recommend
          </h2>
          <p className="font-inter text-[15px] leading-relaxed text-[#493932]/80 sm:text-base">
            For guests who are not able to stay at the Belmond, here are a few
            hotels we&apos;d recommend nearby. All are walkable to the center of
            town.
          </p>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-y-6 pb-12 sm:grid-cols-4">
        {HOTELS.map((hotel) => (
          <li key={hotel.name} className="space-y-4">
            <a
              href={hotel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[3/2] w-full overflow-hidden"
              aria-label={`${hotel.name} - opens in a new tab`}
            >
              <Image
                src={hotel.src}
                alt={hotel.name}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </a>
            <p className="text-center font-edict text-[0.975rem] uppercase tracking-[0.22em] text-[#493932]">
              {hotel.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TransportationPanel() {
  return (
    <section className="flex h-full items-center justify-center overflow-hidden bg-[#888834] px-6 text-[#f5e9c8] sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 text-center sm:mb-14">
          <p className="font-inter text-[10px] uppercase tracking-[0.45em] text-[#f5e9c8]/65">
            Getting to &amp; around San Miguel
          </p>
          <h2 className="mt-3 font-edict text-4xl uppercase tracking-[0.18em] sm:text-5xl">
            Transportation
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2 lg:gap-x-24">
          <div>
            <header className="mb-5 border-b border-[#f5e9c8]/35 pb-3">
              <h3 className="font-edict text-xl italic font-normal sm:text-2xl">
                Airports
              </h3>
            </header>
            <ul>
              {AIRPORTS.map((airport, index) => (
                <li
                  key={airport.code}
                  className={`flex items-baseline justify-between gap-4 py-3 ${
                    index < AIRPORTS.length - 1
                      ? "border-b border-[#f5e9c8]/15"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-edict text-[15px] uppercase tracking-[0.18em] sm:text-base">
                      {airport.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5e9c8]/60">
                      {airport.code}
                    </p>
                  </div>
                  <p className="font-inter text-[12px] italic text-[#f5e9c8]/85 sm:text-[13px]">
                    {airport.distance}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <header className="mb-5 border-b border-[#f5e9c8]/35 pb-3">
              <h3 className="font-edict text-xl italic font-normal sm:text-2xl">
                Ground
              </h3>
            </header>

            <p className="font-inter text-[13px] leading-relaxed text-[#f5e9c8]/85 sm:text-sm">
              We recommend pre-booking a car for arrival. Two services we trust:
            </p>

            <ul className="mt-4">
              <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#f5e9c8]/15 py-3">
                <p className="font-edict text-[15px] uppercase tracking-[0.18em]">
                  TransportArte Mexico
                </p>
                <p className="font-mono text-[11px] tracking-wider text-[#f5e9c8]/85">
                  +52 415 105 5196
                </p>
              </li>
              <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                <p className="font-edict text-[15px] uppercase tracking-[0.18em]">
                  Transportes Turísticos Allende
                </p>
                <a
                  className="font-mono text-[11px] tracking-wider text-[#f5e9c8]/85 underline underline-offset-4 hover:text-[#f5e9c8]"
                  href="https://transportesturisticosallende.com/contacto.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  visit website
                </a>
              </li>
            </ul>

            <p className="mt-5 font-edict text-[15px] italic leading-relaxed text-[#f5e9c8]/90 sm:text-base">
              A shuttle will run between central pickup in town and Luna
              Escondida on Saturday evening, with returns from 11 pm to 2 am.
              San Miguel itself is walkable, and Uber is around $5 a ride.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
