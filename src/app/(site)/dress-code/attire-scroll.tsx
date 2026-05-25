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
  ringClass: string;
};

const LOOKS: Look[] = [
  {
    day: "Friday Afternoon",
    title: "Pool Party",
    subtitle: "Welcome at the Belmond",
    body: "Resort casual. Swimwear with a coverup, sundresses, linen shirts, sandals. Bring a hat and sunscreen — the high-desert sun is intense.",
    image: "/images/Pool Party Attire.png",
    alt: "Pool party attire inspiration",
    bgClass: "bg-garden-terracotta",
    textClass: "text-garden-cream",
    ringClass: "ring-garden-cream/40",
  },
  {
    day: "Friday Evening",
    title: "White Linens",
    subtitle: "Callejoneada and Tunki Rooftop",
    body: "Relaxed and elevated, all in white. Footwear suitable for walking the parade on cobblestone, and a light jacket or wrap for the rooftop after sunset.",
    image: "/images/White Party Attire.png",
    alt: "White linens attire inspiration",
    bgClass: "bg-garden-moss",
    textClass: "text-garden-cream",
    ringClass: "ring-garden-cream/40",
  },
  {
    day: "Saturday",
    title: "Enchanted Garden",
    subtitle: "Ceremony and Reception",
    body: "Garden neutrals, greens, golds, and khaki. Draping, pleating, and romantic silhouettes at golden hour. We recommend a layer or shawl as it cools down in the evenings, and block heels or flats for the cobblestone paths.",
    image: "/images/Enchanted Garden Attire.png",
    alt: "Enchanted garden attire inspiration",
    bgClass: "bg-garden-olive",
    textClass: "text-garden-cream",
    ringClass: "ring-garden-cream/40",
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
  return (
    <section
      className={`flex h-full items-center overflow-hidden ${look.bgClass} ${look.textClass}`}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-3 py-12 md:grid-cols-[3fr_2fr] md:gap-16 md:px-6">
        <div className={`p-2 ring-1 ${look.ringClass}`}>
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={look.image}
              alt={look.alt}
              fill
              className="object-contain"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority={priority}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="font-edict text-[11px] uppercase tracking-[0.45em] opacity-80">
            {look.day}
          </p>
          <h2 className="mt-6 font-serif text-4xl font-light uppercase tracking-[0.15em] sm:text-5xl">
            {look.title}
          </h2>
          <p className="mt-4 font-serif text-lg italic opacity-90">
            {look.subtitle}
          </p>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed opacity-85">
            {look.body}
          </p>
        </div>
      </div>
    </section>
  );
}
