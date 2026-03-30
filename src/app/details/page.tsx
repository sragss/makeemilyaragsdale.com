import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Details — Make Emily a Ragsdale",
  openGraph: {
    title: "The Details — Emily & Sam",
    description: "Schedule, venue, dress code, and travel info for February 27, 2027",
    images: [{ url: "/images/og-details.jpg", width: 1536, height: 1024 }],
  },
};

export default function Details() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16 sm:py-24">
      <div className="max-w-xl w-full space-y-16">
        <header className="text-center space-y-3">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Emily & Sam
          </Link>
          <h1 className="font-serif text-4xl font-light tracking-tight">
            The Details
          </h1>
        </header>

        <section className="space-y-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Schedule
          </h2>
          <Separator />

          <div className="space-y-10">
            <div className="space-y-2">
              <p className="font-serif text-xl font-light">
                Friday, February 26
              </p>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                3:00 &ndash; 8:00 PM
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pool party at the Belmond. Tunes, food, and drinks. Come hang.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-serif text-xl font-light">
                Saturday, February 27
              </p>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Ceremony & Reception
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Luna Escondida. Transportation provided from the Belmond.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            San Miguel de Allende
          </h2>
          <Separator />
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              A colonial Spanish town about 150 miles northwest of Mexico City
              &mdash; sometimes called the Hamptons of CDMX. Cobblestone
              streets, incredible food, and warm weather in February.
            </p>
            <p>
              Fly into Mexico City (MEX) or Quer&eacute;taro (QRO), then
              it&apos;s a scenic drive. We&apos;ll share more travel logistics
              closer to the date.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Dress Code
          </h2>
          <Separator />
          <p className="font-serif text-xl font-light">
            James Bond Chic
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Formal but fun. Look handsome.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Accommodation
          </h2>
          <Separator />
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              The wedding party is staying at the{" "}
              <a
                href="https://www.belmond.com/hotels/north-america/mexico/belmond-casa-de-sierra-nevada"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-foreground transition-colors text-foreground"
              >
                Belmond Casa de Sierra Nevada
              </a>
              . Some guests will receive an invitation to book a room there for
              3 nights (Thu Feb 25 &ndash; Sat Feb 27) &mdash; check your RSVP
              for details.
            </p>
            <p>
              San Miguel has wonderful hotels and Airbnbs at every price point.
              We&apos;ll be happy to help with recommendations.
            </p>
          </div>
        </section>

        <div className="text-center pt-4">
          <Link
            href="/rsvp"
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            RSVP
          </Link>
        </div>
      </div>
    </main>
  );
}
