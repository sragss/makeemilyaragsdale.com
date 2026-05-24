"use client";

import { useCallback, type MouseEvent } from "react";
import { useWebHaptics } from "web-haptics/react";

type ControlHaptic = "light" | "medium" | "selection";

export function useControlHaptics<TElement extends HTMLElement>({
  includeCheckboxLabels = false,
  cooldownMs = 80,
}: { includeCheckboxLabels?: boolean; cooldownMs?: number } = {}) {
  const haptics = useWebHaptics();

  return useCallback(
    (event: MouseEvent<TElement>) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const control = target.closest("button, a[href], label");
      if (!control || !event.currentTarget.contains(control)) return;

      if (control instanceof HTMLButtonElement && control.disabled) return;
      if (
        control instanceof HTMLLabelElement &&
        (!includeCheckboxLabels ||
          !control.querySelector('input[type="checkbox"]'))
      ) {
        return;
      }

      const preset = getControlPreset(control);
      const now =
        typeof performance === "undefined" ? Date.now() : performance.now();

      if (now - lastHapticAt < cooldownMs) return;
      lastHapticAt = now;

      void haptics.trigger(preset);
    },
    [cooldownMs, haptics, includeCheckboxLabels]
  );
}

let lastHapticAt = 0;

function getControlPreset(control: Element): ControlHaptic {
  if (control instanceof HTMLAnchorElement) return "selection";
  if (control.getAttribute("aria-pressed") !== null) return "selection";

  if (
    control instanceof HTMLLabelElement &&
    control.querySelector('input[type="checkbox"]')
  ) {
    return "selection";
  }

  if (
    control instanceof HTMLButtonElement &&
    control.type === "submit"
  ) {
    return "medium";
  }

  return "light";
}
