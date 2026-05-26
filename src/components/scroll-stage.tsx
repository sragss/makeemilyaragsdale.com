"use client";

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useLenis } from "lenis/react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type ScrollStageControls = {
  frames: number;
  scrollToProgress: (progress: number) => void;
};

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function ScrollStage({
  frames,
  children,
  className,
  mobile,
  mobileClassName,
  desktopClassName,
  viewportClassName,
  style,
}: {
  frames: number;
  children: (
    progress: MotionValue<number>,
    controls: ScrollStageControls
  ) => ReactNode;
  className?: string;
  mobile?: ReactNode;
  mobileClassName?: string;
  desktopClassName?: string;
  viewportClassName?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [scrollMetrics, setScrollMetrics] = useState({
    range: 0,
    top: 0,
  });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const hasMobileFallback = mobile !== undefined;

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const updateMetrics = () => {
      setScrollMetrics({
        range: Math.max(0, section.offsetHeight - window.innerHeight),
        top: section.getBoundingClientRect().top + window.scrollY,
      });
    };

    updateMetrics();

    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(section);
    window.addEventListener("resize", updateMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, [frames]);

  const scrollToProgress = useCallback(
    (progress: number) => {
      const clampedProgress = Math.min(1, Math.max(0, progress));
      const targetScroll =
        scrollMetrics.top + scrollMetrics.range * clampedProgress;
      const shouldReduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: shouldReduceMotion ? 0 : 0.82,
          easing: easeOutCubic,
          force: true,
          immediate: shouldReduceMotion,
        });
        return;
      }

      window.scrollTo({
        top: targetScroll,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [lenis, scrollMetrics.range, scrollMetrics.top]
  );
  const controls = useMemo(
    () => ({ frames, scrollToProgress }),
    [frames, scrollToProgress]
  );

  return (
    <div className={className}>
      {hasMobileFallback && (
        <div className={cn("md:hidden", mobileClassName)}>{mobile}</div>
      )}

      <section
        ref={ref}
        className={cn(
          "relative",
          hasMobileFallback && "hidden md:block",
          desktopClassName
        )}
        style={{ height: `${Math.max(1, frames) * 100}vh`, ...style }}
      >
        <div
          className={cn("sticky top-0 h-screen overflow-hidden", viewportClassName)}
        >
          {children(scrollYProgress, controls)}
        </div>
      </section>
    </div>
  );
}

export function ScrollStackPanels({
  children,
  className,
  viewportClassName,
}: {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
}) {
  const panels = Children.toArray(children);

  return (
    <ScrollStage
      frames={panels.length}
      className={className}
      viewportClassName={viewportClassName}
      mobile={
        <div data-mobile-snap>
          {panels.map((panel, index) => (
            <div
              key={index}
              className="h-svh w-full snap-start snap-always overflow-hidden"
            >
              {panel}
            </div>
          ))}
        </div>
      }
    >
      {(progress) => (
        <div className="relative h-full w-full">
          {panels.map((panel, index) => (
            <SlidingPanel
              key={index}
              index={index}
              total={panels.length}
              progress={progress}
            >
              {panel}
            </SlidingPanel>
          ))}
        </div>
      )}
    </ScrollStage>
  );
}

function SlidingPanel({
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
  const transitions = Math.max(1, total - 1);
  const start = index === 0 ? 0 : (index - 1) / transitions;
  const end = index === 0 ? 1 : index / transitions;
  const y = useTransform(progress, [start, end], [
    index === 0 ? "0%" : "100%",
    "0%",
  ]);

  return (
    <motion.section
      className="absolute inset-0"
      style={{ y, zIndex: index, willChange: "transform" }}
    >
      {children}
    </motion.section>
  );
}
