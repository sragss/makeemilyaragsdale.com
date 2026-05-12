import Image from "next/image";

export const metadata = {
  title: "Schedule — Emily & Sam",
};

type Item = {
  time: string;
  title: string;
  detail?: string;
  note?: string;
};

function Timeline({
  items,
  timeClass,
  noteClass,
  detailClass,
  titleClass = "",
  verticalTime = false,
}: {
  items: Item[];
  timeClass: string;
  noteClass: string;
  detailClass: string;
  titleClass?: string;
  verticalTime?: boolean;
}) {
  return (
    <ol className="space-y-5">
      {items.map((item) => (
        <li
          key={item.title}
          className={
            verticalTime
              ? "flex items-stretch gap-5 sm:gap-7"
              : "space-y-1.5"
          }
        >
          {verticalTime ? (
            <p
              className={`shrink-0 [writing-mode:vertical-rl] rotate-180 text-[12px] uppercase tracking-[0.2em] self-stretch ${timeClass}`}
            >
              {item.time}
            </p>
          ) : (
            <p
              className={`inline-block border border-current px-2 py-1 text-[10px] uppercase tracking-[0.3em] ${timeClass}`}
            >
              {item.time}
            </p>
          )}
          <div className={verticalTime ? "flex-1 space-y-2" : "contents"}>
            <p
              className={`font-serif text-2xl font-light leading-tight sm:text-[1.75rem] ${titleClass}`}
            >
              {item.title}
            </p>
            {item.detail && (
              <p className={`max-w-md text-base leading-relaxed ${detailClass}`}>
                {item.detail}
              </p>
            )}
            {item.note && (
              <p className={`font-serif text-base italic leading-relaxed ${noteClass}`}>
                {item.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Schedule() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:gap-10 sm:px-8 sm:py-10 lg:gap-14 lg:px-14 lg:py-12">
      {/* Friday — info left, image right */}
      <section className="relative grid gap-y-6 md:grid-cols-2 md:gap-0">
        <div className="relative z-10 flex flex-col justify-between gap-10 rounded-sm bg-garden-moss px-7 py-10 text-garden-cream shadow-[0_35px_70px_-20px_rgba(28,17,9,0.55)] ring-1 ring-garden-ink/10 md:-rotate-2 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="space-y-8">
            <p className="text-[10px] uppercase tracking-[0.35em] text-garden-terracotta">
              Friday, February 26
            </p>
            <h2 className="font-eros font-normal uppercase text-[clamp(3rem,7vw,6rem)] leading-[0.78] tracking-[-0.02em]">
              <span className="block text-garden-cream">Welcome</span>
              <span className="block text-garden-green">Party</span>
            </h2>
            <Timeline
              items={[
                {
                  time: "2 PM",
                  title: "Pool Party at the Belmond",
                  detail:
                    "Drinks, music and sunshine to kick off the weekend festivities.",
                  note: "Resort wear",
                },
                {
                  time: "5:30 PM",
                  title: "Callejoneada Parade",
                  detail:
                    "A traditional procession through town with Mariachi and Mezcal.",
                  note: "White and linens. Suitable footwear for cobblestone.",
                },
                {
                  time: "6:30 PM",
                  title: "Tunki Rooftop",
                  detail: "Small plates and spirits to close out the night.",
                  note: "White and linens. Suitable footwear for cobblestone.",
                },
              ]}
              timeClass="text-garden-terracotta"
              detailClass="text-garden-green"
              noteClass="text-garden-cream/75"
            />
          </div>
        </div>
        <div className="relative min-h-[55vh] rounded-sm bg-garden-green p-2 shadow-[0_35px_70px_-20px_rgba(28,17,9,0.55)] ring-1 ring-garden-ink/10 sm:p-3 md:min-h-0 md:translate-x-[-1.5rem] md:translate-y-6 md:rotate-3">
          <div className="absolute inset-2 overflow-hidden rounded-[2px] sm:inset-3">
            <Image
              src="/images/WelcomeParty.png"
              alt="Welcome Party at the Belmond"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Saturday — image left, info right */}
      <section className="relative grid gap-y-6 md:grid-cols-2 md:gap-0">
        <div className="relative order-2 min-h-[55vh] rounded-sm bg-garden-green p-2 shadow-[0_35px_70px_-20px_rgba(28,17,9,0.55)] ring-1 ring-garden-ink/10 sm:p-3 md:order-1 md:min-h-0 md:translate-x-6 md:translate-y-6 md:-rotate-3">
          <div className="absolute inset-2 overflow-hidden rounded-[2px] sm:inset-3">
            <Image
              src="/images/Reception.png"
              alt="Ceremony and reception at Luna Escondida"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="relative z-10 order-1 flex flex-col justify-between gap-10 rounded-sm bg-garden-cream px-7 py-10 text-garden-ink shadow-[0_35px_70px_-20px_rgba(28,17,9,0.55)] ring-1 ring-garden-ink/10 sm:px-10 sm:py-12 md:order-2 md:rotate-2 lg:px-12 lg:py-14">
          <div className="space-y-8">
            <p className="text-[10px] uppercase tracking-[0.35em] text-garden-moss/60">
              Saturday, February 27
            </p>
            <h2 className="font-eros font-normal uppercase text-[clamp(3rem,7vw,6rem)] leading-[0.78] tracking-[-0.02em]">
              <span className="block whitespace-nowrap text-garden-green">
                Ceremony<span className="font-serif italic font-normal text-[0.4em] align-middle -ml-[0.15em]">&</span>
              </span>
              <span className="block text-garden-moss">Reception</span>
            </h2>
            <Timeline
              items={[
                {
                  time: "4:30 PM",
                  title: "Ceremony",
                  detail:
                    "Vows beneath a tunnel of vines and before everyone we love, in the Hummingbird Garden at Luna Escondida. Made official by Hopper.",
                },
                {
                  time: "5:45 PM",
                  title: "Cocktail Hour",
                  detail:
                    "Libations and golden hour in the Botanical Greenhouse.",
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
                  detail:
                    "Smoke, lasers, and a special set from LiloPierce.",
                },
              ]}
              timeClass="text-garden-green"
              detailClass="text-garden-ink/75"
              noteClass="text-garden-ink/60"
            />
          </div>
          <p className="font-serif text-lg italic leading-relaxed text-garden-ink/70">
            * Shuttles run Luna Escondida → San Miguel de Allende, 11 PM–2 AM.
          </p>
        </div>
      </section>
    </div>
  );
}
