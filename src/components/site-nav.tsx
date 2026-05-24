"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SamAndEmilyLogo } from "@/components/logos";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/travel", label: "Travel & Stay" },
  { href: "/explore", label: "Explore" },
  { href: "/dress-code", label: "Dress Code" },
  { href: "/faq", label: "FAQ" },
  { href: "/rsvp", label: "RSVP" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-garden-moss/20 bg-garden-cream/85 shadow-[0_1px_18px_rgba(28,17,9,0.08),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-garden-cream/70"
    >
      <div className="mx-auto flex h-12 w-full max-w-6xl items-stretch gap-6 px-4 sm:px-6 md:h-10">
        <Link
          href="/"
          aria-label="Sam & Emily — Home"
          className="flex w-28 shrink-0 items-center"
        >
          <SamAndEmilyLogo className="h-8 w-auto text-[#3f3e19] md:h-7" />
        </Link>

        <nav className="relative hidden flex-1 overflow-x-auto scrollbar-none md:block">
          <ul className="flex h-full items-stretch whitespace-nowrap">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href} className="relative flex">
                  <Link
                    href={tab.href}
                    className={`group relative flex items-center px-3 font-edict text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "text-garden-ink"
                        : "text-garden-moss/75 hover:text-garden-ink"
                    }`}
                  >
                    <span className="relative">{tab.label}</span>
                    {active && (
                      <motion.span
                        layoutId="site-nav-indicator"
                        className="absolute inset-x-2 bottom-0 h-px bg-garden-green shadow-[0_0_10px_rgba(170,181,55,0.85)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-site-nav"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="ml-auto inline-flex h-12 w-12 items-center justify-center text-garden-moss transition-colors hover:text-garden-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-garden-green md:hidden"
        >
          {mobileMenuOpen ? (
            <X aria-hidden className="h-5 w-5" strokeWidth={1.7} />
          ) : (
            <Menu aria-hidden className="h-5 w-5" strokeWidth={1.7} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-site-nav"
            className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-3rem)] overflow-y-auto border-t border-garden-moss/10 bg-garden-cream/96 shadow-[0_30px_80px_rgba(28,17,9,0.18)] md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-6xl flex-col justify-center px-5 py-9"
            >
              <ul className="border-y border-garden-moss/18">
                {TABS.map((tab) => {
                  const active = isActive(pathname, tab.href);

                  return (
                    <li
                      key={tab.href}
                      className="border-b border-garden-moss/12 last:border-b-0"
                    >
                      <Link
                        href={tab.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group relative flex min-h-14 items-center justify-between py-4 font-edict text-[13px] font-medium uppercase tracking-[0.24em] transition-colors ${
                          active
                            ? "text-garden-ink"
                            : "text-garden-moss/78 hover:text-garden-ink"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="relative h-px w-10 overflow-hidden bg-garden-moss/18">
                          <motion.span
                            className="absolute inset-y-0 left-0 bg-garden-green"
                            initial={false}
                            animate={{ width: active ? "100%" : "0%" }}
                            transition={{
                              duration: 0.28,
                              ease: "easeOut",
                            }}
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
