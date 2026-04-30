"use client";

import { useEffect, useRef } from "react";

// Light, bright greens — cartoon hand-drawn roses
const COLORS = [
  "#6dbf5c", // bright leaf green
  "#8fd47e", // light green
  "#4da840", // kelly green
  "#a8e09a", // pale spring green
  "#5cc34f", // vivid green
  "#78c96b", // medium green
  "#b5e6a8", // very light green
];

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string
) => void;

// Hand-drawn rose: layered spiral petals with a sketchy line
const drawRose: DrawFn = (ctx, size, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Outer petals — 5 arcs radiating out, sketchy
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    const r = size * 0.45;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(angle) * r * 0.3,
      Math.sin(angle) * r * 0.3,
      r * 0.45,
      r * 0.3,
      angle,
      0,
      Math.PI
    );
    ctx.stroke();
  }

  // Inner spiral
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 3; t += 0.15) {
    const r = (t / (Math.PI * 3)) * size * 0.2;
    const x = Math.cos(t) * r;
    const y = Math.sin(t) * r;
    if (t === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill petals lightly
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    const r = size * 0.45;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(angle) * r * 0.3,
      Math.sin(angle) * r * 0.3,
      r * 0.45,
      r * 0.3,
      angle,
      0,
      Math.PI
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

// Simple cartoon leaf with vein line
const drawLeaf: DrawFn = (ctx, size, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";

  // Leaf shape
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.5);
  ctx.bezierCurveTo(
    size * 0.4, -size * 0.15,
    size * 0.3, size * 0.35,
    0, size * 0.5
  );
  ctx.bezierCurveTo(
    -size * 0.3, size * 0.35,
    -size * 0.4, -size * 0.15,
    0, -size * 0.5
  );
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Vein
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.4);
  ctx.lineTo(0, size * 0.4);
  ctx.stroke();
};

// Small rosebud — simpler, for variety
const drawBud: DrawFn = (ctx, size, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.lineCap = "round";

  // Two overlapping petals
  ctx.beginPath();
  ctx.ellipse(-size * 0.08, 0, size * 0.2, size * 0.32, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(size * 0.08, 0, size * 0.2, size * 0.32, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.15;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Small stem
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.lineTo(0, size * 0.55);
  ctx.stroke();
};

const SHAPES: DrawFn[] = [drawRose, drawRose, drawLeaf, drawBud, drawRose];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  drag: number;
  opacity: number;
  color: string;
  shape: DrawFn;
}

function createParticle(cx: number, cy: number): Particle {
  // Explode outward from center point
  const angle = Math.random() * Math.PI * 2;
  const speed = 3 + Math.random() * 8;

  return {
    x: cx + (Math.random() - 0.5) * 20,
    y: cy + (Math.random() - 0.5) * 10,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2, // bias upward
    size: 10 + Math.random() * 18,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.08,
    gravity: 0.06 + Math.random() * 0.04,
    drag: 0.97 + Math.random() * 0.02,
    opacity: 0.6 + Math.random() * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  };
}

export function BotanicalConfetti({
  duration = 4500,
}: {
  duration?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const spawnedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!startRef.current) startRef.current = time;
      const elapsed = time - startRef.current;

      // Burst spawn — all at once from center-bottom area (where the button was)
      if (!spawnedRef.current) {
        spawnedRef.current = true;
        const cx = canvas.width / 2;
        const cy = canvas.height * 0.55;
        for (let i = 0; i < 45; i++) {
          particlesRef.current.push(createParticle(cx, cy));
        }
      }

      // Global fade out in the last 35%
      const fadeStart = duration * 0.65;
      const globalAlpha =
        elapsed > fadeStart
          ? Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart))
          : 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        // Physics
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        // Slow the rotation as velocity decreases
        p.rotationSpeed *= 0.998;

        if (p.y > canvas.height + 40) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity * globalAlpha;
        p.shape(ctx, p.size, p.color);
        ctx.restore();

        return true;
      });

      if (elapsed < duration) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
