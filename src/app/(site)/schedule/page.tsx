import Link from "next/link";
import { PageShell, Section } from "@/components/page-shell";

export const metadata = {
  title: "Schedule — Emily & Sam",
};

type Item = {
  time: string;
  title: string;
  detail?: string;
};

function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="space-y-6">
      {items.map((item) => (
        <li key={item.title} className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item.time}
          </p>
          <p className="font-serif text-xl font-light">{item.title}</p>
          {item.detail && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function Schedule() {
  return (
    <PageShell
      eyebrow="February 26 & 27, 2027"
      title="Schedule"
      intro="Two days, two distinct moods. Friday eases everyone in. Saturday is the wedding."
    >
      <Section label="Friday, February 26">
        <Timeline
          items={[
            {
              time: "Afternoon",
              title: "Pool Party at the Belmond",
              detail:
                "Drinks, music, and a slow start at our home base for the weekend.",
            },
            {
              time: "Late Afternoon",
              title: "Break to Change",
              detail: "Head back to your room and put on white linens.",
            },
            {
              time: "Sunset",
              title: "Callejoneada Parade",
              detail:
                "A traditional procession through town with a brass band and mezcal. Wear shoes you can walk cobblestone in.",
            },
            {
              time: "Evening",
              title: "Tunki Rooftop",
              detail: "Small plates and spirits to close out the night.",
            },
          ]}
        />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Dress: Resort casual, then white linens after sunset.{" "}
          <Link href="/dress-code" className="underline underline-offset-4">
            Full dress code
          </Link>
        </p>
      </Section>

      <Section label="Saturday, February 27">
        <Timeline
          items={[
            {
              time: "Late Afternoon",
              title: "Wedding at Luna Escondida",
              detail:
                "Ceremony and cocktail hour outdoors. Reception indoors. Specific timing to come.",
            },
            {
              time: "11 PM to 2 AM",
              title: "Shuttles Back to Town",
              detail:
                "Return shuttles run from the venue to a central pickup point in San Miguel.",
            },
          ]}
        />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Dress: Enchanted Garden.{" "}
          <Link href="/dress-code" className="underline underline-offset-4">
            Full dress code
          </Link>
        </p>
      </Section>
    </PageShell>
  );
}
