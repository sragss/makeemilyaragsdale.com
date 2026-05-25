"use client";

import Image from "next/image";
import { ScrollStackPanels } from "@/components/scroll-stage";

type Activity = {
  name: string;
  image: string;
  alt: string;
  note: string;
  mapsQuery?: string;
  href?: string;
};

const ACTIVITIES: Activity[] = [
  {
    name: "Horseback Riding",
    image: "/images/Horseback Riding.png",
    alt: "Horseback riders splashing through a river outside San Miguel",
    note: "Coyote Canyon Adventures run exceptional excursions in the canyons outside of town.",
    href: "https://www.coyotecanyonadventures.com/index.php?vw=1698&vh=952&v0=&v1=32&v1b=0&v2=eng&v3=0&v25=155",
  },
  {
    name: "Hot Air Balloon",
    image: "/images/hot-air-balloon-4k.png",
    alt: "Hot air balloons drifting over the high desert at sunrise",
    note: "Sunrise trips floating above the high desert as light comes up over the colonial rooftops.",
    href: "https://globosanmiguel.com/portfolio/classic-sunrise-flight/",
  },
  {
    name: "Casa Dragones Tasting",
    image: "/images/casa-dragones-4k.png",
    alt: "Casa Dragones tasting room interior with backlit tequila bottles",
    note: "An intimate tasting in their tasting room downtown. Reservations required and worth booking well in advance.",
    href: "https://casadragones.com/us/visit-us/casa-dragones-tasting-room",
  },
  {
    name: "Mayan Baths",
    image: "/images/Mayan Baths Upscale.png",
    alt: "Vaulted stone passage leading into the Mayan Baths thermal pools",
    note: "A series of thermal pools and steam rituals inspired by Mayan tradition.",
    href: "https://www.mayanbaths.com/",
  },
  {
    name: "Fabrica La Aurora",
    image: "/images/Fabrica La Aurora.png",
    alt: "Art and antiques inside Fábrica La Aurora",
    note: "A former textile factory turned gallery and design complex. Easy to spend half a day wandering through artist studios, antiques, and design shops.",
    href: "https://fabricalaaurora.com/",
  },
  {
    name: "Mercado de Artesanias",
    image: "/images/Mercado de Artesanias.png",
    alt: "Stalls of flowers and crafts at the Mercado de Artesanías",
    note: "A vibrant and sprawling artisan market with textiles, ceramics, silver, and flowers.",
    mapsQuery: "Mercado de Artesanías San Miguel de Allende",
  },
];

const RESTAURANTS = [
  {
    name: "Quince",
    mapsQuery: "Quince Rooftop San Miguel de Allende",
    note: "Lively rooftop with a DJ, slackline performances, and view of the Parroquia.",
  },
  {
    name: "Luna Rooftop",
    mapsQuery: "Luna Rooftop Rosewood San Miguel de Allende",
    note: "Atop the Rosewood. Polished and romantic.",
  },
  {
    name: "Bekeb Cocktail Bar",
    mapsQuery: "Bekeb Cocktail Bar San Miguel de Allende",
    note: "Intimate mezcal-forward cocktails by Fabiola Padilla.",
  },
  {
    name: "La Única",
    mapsQuery: "La Única San Miguel de Allende",
    note: "Local favorite. Lively atmosphere.",
  },
  {
    name: "Áperi at Hotel Dôce 18",
    mapsQuery: "Áperi Hotel Dôce 18 San Miguel de Allende",
    note: "Modern Mexican tasting menu, beautifully executed.",
  },
  {
    name: "Trazo 1810",
    mapsQuery: "Trazo 1810 San Miguel de Allende",
    note: "Refined Mexican in a stunning colonial courtyard.",
  },
  {
    name: "Lavanda",
    mapsQuery: "Lavanda Café de Especialidad San Miguel de Allende",
    note: "Lovely garden spot for breakfast and lunch.",
  },
  {
    name: "The Restaurant by Donnie Masterton",
    mapsQuery: "The Restaurant Donnie Masterton San Miguel de Allende",
    note: "Long-standing favorite with garden seating.",
  },
];

export function ExploreScroll() {
  return (
    <ScrollStackPanels className="relative -mt-12 w-full md:-mt-10">
      <HeroPanel />
      <IntroPanel />
      {ACTIVITIES.map((activity, i) => (
        <ActivityPanel key={activity.name} activity={activity} priority={i === 0} />
      ))}
      <RestaurantsPanel />
    </ScrollStackPanels>
  );
}

function HeroPanel() {
  return (
    <section className="relative h-full w-full overflow-hidden">
      <Image
        src="/images/Explore.png"
        alt="Cobblestone street in San Miguel de Allende leading to the Parroquia"
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-[0.85]"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1 className="font-eros text-[clamp(4.5rem,16vw,13rem)] font-normal uppercase leading-[0.85] tracking-[-0.01em] text-[#f5e9c8] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
          Explore
        </h1>
      </div>
    </section>
  );
}

function IntroPanel() {
  return (
    <section className="flex h-full items-center justify-center overflow-hidden bg-[#3f3e19] px-6 text-[#f5e9c8]">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h2 className="font-edict text-3xl uppercase leading-none tracking-[0.02em] sm:text-5xl">
          Come Early
          <br />
          <span className="text-[#888834]">Stay Late</span>
        </h2>
        <p className="text-balance font-edict text-base leading-relaxed text-[#f5e9c8]/85 sm:text-lg">
          If your schedule allows, stay a little while. San Miguel de Allende is
          a colonial town in the high desert of central Mexico, known for its
          cobblestone streets, golden light, and centuries-old cathedral. It has
          long drawn artists and travelers, and the food is exceptional. Below
          are our favorite nearby adventures and restaurants we love in town.
        </p>
      </div>
    </section>
  );
}

function ActivityPanel({
  activity,
  priority,
}: {
  activity: Activity;
  priority?: boolean;
}) {
  const href =
    activity.href ??
    (activity.mapsQuery ? googleMapsHref(activity.mapsQuery) : undefined);

  return (
    <section className="flex h-full items-center overflow-hidden bg-[#f5e9c8] text-[#493932]">
      <div className="mx-auto grid h-full w-full items-center gap-8 md:grid-cols-[3fr_2fr] md:gap-16">
        <div className="relative h-[55vh] w-full overflow-hidden md:h-full">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${activity.name} — opens in a new tab`}
              className="group relative block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-garden-green"
            >
              <Image
                src={activity.image}
                alt={activity.alt}
                fill
                priority={priority}
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </a>
          ) : (
            <Image
              src={activity.image}
              alt={activity.alt}
              fill
              priority={priority}
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="px-6 pb-12 text-center md:px-12 md:pb-0">
          <h2 className="font-edict text-3xl uppercase tracking-[0.18em] text-garden-moss sm:text-4xl">
            {activity.name}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-balance font-edict text-base leading-relaxed text-[#493932]/85 sm:text-lg">
            {activity.note}
          </p>
        </div>
      </div>
    </section>
  );
}

function RestaurantsPanel() {
  return (
    <section className="flex h-full items-center overflow-hidden bg-[#3f3e19] px-3 text-[#f5e9c8] sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 text-center sm:mb-14">
          <h2 className="font-edict text-3xl uppercase tracking-[0.18em] text-[#888834] sm:text-4xl">
            Restaurants
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {RESTAURANTS.map((item) => (
            <li
              key={item.name}
              className="border-b border-[#f5e9c8]/15 py-4"
            >
              <a
                href={googleMapsHref(item.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.name} on Google Maps`}
                className="group inline-block font-serif text-xl font-light leading-tight text-[#888834] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#888834]"
              >
                <span className="relative inline bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                  {item.name}
                </span>
              </a>
              <p className="mt-1 text-pretty text-sm leading-relaxed text-[#f5e9c8]/75">
                {item.note}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center font-edict text-base italic text-[#888834] sm:text-lg">
          More to come in the WhatsApp group closer to the date.
        </p>
      </div>
    </section>
  );
}

function googleMapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}
