"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-white/5 backdrop-blur-xl backdrop-saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] supports-[backdrop-filter]:bg-white/10">
      <div className="mx-auto flex h-10 w-full max-w-6xl items-stretch gap-6 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Sam & Emily — Home"
          className="flex w-28 shrink-0 items-center"
        >
          <SamAndEmilyLogo className="h-7 w-auto text-[#3f3e19]" />
        </Link>

        <nav className="relative flex-1 overflow-x-auto scrollbar-none">
          <ul className="flex h-full items-stretch whitespace-nowrap">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href} className="relative flex">
                  <Link
                    href={tab.href}
                    className={`group relative flex items-center px-3 font-edict text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "text-white"
                        : "text-white/55 hover:text-white/85"
                    }`}
                  >
                    <span className="relative mix-blend-difference">{tab.label}</span>
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
      </div>
    </header>
  );
}
