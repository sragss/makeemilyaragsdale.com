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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <div className="flex h-9 w-32 shrink-0 items-center" aria-label="Lockup">
          {/* lockup placeholder */}
        </div>

        <nav className="relative flex-1 overflow-x-auto scrollbar-none">
          <ul className="flex items-center gap-1 whitespace-nowrap">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href} className="relative">
                  <Link
                    href={tab.href}
                    className={`relative block rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="site-nav-indicator"
                        className="absolute inset-0 rounded-full bg-secondary"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative">{tab.label}</span>
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
