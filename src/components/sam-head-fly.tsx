"use client";

import { useEffect, useRef } from "react";

interface FlyHead {
  x: number;
  y: number;
  vx: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  bobPhase: number;
  bobSpeed: number;
  bobAmp: number;
  baseY: number;
  spawned: number;
  scaleIn: number;
}

const HEAD_SRC = "/sam-head.png";

export function SamHeadFly({
  duration = 11000,
  count = 36,
}: {
  duration?: number;
  count?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headsRef = useRef<FlyHead[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const spawnIndexRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = HEAD_SRC;
    imgRef.current = img;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = (t: number) => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;
      const W = c.width;
      const H = c.height;

      const spawnInterval = (duration * 0.55) / count;
      while (
        spawnIndexRef.current < count &&
        elapsed > spawnIndexRef.current * spawnInterval
      ) {
        const i = spawnIndexRef.current;
        const fromLeft = i % 2 === 0;
        const size = 90 + Math.random() * 80;
        const baseY = H * 0.15 + Math.random() * H * 0.7;
        const speed = 4.5 + Math.random() * 4.5;
        headsRef.current.push({
          x: fromLeft ? -size : W + size,
          y: baseY,
          baseY,
          vx: fromLeft ? speed : -speed,
          size,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          bobPhase: Math.random() * Math.PI * 2,
          bobSpeed: 0.08 + Math.random() * 0.06,
          bobAmp: 18 + Math.random() * 30,
          spawned: t,
          scaleIn: 0,
        });
        spawnIndexRef.current += 1;
      }

      ctx.clearRect(0, 0, W, H);

      const fadeStart = duration * 0.85;
      const globalAlpha =
        elapsed > fadeStart
          ? Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart))
          : 1;

      headsRef.current = headsRef.current.filter((h) => {
        h.x += h.vx;
        h.bobPhase += h.bobSpeed;
        h.y = h.baseY + Math.sin(h.bobPhase) * h.bobAmp;
        h.rotation += h.rotationSpeed;
        h.scaleIn = Math.min(1, h.scaleIn + 0.08);

        if (h.vx > 0 && h.x > W + h.size) return false;
        if (h.vx < 0 && h.x < -h.size) return false;

        const ready = imgRef.current?.complete && imgRef.current.naturalWidth;

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        const eased = 1 - Math.pow(1 - h.scaleIn, 3);
        const s = h.size * eased;
        ctx.globalAlpha = globalAlpha;
        if (ready) {
          ctx.drawImage(imgRef.current!, -s / 2, -s / 2, s, s);
        } else {
          ctx.fillStyle = "#d4a574";
          ctx.beginPath();
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        return true;
      });

      if (elapsed < duration || headsRef.current.length > 0) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [duration, count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  );
}
