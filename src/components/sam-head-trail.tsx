"use client";

import { useEffect, useRef } from "react";

const HEAD_SRC = "/sam-head.png";
const TRAIL_LENGTH = 8;
const HEAD_SIZE = 84;

export function SamHeadTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = HEAD_SRC;

    const trail: { x: number; y: number }[] = [];
    const target = { x: -1000, y: -1000, active: false };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      target.active = true;
      if (trail.length === 0) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trail.push({ x: e.clientX, y: e.clientY });
        }
      }
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      if (target.active && trail.length > 0) {
        // Lead head springs toward cursor; rest lerps toward the one ahead
        trail[0].x += (target.x - trail[0].x) * 0.22;
        trail[0].y += (target.y - trail[0].y) * 0.22;
        for (let i = 1; i < trail.length; i++) {
          trail[i].x += (trail[i - 1].x - trail[i].x) * 0.32;
          trail[i].y += (trail[i - 1].y - trail[i].y) * 0.32;
        }

        const ready = img.complete && img.naturalWidth;
        if (ready) {
          // Draw tail-first so the lead head sits on top
          for (let i = trail.length - 1; i >= 0; i--) {
            const p = trail[i];
            const t = i / (trail.length - 1);
            const size = HEAD_SIZE * (1 - t * 0.5);
            const alpha = 0.85 * (1 - t * 0.85);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, -size / 2, -size / 2, size, size);
            ctx.restore();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}
