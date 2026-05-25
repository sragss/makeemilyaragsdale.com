"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  ScrollStage,
  type ScrollStageControls,
} from "@/components/scroll-stage";

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
        <p className="font-edict italic text-base text-garden-cream/80 sm:text-lg">
          Hosted by the Ragsdale Family
        </p>
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
        <p className="font-edict italic text-base text-garden-ink/70 sm:text-lg">
          Hosted by the Devery Family
        </p>
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
    <div className="relative aspect-[3/2] w-full bg-[#888834] p-2 sm:p-3">
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

const SCHEDULE_SCROLL_FRAMES = CARDS.length / 2 + 1;

function getActiveCardIndex(progress: number) {
  return Math.min(
    CARDS.length - 1,
    Math.max(0, Math.floor(progress * CARDS.length))
  );
}

function getNextScheduleProgress(progress: number) {
  const nextSegment = Math.floor(progress * CARDS.length + 0.015) + 1;
  return Math.min(1, nextSegment / CARDS.length);
}

function smoothStep(progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * clamped * (3 - 2 * clamped);
}

function scrollHint(progress: number) {
  return Math.sin(smoothStep(progress) * Math.PI);
}

function StackCard({
  index,
  activeIndex,
  progress,
  children,
}: {
  index: number;
  activeIndex: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const offset = STACK_OFFSETS[index] ?? STACK_OFFSETS[STACK_OFFSETS.length - 1];
  const tiltSign = Math.sign(offset.rotate) || 1;
  const visible = index <= activeIndex;
  const nudgeY = useTransform(progress, (latest) => {
    const stepProgress = latest * CARDS.length;
    const currentIndex = getActiveCardIndex(latest);
    const localProgress = stepProgress - Math.floor(stepProgress);

    if (index !== currentIndex || currentIndex >= CARDS.length - 1) return 0;
    return -6 * scrollHint(localProgress);
  });
  const nudgeRotate = useTransform(progress, (latest) => {
    const stepProgress = latest * CARDS.length;
    const currentIndex = getActiveCardIndex(latest);
    const localProgress = stepProgress - Math.floor(stepProgress);

    if (index !== currentIndex || currentIndex >= CARDS.length - 1) return 0;
    return -0.38 * tiltSign * scrollHint(localProgress);
  });
  const smoothNudgeY = useSpring(nudgeY, {
    stiffness: 120,
    damping: 26,
    mass: 0.45,
  });
  const smoothNudgeRotate = useSpring(nudgeRotate, {
    stiffness: 120,
    damping: 26,
    mass: 0.45,
  });

  return (
    <motion.div
      className="absolute inset-0 drop-shadow-[0_18px_28px_rgba(0,0,0,0.24)]"
      initial={false}
      animate={
        visible
          ? {
              x: offset.x,
              y: offset.y,
              rotate: offset.rotate,
              opacity: 1,
              scale: 1,
            }
          : {
              x: -tiltSign * 220,
              y: 980,
              rotate: offset.rotate + tiltSign * 8,
              opacity: 1,
              scale: 0.98,
            }
      }
      transition={{
        type: "spring",
        stiffness: 118,
        damping: 27,
        mass: 0.9,
      }}
      style={{ zIndex: index, willChange: "transform, opacity" }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          y: smoothNudgeY,
          rotate: smoothNudgeRotate,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ScheduleDeck({ progress }: { progress: MotionValue<number> }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(getActiveCardIndex(progress.get()));
  }, [progress]);

  useMotionValueEvent(progress, "change", (latest) => {
    const next = getActiveCardIndex(latest);
    setActiveIndex((current) => (current === next ? current : next));
  });

  return (
    <div data-route="schedule" className="relative w-full max-w-[960px]">
      <div aria-hidden className="aspect-[3/2] w-full" />
      {CARDS.map((Card, i) => (
        <StackCard
          key={i}
          index={i}
          activeIndex={activeIndex}
          progress={progress}
        >
          <Card />
        </StackCard>
      ))}
    </div>
  );
}

function ScheduleScrollCue({
  progress,
  controls,
}: {
  progress: MotionValue<number>;
  controls: ScrollStageControls;
}) {
  const [canAdvance, setCanAdvance] = useState(() => progress.get() < 0.985);

  useMotionValueEvent(progress, "change", (latest) => {
    const nextCanAdvance = latest < 0.985;
    setCanAdvance((current) =>
      current === nextCanAdvance ? current : nextCanAdvance
    );
  });

  return (
    <motion.button
      type="button"
      aria-label="Scroll to the next schedule card"
      className={`absolute bottom-6 left-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#f5e9c8]/35 bg-[#f5e9c8]/10 text-[#f5e9c8] shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors hover:bg-[#f5e9c8]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5e9c8] ${
        canAdvance ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ x: "-50%" }}
      initial={false}
      animate={
        canAdvance
          ? { opacity: [0.45, 0.92, 0.45], y: [0, 6, 0] }
          : { opacity: 0, y: 10 }
      }
      transition={
        canAdvance
          ? { duration: 1.65, ease: "easeInOut", repeat: Infinity }
          : { duration: 0.2 }
      }
      whileHover={canAdvance ? { opacity: 1, y: 2 } : undefined}
      whileTap={canAdvance ? { scale: 0.96 } : undefined}
      onClick={() =>
        controls.scrollToProgress(getNextScheduleProgress(progress.get()))
      }
    >
      <ChevronDown aria-hidden className="h-5 w-5" strokeWidth={1.8} />
    </motion.button>
  );
}

export default function ScheduleStack() {
  return (
    <ScrollStage
      frames={SCHEDULE_SCROLL_FRAMES}
      className="relative -mt-12 w-full bg-[#3f3e19] md:-mt-10"
      mobile={
        <div className="flex flex-col gap-8 px-2 py-12">
          {CARDS.map((Card, i) => (
            <Card key={i} />
          ))}
        </div>
      }
      viewportClassName="flex items-center justify-center px-2 sm:px-4"
    >
      {(scrollYProgress, controls) => (
        <>
          <ScheduleDeck progress={scrollYProgress} />
          <ScheduleScrollCue
            progress={scrollYProgress}
            controls={controls}
          />
        </>
      )}
    </ScrollStage>
  );
}
