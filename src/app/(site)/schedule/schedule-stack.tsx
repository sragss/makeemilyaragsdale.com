"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Item = {
  time: string;
  title: string;
  detail: ReactNode;
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

const FRIDAY_ITEMS: Item[] = [
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
];

const SATURDAY_ITEMS: Item[] = [
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
];

function WelcomePartyCard() {
  return (
    <div className="stamp-edge flex aspect-[3/2] w-full flex-col justify-between gap-8 bg-[#888834] px-7 py-10 text-garden-cream sm:px-10 sm:py-12 lg:px-12 lg:py-12">
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.35em] text-garden-cream/70">
          Friday, February 26
        </p>
        <h2 className="whitespace-nowrap font-eros font-normal uppercase text-[clamp(3.75rem,8.25vw,6.7rem)] leading-[0.85] tracking-[0.01em]">
          <span className="text-garden-cream">Welcome</span>{" "}
          <span className="text-garden-green">Party</span>
        </h2>
      </div>
      <ColumnTimeline
        items={FRIDAY_ITEMS}
        timeClass="text-garden-cream"
        titleClass="font-edict font-medium text-garden-green"
        detailClass="text-garden-cream"
      />
    </div>
  );
}

function WelcomePartyImage() {
  return (
    <div className="relative aspect-[3/2] w-full bg-[#d2cf53] p-2 sm:p-3">
      <div className="relative h-full overflow-hidden">
        <Image
          src="/images/Welcome%20Party.png"
          alt="Welcome Party at the Belmond"
          fill
          sizes="(min-width: 960px) 960px, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

function CeremonyCard() {
  return (
    <div className="ticket-edge flex aspect-[3/2] w-full flex-col justify-between gap-8 bg-garden-cream px-7 py-10 text-garden-ink sm:px-10 sm:py-12 lg:px-12 lg:py-12">
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.35em] text-garden-moss/60">
          Saturday, February 27
        </p>
        <h2 className="font-eros font-normal uppercase text-[clamp(3.75rem,8.25vw,6.7rem)] leading-[0.85] tracking-[0.01em]">
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
        items={SATURDAY_ITEMS}
        timeClass="text-garden-ink"
        titleClass="font-edict font-medium text-garden-green"
        detailClass="text-garden-ink"
      />
    </div>
  );
}

function ReceptionImage() {
  return (
    <div className="relative aspect-[3/2] w-full bg-garden-green p-2 sm:p-3">
      <div className="relative h-full overflow-hidden">
        <Image
          src="/images/Reception.png"
          alt="Ceremony and reception at Luna Escondida"
          fill
          sizes="(min-width: 960px) 960px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

const CARDS = [WelcomePartyCard, WelcomePartyImage, CeremonyCard, ReceptionImage];

const STACK_OFFSETS = [
  { x: 0, y: 0, rotate: 2.4 },
  { x: 28, y: 32, rotate: -1.8 },
  { x: 56, y: 64, rotate: 2.2 },
  { x: 84, y: 96, rotate: -1.2 },
];

function StackCard({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const offset = STACK_OFFSETS[index] ?? STACK_OFFSETS[STACK_OFFSETS.length - 1];
  const transitions = Math.max(1, total - 1);

  const isBase = index === 0;
  const start = isBase ? 0 : (index - 1) / transitions;
  const end = isBase ? 1 : index / transitions;

  // Dealt cards enter from below, alternating side based on landing tilt:
  // CCW-tilted cards toss in from the right, CW-tilted cards from the left.
  const tiltSign = Math.sign(offset.rotate) || 1;
  const startX = isBase ? offset.x : -tiltSign * 160;
  const startY = isBase ? offset.y : 1100;
  const startRot = isBase ? offset.rotate : offset.rotate + tiltSign * 7;
  const startOp = isBase ? 1 : 0.8;

  const x = useTransform(progress, [start, end], [startX, offset.x]);
  const y = useTransform(progress, [start, end], [startY, offset.y]);
  const rotate = useTransform(progress, [start, end], [startRot, offset.rotate]);
  const opacity = useTransform(progress, [start, end], [startOp, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, y, rotate, opacity, zIndex: index }}
    >
      {children}
    </motion.div>
  );
}

export default function ScheduleStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div data-route="schedule" className="relative -mt-10 w-full bg-[#3f3e19]">
      {/* Mobile: simple vertical list */}
      <div className="flex flex-col gap-8 px-4 py-12 md:hidden">
        {CARDS.map((Card, i) => (
          <Card key={i} />
        ))}
      </div>

      {/* Desktop: scroll-tied stacking */}
      <section
        ref={ref}
        data-snap-stack
        className="relative hidden md:block"
        style={{ height: `${CARDS.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-8">
          <div className="relative w-full max-w-[960px]">
            <div aria-hidden className="aspect-[3/2] w-full" />
            {CARDS.map((Card, i) => (
              <StackCard
                key={i}
                index={i}
                total={CARDS.length}
                progress={scrollYProgress}
              >
                <Card />
              </StackCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
