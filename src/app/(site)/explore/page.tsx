import { PageShell, Section } from "@/components/page-shell";

export const metadata = {
  title: "Emily & Sam — Explore",
};

const ACTIVITIES = [
  {
    name: "Hot air balloon at sunrise",
    mapsQuery: "hot air balloon San Miguel de Allende",
    note: "One of the most beautiful things we have done. You float over the high desert as light comes up over the colonial rooftops.",
  },
  {
    name: "Horseback riding with Coyote Canyon Adventures",
    mapsQuery: "Coyote Canyon Adventures San Miguel de Allende",
    note: "We rode with them last time and loved it. They run trips through the canyons outside town.",
  },
  {
    name: "Casa Dragones tequila tasting",
    mapsQuery: "Casa Dragones San Miguel de Allende tasting room",
    note: "An intimate tasting in their tasting room downtown. Reservations required and worth booking well in advance.",
  },
  {
    name: "Fábrica La Aurora",
    mapsQuery: "Fábrica La Aurora San Miguel de Allende",
    note: "A former textile factory turned gallery and design complex. Easy to spend half a day wandering through artist studios, antiques, and design shops.",
  },
  {
    name: "Hot springs (La Gruta or Escondido Place)",
    mapsQuery: "La Gruta Spa San Miguel de Allende",
    note: "A short drive outside town. La Gruta has a beautiful tunnel-fed thermal pool that feels otherworldly.",
  },
  {
    name: "Mercado de Artesanías and Mercado Ignacio Ramírez",
    mapsQuery: "Mercado de Artesanías San Miguel de Allende",
    note: "Wander for textiles, ceramics, and silver.",
  },
];

const RESTAURANTS = [
  {
    name: "Quince Rooftop",
    mapsQuery: "Quince Rooftop San Miguel de Allende",
    note: "Iconic view of the Parroquia. Great for sunset.",
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

export default function Explore() {
  return (
    <PageShell
      eyebrow="San Miguel de Allende"
      title="Explore"
      intro="San Miguel is genuinely magical. The town rewards slowing down. Come early, stay late."
    >
      <Section label="Come Early, Stay Late">
        <p className="font-serif text-2xl font-light leading-snug text-garden-moss">
          Arrive by Thursday if you can. Stay longer if the calendar allows.
        </p>
        <p className="text-muted-foreground">
          We recommend arriving by Thursday to settle in before Friday
          afternoon&apos;s pool party. Many of you will want to extend the trip on
          either side. The town rewards slowing down.
        </p>
      </Section>

      <Section label="Activities">
        <InfoList items={ACTIVITIES} />
      </Section>

      <Section label="Where to Eat">
        <p className="text-muted-foreground">
          San Miguel punches well above its weight. A few we love:
        </p>
        <InfoList items={RESTAURANTS} />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          More to come in the WhatsApp group closer to the date.
        </p>
      </Section>
    </PageShell>
  );
}

function googleMapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

function InfoList({
  items,
}: {
  items: { name: string; mapsQuery: string; note: string }[];
}) {
  return (
    <ul className="divide-y divide-garden-moss/15 border-y border-garden-moss/15">
      {items.map((item) => (
        <li key={item.name} className="py-4">
          <a
            href={googleMapsHref(item.mapsQuery)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.name} on Google Maps`}
            className="group inline-block font-serif text-xl font-light leading-tight text-garden-moss transition-colors hover:text-garden-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-garden-green"
          >
            <span className="relative inline bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
              {item.name}
            </span>
          </a>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {item.note}
          </p>
        </li>
      ))}
    </ul>
  );
}
