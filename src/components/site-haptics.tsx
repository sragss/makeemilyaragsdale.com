"use client";

import { type ReactNode } from "react";
import { useControlHaptics } from "@/lib/use-control-haptics";

export function SiteHaptics({ children }: { children: ReactNode }) {
  const triggerHaptic = useControlHaptics<HTMLDivElement>({
    includeCheckboxLabels: true,
  });

  return (
    <div className="contents" onClickCapture={triggerHaptic}>
      {children}
    </div>
  );
}
