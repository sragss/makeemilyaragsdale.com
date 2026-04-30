"use client";

import { useEffect, useRef } from "react";

const RAINBOW = [
  "#e40303", // red
  "#ff8c00", // orange
  "#ffed00", // yellow
  "#008026", // green
  "#004dff", // blue
  "#750787", // violet
  "#ff5fa2", // hot pink (extra fabulous)
  "#ffd700", // gold sparkle
];

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string
) => void;

const drawHeart: DrawFn = (ctx, size, color) => {
  const s = size / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(s, -s, s * 1.3, s * 0.4, 0, s);
  ctx.bezierCurveTo(-s * 1.3, s * 0.4, -s, -s, 0, s * 0.3);
  ctx.fill();
};

const drawStar: DrawFn = (ctx, size, color) => {
  const spikes = 5;
  const outer = size / 2;
  const inner = outer * 0.45;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
};

const drawSparkle: DrawFn = (ctx, size, color) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  const r = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.18, -r * 0.18);
  ctx.lineTo(r, 0);
  ctx.lineTo(r * 0.18, r * 0.18);
  ctx.lineTo(0, r);
  ctx.lineTo(-r * 0.18, r * 0.18);
  ctx.lineTo(-r, 0);
  ctx.lineTo(-r * 0.18, -r * 0.18);
  ctx.closePath();
  ctx.fill();
};

const drawCircle: DrawFn = (ctx, size, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
};

const drawRibbon: DrawFn = (ctx, size, color) => {
  ctx.fillStyle = color;
  const w = size;
  const h = size * 0.35;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.quadraticCurveTo(0, -h, w / 2, -h / 2);
  ctx.quadraticCurveTo(0, 0, w / 2, h / 2);
  ctx.quadraticCurveTo(0, h, -w / 2, h / 2);
  ctx.quadraticCurveTo(0, 0, -w / 2, -h / 2);
  ctx.closePath();
  ctx.fill();
};

const SHAPES: DrawFn[] = [
  drawHeart,
  drawStar,
  drawSparkle,
  drawSparkle,
  drawCircle,
  drawRibbon,
  drawHeart,
  drawStar,
];

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
  twinklePhase: number;
  twinkleSpeed: number;
}

function spawnFromOrigin(
  arr: Particle[],
  cx: number,
  cy: number,
  count: number,
  baseAngle: number,
  spread: number,
  speedRange: [number, number]
) {
  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * spread;
    const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
    arr.push({
      x: cx + (Math.random() - 0.5) * 30,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 8 + Math.random() * 22,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.18,
      gravity: 0.05 + Math.random() * 0.05,
      drag: 0.985 + Math.random() * 0.012,
      opacity: 0.75 + Math.random() * 0.25,
      color: RAINBOW[Math.floor(Math.random() * RAINBOW.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.06 + Math.random() * 0.08,
    });
  }
}

export function FabulousConfetti({
  duration = 6500,
}: {
  duration?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const lastBurstRef = useRef<number>(-1);

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

      const W = canvas.width;
      const H = canvas.height;

      // Sustained bursts during the first ~60% of the duration, every ~280ms
      const burstWindow = duration * 0.6;
      const burstInterval = 280;
      if (elapsed < burstWindow) {
        const burstIdx = Math.floor(elapsed / burstInterval);
        if (burstIdx > lastBurstRef.current) {
          lastBurstRef.current = burstIdx;

          // Origin rotates through key spots so sparkle fills the screen
          const origins: Array<[number, number, number, number]> = [
            // [cx, cy, baseAngle, spread]
            [W * 0.5, H * 0.55, -Math.PI / 2, Math.PI * 1.3], // center burst
            [W * 0.15, H * 0.85, -Math.PI / 3, Math.PI * 0.9], // bottom-left up-right
            [W * 0.85, H * 0.85, -(Math.PI - Math.PI / 3), Math.PI * 0.9], // bottom-right up-left
            [W * 0.5, -20, Math.PI / 2, Math.PI * 0.6], // top rain
            [W * 0.25, H * 0.4, -Math.PI / 2, Math.PI * 1.5],
            [W * 0.75, H * 0.4, -Math.PI / 2, Math.PI * 1.5],
          ];
          const origin = origins[burstIdx % origins.length];
          const isTopRain = origin[1] < 0;
          spawnFromOrigin(
            particlesRef.current,
            origin[0],
            origin[1],
            isTopRain ? 28 : 38,
            origin[2],
            origin[3],
            isTopRain ? [2, 5] : [5, 13]
          );
        }
      }

      // Trail effect: subtle fade instead of full clear → sparkle streaks
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.clearRect(0, 0, W, H);

      const fadeStart = duration * 0.75;
      const globalAlpha =
        elapsed > fadeStart
          ? Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart))
          : 1;

      particlesRef.current = particlesRef.current.filter((p) => {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.rotationSpeed *= 0.995;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y > H + 60) return false;
        if (p.x < -60 || p.x > W + 60) return false;

        // Twinkle: oscillate alpha so it looks like glitter
        const twinkle = 0.65 + 0.35 * Math.sin(p.twinklePhase);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity * globalAlpha * twinkle;

        // Glow pass
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 0.7;
        p.shape(ctx, p.size, p.color);

        ctx.restore();

        return true;
      });

      if (elapsed < duration || particlesRef.current.length > 0) {
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
