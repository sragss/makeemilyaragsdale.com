import { PageShell, Section } from "@/components/page-shell";

export const metadata = {
  title: "Explore — Emily & Sam",
};

const ACTIVITIES = [
  {
    name: "Hot air balloon at sunrise",
    note: "One of the most beautiful things we have done. You float over the high desert as light comes up over the colonial rooftops.",
  },
  {
    name: "Horseback riding with Coyote Canyon Adventures",
    note: "We rode with them last time and loved it. They run trips through the canyons outside town.",
  },
  {
    name: "Casa Dragones tequila tasting",
    note: "An intimate tasting in their tasting room downtown. Reservations required and worth booking well in advance.",
  },
  {
    name: "Fábrica La Aurora",
    note: "A former textile factory turned gallery and design complex. Easy to spend half a day wandering through artist studios, antiques, and design shops.",
  },
  {
    name: "Hot springs (La Gruta or Escondido Place)",
    note: "A short drive outside town. La Gruta has a beautiful tunnel-fed thermal pool that feels otherworldly.",
  },
  {
    name: "Mercado de Artesanías and Mercado Ignacio Ramírez",
    note: "Wander for textiles, ceramics, and silver.",
  },
];

const RESTAURANTS = [
  { name: "Quince Rooftop", note: "Iconic view of the Parroquia. Great for sunset." },
  { name: "Luna Rooftop", note: "Atop the Rosewood. Polished and romantic." },
  {
    name: "Bekeb Cocktail Bar",
    note: "Intimate mezcal-forward cocktails by Fabiola Padilla.",
  },
  { name: "La Única", note: "Local favorite. Lively atmosphere." },
  {
    name: "Áperi at Hotel Dôce 18",
    note: "Modern Mexican tasting menu, beautifully executed.",
  },
  {
    name: "Trazo 1810",
    note: "Refined Mexican in a stunning colonial courtyard.",
  },
  { name: "Lavanda", note: "Lovely garden spot for breakfast and lunch." },
  {
    name: "The Restaurant by Donnie Masterton",
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
        <p className="text-muted-foreground">
          We recommend arriving by Thursday to settle in before Friday
          afternoon's pool party. Many of you will want to extend the trip on
          either side. The town rewards slowing down.
        </p>
      </Section>

      <Section label="Activities">
        <ul className="space-y-5">
          {ACTIVITIES.map((a) => (
            <li key={a.name} className="space-y-1">
              <p className="font-serif text-lg font-light">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Where to Eat">
        <p className="text-muted-foreground">
          San Miguel punches well above its weight. A few we love:
        </p>
        <ul className="space-y-5">
          {RESTAURANTS.map((r) => (
            <li key={r.name} className="space-y-1">
              <p className="font-serif text-lg font-light">{r.name}</p>
              <p className="text-sm text-muted-foreground">{r.note}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          More to come in the WhatsApp group closer to the date.
        </p>
      </Section>
    </PageShell>
  );
}
