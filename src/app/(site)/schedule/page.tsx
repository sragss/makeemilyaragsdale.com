import Image from "next/image";

export const metadata = {
  title: "Schedule — Emily & Sam",
};

type Item = {
  time: string;
  title: string;
  detail: React.ReactNode;
};

function ColumnTimeline({
  items,
  timeClass,
  titleClass,
  detailClass,
}: {
  items: Item[];
  timeClass: string;
  titleClass: string;
  detailClass: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
      {items.map((item) => (
        <div key={item.title} className="space-y-2">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${timeClass}`}>
            {item.time}
          </p>
          <p
            className={`text-xl uppercase leading-none tracking-[0.04em] sm:text-2xl ${titleClass}`}
          >
            {item.title}
          </p>
          <p className={`font-edict text-xs leading-snug sm:text-sm ${detailClass}`}>
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Schedule() {
  return (
    <div data-route="schedule" className="flex min-h-screen flex-col gap-10 bg-[#3f3e19] px-4 py-6 sm:gap-16 sm:px-8 sm:py-10 lg:gap-20 lg:px-14 lg:py-12">
      {/* Friday — postage stamp card left, painting right */}
      <section className="relative grid gap-y-6 md:grid-cols-2 md:gap-0">
        <div className="stamp-edge relative z-10 flex flex-col justify-between gap-8 bg-[#888834] px-7 py-10 text-garden-cream sm:px-10 sm:py-12 md:aspect-[3/2] md:-rotate-2 lg:px-12 lg:py-12">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-garden-cream/70">
              Friday, February 26
            </p>
            <h2 className="whitespace-nowrap font-eros font-normal uppercase text-[clamp(4.4rem,9.7vw,7.9rem)] leading-[0.85] tracking-[0.01em]">
              <span className="text-garden-cream">Welcome</span>{" "}
              <span className="text-garden-green">Party</span>
            </h2>
          </div>
          <ColumnTimeline
            items={[
              {
                time: "2 PM",
                title: "Pool",
                detail: (
                  <>
                    Drinks, music and sunshine
                    <br />
                    to kick off the weekend.
                  </>
                ),
              },
              {
                time: "5:30 PM",
                title: "Callejoneada",
                detail: (
                  <>
                    A traditional Mexican parade
                    <br />
                    with Mariachi and Mezcal.
                  </>
                ),
              },
              {
                time: "6:30 PM",
                title: "Rooftop",
                detail: (
                  <>
                    Sunset, small plates and
                    <br />
                    spirits to close out the night.
                  </>
                ),
              },
            ]}
            timeClass="text-garden-cream"
            titleClass="font-edict font-medium text-garden-green"
            detailClass="text-garden-cream"
          />
        </div>
        <div className="relative bg-[#d2cf53] p-2 shadow-[0_25px_50px_-20px_rgba(28,17,9,0.45)] ring-1 ring-garden-ink/10 sm:p-3 md:aspect-[3/2] md:translate-x-[-1.5rem] md:translate-y-6 md:rotate-3">
          <div className="relative aspect-[3/2] overflow-hidden md:aspect-auto md:h-full">
            <Image
              src="/images/Welcome%20Party.png"
              alt="Welcome Party at the Belmond"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Saturday — painting left, ticket card right */}
      <section className="relative grid gap-y-6 md:grid-cols-2 md:gap-0">
        <div className="relative order-2 bg-garden-green p-2 shadow-[0_25px_50px_-20px_rgba(28,17,9,0.45)] ring-1 ring-garden-ink/10 sm:p-3 md:order-1 md:aspect-[3/2] md:translate-x-6 md:translate-y-6 md:-rotate-3">
          <div className="relative aspect-[3/2] overflow-hidden md:aspect-auto md:h-full">
            <Image
              src="/images/Reception.png"
              alt="Ceremony and reception at Luna Escondida"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="ticket-edge relative z-10 order-1 flex flex-col justify-between gap-8 bg-garden-cream px-7 py-10 text-garden-ink sm:px-10 sm:py-12 md:order-2 md:aspect-[3/2] md:rotate-2 lg:px-12 lg:py-12">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-garden-moss/60">
              Saturday, February 27
            </p>
            <h2 className="font-eros font-normal uppercase text-[clamp(4.4rem,9.7vw,7.9rem)] leading-[0.85] tracking-[0.01em]">
              <span className="block whitespace-nowrap text-garden-green">
                Ceremony
                <span className="font-serif italic font-normal text-[0.4em] align-middle -ml-[0.15em]">
                  &
                </span>
              </span>
              <span className="block text-garden-moss">Reception</span>
            </h2>
          </div>
          <ColumnTimeline
            items={[
              {
                time: "4:30 PM",
                title: "Ceremony",
                detail: (
                  <>
                    Vows in the Hummingbird Garden at
                    <br />
                    Luna Escondida.{" "}
                    <em className="italic">Made official by Hopper.</em>
                  </>
                ),
              },
              {
                time: "7 PM",
                title: "Reception",
                detail:
                  "Dinner and dancing at Salón Luna, with toasts, first dances, and the evening unfolding in earnest.",
              },
              {
                time: "11 PM",
                title: "After Hours",
                detail: (
                  <>
                    Smoke, lasers, and a special set
                    <br />
                    <em className="italic">from LiloPierce.</em>
                  </>
                ),
              },
            ]}
            timeClass="text-garden-ink"
            titleClass="font-edict font-medium text-garden-green"
            detailClass="text-garden-ink"
          />
        </div>
      </section>
    </div>
  );
}
