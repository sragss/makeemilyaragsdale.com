"use client";

import { Input } from "@/components/ui/input";
import { NoiseBackground } from "@/components/ui/noise-background";
import { NOISE_GRADIENT_COLORS } from "@/lib/constants";

export function NoiseInput(props: React.ComponentProps<typeof Input>) {
  return (
    <NoiseBackground
      containerClassName="rounded-sm"
      gradientColors={[...NOISE_GRADIENT_COLORS]}
      noiseIntensity={0.1}
      speed={0.03}
    >
      <div className="absolute inset-0 z-[5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none rounded-sm" />
      <Input
        {...props}
        className="relative z-10 bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
      />
    </NoiseBackground>
  );
}
