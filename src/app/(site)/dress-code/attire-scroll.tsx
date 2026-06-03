"use client";

import Image from "next/image";
import { ScrollStackPanels } from "@/components/scroll-stage";

type Look = {
  day: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  alt: string;
  bgClass: string;
  textClass: string;
  accentClass?: string;
  inspirationUrl?: string;
};

const LOOKS: Look[] = [
  {
    day: "Friday Afternoon",
    title: "Resort Casual",
    subtitle: "Pool Party",
    body: "Bring a hat and sunscreen, the high-desert sun is intense.",
    image: "/images/Pool Party Attire.png",
    alt: "Pool party attire inspiration",
    bgClass: "bg-[#493523]",
    textClass: "text-garden-cream",
    accentClass: "text-garden-green",
    inspirationUrl: "https://www.pinterest.com/emily_devery/pool-party-attire/",
  },
  {
    day: "Friday Evening",
    title: "Blanc Soiree",
    subtitle: "Parade and Rooftop",
    body: "Footwear suitable for walking the parade on cobblestone, and a light jacket or wrap for the rooftop after sunset as the temperature drops substantially in the evenings.",
    image: "/images/White Party Attire.png",
    alt: "White party attire inspiration",
    bgClass: "bg-[#f5e9c8]",
    textClass: "text-[#888834]",
    accentClass: "text-[#493523]",
    inspirationUrl: "https://www.pinterest.com/emily_devery/welcome-party-attire/",
  },
  {
    day: "Saturday",
    title: "Enchanted Garden",
    subtitle: "Ceremony & Reception",
    body: "Footwear suitable for walking the cobblestone path between the ceremony and reception.",
    image: "/images/Enchanted Garden Attire.png",
    alt: "Enchanted garden attire inspiration",
    bgClass: "bg-[#3f3e19]",
    textClass: "text-garden-cream",
    accentClass: "text-[#d2cf53]",
    inspirationUrl: "https://www.pinterest.com/emily_devery/enchanted-garden-attire/",
  },
];

export function AttireScroll() {
  return (
    <ScrollStackPanels className="relative -mt-10 w-full">
      {LOOKS.map((look, i) => (
        <AttirePanel key={look.title} look={look} priority={i === 0} />
      ))}
    </ScrollStackPanels>
  );
}

function AttirePanel({ look, priority }: { look: Look; priority?: boolean }) {
  const imageCard = (
    <div className="relative h-[55vh] w-full overflow-hidden md:h-full">
      <Image
        src={look.image}
        alt={look.alt}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 60vw, 100vw"
        priority={priority}
      />
    </div>
  );

  return (
    <section
      className={`flex h-full items-center overflow-hidden ${look.bgClass} ${look.textClass}`}
    >
      <div className="mx-auto grid h-full w-full items-center gap-8 md:grid-cols-[3fr_2fr] md:gap-16">
        <div className="h-[55vh] md:h-full">
          {look.inspirationUrl ? (
            <a
              href={look.inspirationUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${look.title} inspiration board`}
              className="block h-full"
            >
              {imageCard}
            </a>
          ) : (
            imageCard
          )}
        </div>
        <div className="px-6 pb-20 text-center md:px-12 md:pb-0">
          <p
            className={`font-edict text-xs font-medium uppercase tracking-[0.45em] opacity-80 ${look.accentClass ?? ""}`}
          >
            {look.day}
          </p>
          <h2 className="mt-6 font-eros text-5xl font-normal uppercase leading-[0.9] sm:text-6xl">
            {look.title}
          </h2>
          <p
            className={`mt-4 font-serif text-2xl italic opacity-90 sm:text-3xl ${look.accentClass ?? ""}`}
          >
            {look.subtitle}
          </p>
          <p className="mx-auto mt-8 max-w-md font-edict text-base leading-relaxed text-balance opacity-85">
            {look.body}
          </p>
          {look.inspirationUrl ? (
            <p className="mt-5">
              <a
                href={look.inspirationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-edict text-xs font-medium uppercase tracking-[0.3em] underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100 ${look.accentClass ?? ""}`}
              >
                get inspired
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
