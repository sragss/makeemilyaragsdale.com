"use client";

import Image from "next/image";
import { Globe, Mail, Phone } from "lucide-react";
import { ScrollStackPanels } from "@/components/scroll-stage";
import { BelmondCarousel } from "./belmond-carousel";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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
    name: "L'otel Casa Arca",
    src: "/images/L'otel Casa Arca.png",
    note: "Boutique design hotel tucked into Centro.",
    href: "https://www.lotel-casaarca.com/",
  },
  {
    name: "Maria Camille",
    src: "/images/Maria Camille.png",
    note: "Romantic colonial-style hotel near the Jardín.",
    href: "https://www.hotelmariacamille.com/en",
  },
];

const AIRPORTS = [
  { code: "QRO", name: "Querétaro", distance: "~1 hour by car." },
  { code: "BJX", name: "Bajío", distance: "~1.5 hours by car." },
  { code: "MEX", name: "Mexico City", distance: "~3 hours by car." },
];

type ContactType = "whatsapp" | "phone" | "website" | "email";

type TransportContact = {
  type: ContactType;
  label: string;
  href: string;
};

type TransportService = {
  name: string;
  contacts: TransportContact[];
};

const TRANSPORT_SERVICES: TransportService[] = [
  {
    name: "SMA Shuttles",
    contacts: [
      {
        type: "whatsapp",
        label: "+52 418 144 2546",
        href: "https://wa.me/524181442546",
      },
      {
        type: "website",
        label: "smashuttles.com",
        href: "https://www.smashuttles.com/",
      },
    ],
  },
  {
    name: "Juan Cruz",
    contacts: [
      {
        type: "whatsapp",
        label: "+52 415 177 6738",
        href: "https://wa.me/524151776738",
      },
    ],
  },
  {
    name: "Enlaces Turísticos",
    contacts: [
      {
        type: "website",
        label: "enlacesturisticosintegrados.com",
        href: "https://enlacesturisticosintegrados.com/",
      },
    ],
  },
  {
    name: "Bajio Go",
    contacts: [
      {
        type: "whatsapp",
        label: "+52 415 185 8665",
        href: "https://wa.me/524151858665",
      },
      {
        type: "phone",
        label: "USA +1 202 609 9905",
        href: "tel:+12026099905",
      },
      {
        type: "email",
        label: "bajiogoshuttle@gmail.com",
        href: "mailto:bajiogoshuttle@gmail.com",
      },
    ],
  },
];

function ContactIcon({
  type,
  className,
}: {
  type: ContactType;
  className?: string;
}) {
  if (type === "whatsapp") return <WhatsAppIcon className={className} />;
  if (type === "website")
    return <Globe className={className} aria-hidden="true" strokeWidth={1.6} />;
  if (type === "email")
    return <Mail className={className} aria-hidden="true" strokeWidth={1.6} />;
  return <Phone className={className} aria-hidden="true" strokeWidth={1.6} />;
}

export function TravelScroll() {
  return (
    <>
      <div className="flex flex-col md:hidden">
        <HeroPanel />
        <BelmondIntroPanel />
        <BelmondCarousel />
        <HotelsPanel />
        <TransportationPanel />
      </div>
      <ScrollStackPanels className="relative -mt-12 hidden w-full md:-mt-10 md:block">
        <HeroPanel />
        <BelmondIntroPanel />
        <BelmondCarousel />
        <HotelsPanel />
        <TransportationPanel />
      </ScrollStackPanels>
    </>
  );
}

function HeroPanel() {
  return (
    <section className="relative min-h-[calc(100svh-2.5rem)] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-0">
      <Image
        src="/images/TravelandStay-Hero.png"
        alt="San Miguel de Allende skyline at golden hour"
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover object-[70%_50%] md:object-center"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1 className="text-center font-eros text-[clamp(5.07rem,18.59vw,15.21rem)] font-normal uppercase leading-[0.75] tracking-[-0.01em] text-[#f5e9c8] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] md:text-left md:leading-[0.85]">
          <span className="block md:inline">Travel </span>
          <span className="block md:inline">&amp; Stay</span>
        </h1>
      </div>
    </section>
  );
}

function BelmondIntroPanel() {
  return (
    <section className="flex min-h-[calc(100svh-2.5rem)] items-center justify-center overflow-hidden bg-[#f5e9c8] px-6 py-16 text-[#493932] md:h-full md:min-h-0 md:px-3 md:py-0 md:pb-[14vh]">
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
    <section className="flex min-h-[calc(100svh-2.5rem)] flex-col items-center justify-start overflow-hidden bg-[#f5e9c8] px-6 py-16 text-[#493932] md:h-full md:min-h-0 md:px-3 md:py-0 md:pt-[12vh]">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="font-edict text-3xl font-light italic sm:text-4xl">
          Other hotels we recommend
        </h2>
        <p className="text-balance font-inter text-[15px] leading-relaxed text-[#493932]/80 sm:text-base">
          For guests who are not able to stay at the Belmond, here are a few
          hotels we&apos;d recommend nearby. All are walkable to the Belmond.
        </p>
      </div>

      <ul className="mt-10 grid w-full grid-cols-2 gap-y-6 md:mt-[22vh] md:grid-cols-4">
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
    <section className="flex items-center justify-center overflow-hidden bg-[#888834] px-6 py-16 text-[#f5e9c8] md:h-full md:px-5 md:py-0">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 text-center sm:mb-14">
          <h2 className="font-edict text-xl uppercase tracking-[0.06em] md:text-5xl md:tracking-[0.18em]">
            Transportation
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2 lg:gap-x-24">
          <div className="space-y-10">
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
                      <p className="font-edict text-[15px] uppercase tracking-[0.18em] text-[#d2cf53] sm:text-base">
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
                  Ubers
                </h3>
              </header>
              <p className="font-inter text-[13px] leading-relaxed text-[#f5e9c8]/85 sm:text-sm">
                San Miguel itself is walkable, and Uber is around $5 a ride.
              </p>
            </div>

            <div>
              <header className="mb-5 border-b border-[#f5e9c8]/35 pb-3">
                <h3 className="font-edict text-xl italic font-normal sm:text-2xl">
                  Shuttles
                </h3>
              </header>
              <p className="font-inter text-[13px] leading-relaxed text-[#f5e9c8]/85 sm:text-sm">
                A shuttle will run between a central pickup spot in town and
                Luna Escondida on Saturday evening, with returns from 11 pm to 2
                am. More details to come.
              </p>
            </div>
          </div>

          <div>
            <header className="mb-5 border-b border-[#f5e9c8]/35 pb-3">
              <h3 className="font-edict text-xl italic font-normal sm:text-2xl">
                Ground
              </h3>
            </header>

            <p className="font-inter text-[13px] leading-relaxed text-[#f5e9c8]/85 sm:text-sm">
              Pre-book a car for arrival.
              <br />
              Four services recommended by our planner:
            </p>

            <ul className="mt-4">
              {TRANSPORT_SERVICES.map((service, i) => (
                <li
                  key={service.name}
                  className={`py-3 ${
                    i < TRANSPORT_SERVICES.length - 1
                      ? "border-b border-[#f5e9c8]/15"
                      : ""
                  }`}
                >
                  <p className="font-edict text-[15px] uppercase tracking-[0.18em] text-[#d2cf53]">
                    {service.name}
                  </p>
                  <ul className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
                    {service.contacts.map((contact) => {
                      const external =
                        contact.type === "website" ||
                        contact.type === "whatsapp";
                      const isLink = contact.type !== "phone";
                      return (
                        <li key={contact.label}>
                          {isLink ? (
                            <a
                              href={contact.href}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noopener noreferrer" : undefined}
                              className="group flex items-center gap-2 font-inter text-[12px] tracking-wide text-[#f5e9c8]/80 transition-colors duration-150 hover:text-[#d2cf53]"
                            >
                              <ContactIcon
                                type={contact.type}
                                className="h-3.5 w-3.5 shrink-0 transition-colors duration-150"
                              />
                              <span>{contact.label}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 font-inter text-[12px] tracking-wide text-[#f5e9c8]/80">
                              <ContactIcon
                                type={contact.type}
                                className="h-3.5 w-3.5 shrink-0 text-[#f5e9c8]/70"
                              />
                              <span>{contact.label}</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
