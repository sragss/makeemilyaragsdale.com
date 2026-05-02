import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "FAQ — Emily & Sam",
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "When should I arrive and depart?",
    a: "We recommend arriving by Thursday to settle in before Friday afternoon's pool party. The wedding ends late Saturday night, so most guests stay through Sunday at minimum. Many are extending the trip to explore San Miguel. We highly encourage it.",
  },
  {
    q: "Which airport should I fly into?",
    a: "Bajío International (BJX) is closest at about 1.5 hours by car. Querétaro (QRO) is about an hour but has fewer flights. Mexico City (MEX) has the most flight options but is about 3.5 hours away.",
  },
  {
    q: "Do I need a passport?",
    a: "Yes. US travelers need a valid passport, and Mexico requires it to be valid for at least six months past your travel date. Check your expiration now if you have not recently.",
  },
  {
    q: "Where should I stay?",
    a: (
      <>
        The Belmond is our home base for the weekend, and we would love for as
        many guests as possible to stay with us. With 37 rooms, the block fills
        quickly, so book early. We have also listed a few hotels we love at
        different price points on the{" "}
        <Link href="/travel" className="underline underline-offset-4">
          Travel & Stay
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    q: "How do I get from the airport to San Miguel?",
    a: (
      <>
        We recommend pre-booking ground transportation. TransportArte Mexico
        and Transportes Turísticos Allende are both reliable. Contact details
        are on the{" "}
        <Link href="/travel" className="underline underline-offset-4">
          Travel & Stay
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    q: "Do I need a car in San Miguel?",
    a: "No. The town is walkable, and Ubers are easy to find and inexpensive (around five dollars a ride). We will run shuttles to and from the wedding venue on Saturday.",
  },
  {
    q: "What's the weather like?",
    a: "San Miguel sits at 6,200 feet. Late February days run 72 to 77°F and nights drop to 45 to 50°F. Pack a light jacket or sweater for evenings.",
  },
  {
    q: "Is the wedding indoors or outdoors?",
    a: "The ceremony and cocktail hour will be outside. Reception is indoors. Plan for a wrap or shawl after sunset either way.",
  },
  {
    q: "What should I wear?",
    a: (
      <>
        See the{" "}
        <Link href="/dress-code" className="underline underline-offset-4">
          Dress Code
        </Link>{" "}
        page for each event. Short version: resort casual for the Friday pool
        party, white linens for Friday evening, enchanted garden for the
        Saturday wedding.
      </>
    ),
  },
  {
    q: "Do I need cash?",
    a: "Most places accept cards, but pesos are helpful for activities, guides, and tipping. ATMs are easy to find downtown.",
  },
  {
    q: "Is Spanish required?",
    a: "No. Most people in tourist-facing roles speak English. A few phrases go a long way and are always appreciated.",
  },
  {
    q: "Can I bring a plus-one?",
    a: "Invitations are addressed specifically to those we would love to celebrate with. If a plus-one is not named on your invitation, please assume the invitation is for you alone. If you have questions, just reach out.",
  },
  {
    q: "What if I have dietary restrictions?",
    a: "Note any dietary restrictions or allergies on your RSVP and we will make sure they are accommodated.",
  },
  {
    q: "How will we stay in touch?",
    a: "Closer to the wedding, we will add everyone to a WhatsApp group for real-time updates, recommendations, and day-of questions. We will also have an AI concierge available to answer questions on the fly.",
  },
  {
    q: "Who do I contact with questions?",
    a: (
      <>
        You can reach out to either of us directly, or once the WhatsApp group
        is live, ask there.
        <br />
        Emily: 303.408.4160
        <br />
        Sam: 914.819.2831
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <PageShell
      eyebrow="Everything Else"
      title="FAQ"
      intro="A catch-all for the questions we hear most. If we missed yours, reach out."
    >
      <ul className="space-y-10">
        {FAQS.map((item) => (
          <li key={item.q} className="space-y-3">
            <h2 className="font-serif text-xl font-light tracking-tight">
              {item.q}
            </h2>
            <div className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
