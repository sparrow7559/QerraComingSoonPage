import React, { useEffect, useRef } from "react";
import {
  clamp01,
  smoothstep,
  hash01,
  projectY,
  buildPointCloudFromLogoVector,
} from "./comingSoonUtils";

export default function VideoParticleMorph() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let mounted = true;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let pts = [];
    let N = 0;
    let radius = new Float32Array(0);
    let seed = new Float32Array(0);
    let zBase = new Float32Array(0);

    const rebuild = () => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const W = Math.max(1, Math.round(window.innerWidth * dpr));
      const H = Math.max(1, Math.round(window.innerHeight * dpr));
      canvas.width = W;
      canvas.height = H;

      const area = (W * H) / (dpr * dpr);
      const density = Math.round(Math.max(1400, Math.min(4200, area / 90)));

      pts = buildPointCloudFromLogoVector({ w: W, h: H, density });
      N = pts.length;

      const baseR = Math.max(0.55, Math.min(1.2, Math.min(W, H) / 720));
      radius = new Float32Array(N);
      seed = new Float32Array(N);
      zBase = new Float32Array(N);

      const depth = Math.min(W, H) * 0.22;
      for (let i = 0; i < N; i++) {
        const h1 = hash01(i + 123);
        const h3 = hash01(i + 2222);
        radius[i] = baseR * (0.75 + 0.9 * h1);
        seed[i] = (i * 0.21 + h3 * 7.0) * 0.6;
        zBase[i] = (h3 - 0.5) * depth;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    rebuild();

    const onResize = () => {
      if (mounted) rebuild();
    };
    window.addEventListener("resize", onResize);

    const start = performance.now();
    const alphaBuckets = new Array(8)
      .fill(0)
      .map((_, i) => 0.12 + (i / 7) * 0.62);

    const draw = (now) => {
      if (!mounted) return;

      const W = canvas.width;
      const H = canvas.height;
      const t = now - start;

      const pulse = (Math.sin(t * 0.00085) + 1) * 0.5;
      const jitterBoost = smoothstep(0.55, 0.92, pulse) * 0.9;

      const rotY = (t * 0.0019) % (Math.PI * 2);
      const persp = Math.max(W, H) * 0.95;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(
        W * 0.5,
        H * 0.55,
        0,
        W * 0.5,
        H * 0.55,
        Math.max(W, H) * 0.55,
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(W / 2, H / 2);

      ctx.shadowColor = "rgba(255,255,255,0.18)";
      ctx.shadowBlur = 5 * dpr;

      const lod = W < 520 ? 2 : 1;

      for (let b = 0; b < alphaBuckets.length; b++) {
        const aBucket = alphaBuckets[b] * (0.75 + 0.2 * jitterBoost);
        ctx.fillStyle = `rgba(255,255,255,${aBucket})`;

        for (let i = b; i < N; i += alphaBuckets.length * lod) {
          const ax = pts[i][0];
          const ay = pts[i][1];

          const s0 = seed[i];
          const micro =
            (Math.sin(t * 0.008 + s0) + Math.cos(t * 0.011 + s0 * 1.1)) *
            (0.12 + 0.55 * jitterBoost);

          const x2 = ax + micro;
          const y2 = ay + micro * 0.85;
          const z = zBase[i];

          const p = projectY(x2, y2, z, rotY, persp);
          const r = radius[i] * (0.9 + 0.7 * p.k);

          if (p.zr < -persp * 0.45) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="videomorph-container pointer-events-none fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-transparent -translate-y-10">
      <div
        className="pointer-events-none absolute inset-0 bg-transparent opacity-95 mix-blend-screen"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-[-40%] inset-x-[-20%] -translate-x-[30%] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_45%,rgba(255,255,255,0)_60%)] opacity-20 blur-[0.5px] animate-[vpScan_3s_ease-in-out_infinite]"
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
    </div>
  );
}
