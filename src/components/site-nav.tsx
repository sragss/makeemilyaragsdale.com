"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-10 w-full max-w-6xl items-stretch gap-6 px-4 sm:px-6">
        <div className="flex w-28 shrink-0 items-center" aria-label="Lockup">
          {/* lockup placeholder */}
        </div>

        <nav className="relative flex-1 overflow-x-auto scrollbar-none">
          <ul className="flex h-full items-stretch whitespace-nowrap">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href} className="relative flex">
                  <Link
                    href={tab.href}
                    className={`relative flex items-center px-3 font-serif text-[11px] uppercase tracking-[0.24em] transition-colors ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="relative">{tab.label}</span>
                    {active && (
                      <motion.span
                        layoutId="site-nav-indicator"
                        className="absolute inset-x-2 bottom-0 h-px bg-garden-green"
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
      </div>
    </header>
  );
}
