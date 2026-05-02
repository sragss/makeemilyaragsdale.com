import { PageShell, Section } from "@/components/page-shell";

export const metadata = {
  title: "Travel & Stay — Emily & Sam",
};

const AIRPORTS = [
  {
    code: "BJX",
    name: "Bajío International",
    distance: "~1.5 hours by car",
    note: "Often the easiest option.",
  },
  {
    code: "QRO",
    name: "Querétaro",
    distance: "~1 hour by car",
    note: "Closest, fewer flights.",
  },
  {
    code: "MEX",
    name: "Mexico City",
    distance: "~3.5 hours by car",
    note: "The most flight options.",
  },
];

const HOTELS = [
  {
    name: "Numu Boutique Hotel",
    note: "One block from the Jardín. Tasteful design, intimate scale, an excellent restaurant and bar. The closest in feel to the Belmond.",
  },
  {
    name: "Hacienda El Santuario",
    note: "A characterful boutique in Centro with whitewashed walls, four-poster beds, and a rooftop garden looking onto the Parroquia. Traditional San Miguel charm.",
  },
  {
    name: "Casa Carmen",
    note: "A warm, longtime B&B with a courtyard and included breakfast. Walking distance to the Jardín. A more affordable option with real local character.",
  },
  {
    name: "Live Aqua San Miguel de Allende",
    note: "A larger urban resort with a spa, pool, and full amenities. A good fit for guests who want a more resort-style stay.",
  },
];

export default function Travel() {
  return (
    <PageShell
      eyebrow="Getting There & Around"
      title="Travel & Stay"
      intro="Three airports work, depending on where you fly from. The town itself is walkable and small. Below is everything you need to plan."
    >
      <Section label="Airports">
        <ul className="space-y-5">
          {AIRPORTS.map((a) => (
            <li key={a.code} className="space-y-1">
              <p className="font-serif text-lg font-light">
                {a.name}{" "}
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {a.code}
                </span>
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {a.distance}
              </p>
              <p className="text-sm text-muted-foreground">{a.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Ground Transportation">
        <p className="text-muted-foreground">
          We recommend pre-booking a car from the airport. Two services we
          trust:
        </p>
        <div className="space-y-3 text-muted-foreground">
          <div>
            <p className="font-serif text-base font-light text-foreground">
              TransportArte Mexico
            </p>
            <p>+52 415 105 5196</p>
          </div>
          <div>
            <p className="font-serif text-base font-light text-foreground">
              Transportes Turísticos Allende
            </p>
            <a
              className="underline underline-offset-4"
              href="https://transportesturisticosallende.com/contacto.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              transportesturisticosallende.com
            </a>
          </div>
        </div>
      </Section>

      <Section label="Getting Around San Miguel">
        <p className="text-muted-foreground">
          San Miguel is small and walkable. You can cross the old town in about
          twenty minutes on foot. Ubers are easy to find and run around five
          dollars a ride.
        </p>
        <p className="text-muted-foreground">
          A note on the streets: this is a 16th-century Spanish colonial town,
          and the cobblestones are real. Bring walking shoes for the day, and
          pack flats or block heels for evenings. The town sits at 6,200 feet,
          so drink water and take it slow your first day.
        </p>
      </Section>

      <Section label="Wedding Day Transportation">
        <p className="text-muted-foreground">
          The venue is fifteen minutes from the Belmond and downtown San Miguel.
          We will run a shuttle between a central pickup point in town and the
          venue. Return shuttles will run from 11pm to 2am. Specific timing and
          pickup details to come closer to the date.
        </p>
      </Section>

      <Section label="The Belmond, Casa de Sierra Nevada">
        <p className="text-muted-foreground">
          We have reserved the Belmond as our home base for the weekend, and we
          would love for as many of you as possible to stay with us. Friday's
          pool party and the Callejoneada both begin here, so staying at the
          Belmond means you are in the middle of everything. With 37 rooms, the
          block will fill up. Please book early to secure a spot.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Booking link, room block code, and deadline to come.
        </p>
      </Section>

      <Section label="Other Hotels We Recommend">
        <p className="text-muted-foreground">
          For guests who are not able to stay at the Belmond, here are a few
          hotels we love nearby. All are walkable to the center of town.
        </p>
        <ul className="space-y-5">
          {HOTELS.map((h) => (
            <li key={h.name} className="space-y-1">
              <p className="font-serif text-lg font-light">{h.name}</p>
              <p className="text-sm text-muted-foreground">{h.note}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          San Miguel fills up quickly in February. Book early and confirm rates
          directly with the hotel.
        </p>
      </Section>
    </PageShell>
  );
}
