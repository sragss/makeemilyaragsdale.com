"use client";

import { useCallback, type PointerEvent } from "react";
import { useWebHaptics } from "web-haptics/react";

export function useControlHaptics<TElement extends HTMLElement>({
  includeCheckboxLabels = false,
}: { includeCheckboxLabels?: boolean } = {}) {
  const { trigger } = useWebHaptics();

  return useCallback(
    (event: PointerEvent<TElement>) => {
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

      void trigger("nudge", { intensity: 0.9 });
    },
    [includeCheckboxLabels, trigger]
  );
}
