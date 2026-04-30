"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";

const REPEL_RADIUS = 200;
const REPEL_STRENGTH = 5200;
const SPRING_K = 42;
const DAMPING_C = 10;
const MAX_OFFSET = 260;
const MAX_TILT = 14;

export function ShyButton(props: ComponentProps<typeof Button>) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0, active: false };

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    window.addEventListener("pointermove", onMove);

    function step(t: number) {
      const dt = Math.min(0.04, (t - last) / 1000);
      last = t;

      const btn = ref.current;
      if (btn && mouse.active) {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d > 0.001 && d < REPEL_RADIUS) {
          const taper = 1 - d / REPEL_RADIUS;
          const force = REPEL_STRENGTH * taper * taper;
          vel.x += (dx / d) * force * dt;
          vel.y += (dy / d) * force * dt;
        }
      }

      vel.x += (-SPRING_K * pos.x - DAMPING_C * vel.x) * dt;
      vel.y += (-SPRING_K * pos.y - DAMPING_C * vel.y) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      const mag = Math.hypot(pos.x, pos.y);
      if (mag > MAX_OFFSET) {
        const nx = pos.x / mag;
        const ny = pos.y / mag;
        pos.x = nx * MAX_OFFSET;
        pos.y = ny * MAX_OFFSET;
        const vDotN = vel.x * nx + vel.y * ny;
        if (vDotN > 0) {
          vel.x -= vDotN * nx;
          vel.y -= vDotN * ny;
        }
      }

      x.set(pos.x);
      y.set(pos.y);
      rotate.set(Math.max(-MAX_TILT, Math.min(MAX_TILT, vel.x * 0.045)));

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [x, y, rotate]);

  return (
    <motion.div style={{ x, y, rotate }} className="w-full">
      <Button ref={ref} {...props} />
    </motion.div>
  );
}
