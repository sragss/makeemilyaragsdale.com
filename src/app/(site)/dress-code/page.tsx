import { PageShell, Section } from "@/components/page-shell";

export const metadata = {
  title: "Dress Code — Emily & Sam",
};

export default function DressCode() {
  return (
    <PageShell
      eyebrow="What to Wear"
      title="Dress Code"
      intro="Three events, three looks. Evenings get cool, so plan a layer for after sunset. Cobblestones are charming and unforgiving, so bring shoes that can handle them."
    >
      <Section label="Friday Afternoon, Pool Party at the Belmond">
        <p className="font-serif text-2xl font-light text-foreground">
          Resort Casual
        </p>
        <p className="text-muted-foreground">
          Swimwear with a coverup, sundresses, linen shirts, sandals. Bring a
          hat and sunscreen. The sun is intense.
        </p>
      </Section>

      <Section label="Friday Evening, Callejoneada and Tunki Rooftop">
        <p className="font-serif text-2xl font-light text-foreground">
          White Linens
        </p>
        <p className="text-muted-foreground">
          Relaxed and elevated. Footwear suitable for walking the parade on
          cobblestone. A light jacket or wrap for the rooftop after sunset.
        </p>
      </Section>

      <Section label="Saturday, Wedding at Luna Escondida">
        <p className="font-serif text-2xl font-light text-foreground">
          Enchanted Garden
        </p>
        <p className="text-muted-foreground">
          Garden neutrals, greens, golds, and khaki. Draping, pleating, and
          romantic silhouettes at golden hour. Dresses, sets, or jumpsuits.
          Suits for the gentlemen.
        </p>
        <p className="text-muted-foreground">
          A wrap or shawl is wise for after sunset. Ceremony and cocktails
          outside, reception indoors. Consider block heels, or bring a pair of
          flats for walking on cobblestone.
        </p>
      </Section>
    </PageShell>
  );
}
