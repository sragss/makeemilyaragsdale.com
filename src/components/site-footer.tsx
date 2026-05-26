"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { SAndELogo } from "@/components/logos";

type FooterTheme = {
  bg: string;
  fg: string;
  divider?: boolean;
};

const DEFAULT_THEME: FooterTheme = {
  bg: "#f5e9c8",
  fg: "#493932",
};

const THEMES: Record<string, FooterTheme> = {
  "/": { bg: "#888834", fg: "#f2e5bb" },
  "/schedule": { bg: "#888834", fg: "#f2e5bb" },
  "/travel": { bg: "#888834", fg: "#f2e5bb", divider: true },
  "/dress-code": { bg: "#888834", fg: "#f2e5bb" },
  "/explore": { bg: "#888834", fg: "#f2e5bb" },
  "/faq": { bg: "#888834", fg: "#f2e5bb" },
};

function themeForPathname(pathname: string): FooterTheme {
  return THEMES[pathname] ?? DEFAULT_THEME;
}

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const theme = themeForPathname(pathname);

  const themeVars = {
    "--footer-bg": theme.bg,
    "--footer-fg": theme.fg,
  } as CSSProperties;

  return (
    <footer
      style={themeVars}
      className={`bg-[var(--footer-bg)] text-[var(--footer-fg)] transition-colors ${
        theme.divider ? "border-t border-[var(--footer-fg)]" : ""
      }`}
    >
      <div className="relative grid w-full grid-cols-3 items-center gap-4 py-5 pl-3 pr-2 sm:py-6 sm:pl-4 sm:pr-3">
        <p className="font-edict text-xs font-medium tracking-[0.18em] justify-self-start">
          02-27-2027
        </p>
        <div className="justify-self-center">
          <SAndELogo className="h-10 w-auto" />
        </div>
        <Link
          href="/rsvp"
          className="justify-self-end border border-[var(--footer-fg)]/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-[var(--footer-fg)] hover:text-[var(--footer-bg)]"
        >
          RSVP
        </Link>
      </div>
    </footer>
  );
}
