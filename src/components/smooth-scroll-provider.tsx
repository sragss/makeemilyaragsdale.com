"use client";

import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import "lenis/dist/lenis.css";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function ScrollRestoration() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (window.location.hash) return;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [lenis, pathname]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const options = useMemo<LenisOptions>(
    () => ({
      anchors: { offset: 48 },
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: !prefersReducedMotion,
      stopInertiaOnNavigate: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
    }),
    [prefersReducedMotion]
  );

  return (
    <ReactLenis root options={options}>
      <ScrollRestoration />
      {children}
    </ReactLenis>
  );
}
