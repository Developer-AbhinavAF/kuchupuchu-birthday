"use client";
import { useEffect, useRef } from "react";

interface FloralHeartLoaderProps {
  onComplete: () => void;
}

export default function FloralHeartLoader({ onComplete }: FloralHeartLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", resize);

    // Heart parametric
    const heartX = (t: number) => 16 * Math.pow(Math.sin(t), 3);
    const heartY = (t: number) =>
      -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const scale = Math.min(W, H) * 0.022;
    const cx = W / 2;
    const cy = H / 2;

    // Generate heart points
    const heartPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < 300; i++) {
      const t = (i / 300) * Math.PI * 2;
      heartPoints.push({
        x: cx + heartX(t) * scale,
        y: cy + heartY(t) * scale,
      });
    }

    // Particle system with increased count for more richness
    const PARTICLE_COUNT = 250;
    const colors = ["#C4B5D4", "#F2D4D4", "#8B2252", "#FFF8F0", "#E8C4D4", "#B8A4CC", "#D4A820", "#FFE060"];

    interface Particle {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      phase: "scatter" | "gather" | "bloom" | "pulse";
      delay: number;
      angle: number;
      radius: number;
      speed: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const hp = heartPoints[Math.floor(Math.random() * heartPoints.length)];
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        tx: hp.x + (Math.random() - 0.5) * 6,
        ty: hp.y + (Math.random() - 0.5) * 6,
        vx: 0,
        vy: 0,
        size: 1.5 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
        phase: "scatter",
        delay: Math.random() * 60,
        angle: Math.random() * Math.PI * 2,
        radius: 2 + Math.random() * 4,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    // Petal particles (extra decorative) with more variety
    interface Petal {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      rotSpeed: number;
      active: boolean;
      wobble: number;
      wobbleSpeed: number;
    }
    const petals: Petal[] = [];
    for (let i = 0; i < 60; i++) {
      petals.push({
        x: Math.random() * W,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: 0.3 + Math.random() * 1.2,
        size: 3 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        active: false,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.04,
      });
    }

    let frame = 0;
    const GATHER_START = 80;
    const BLOOM_START = 220;
    const PULSE_START = 320;
    const FINISH = 440;

    function drawPetal(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.6, size * 0.35, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function drawLilyPetal(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
      alpha: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        size * 0.3,
        -size * 0.4,
        size * 0.4,
        -size * 0.9,
        0,
        -size
      );
      ctx.bezierCurveTo(
        -size * 0.4,
        -size * 0.9,
        -size * 0.3,
        -size * 0.4,
        0,
        0
      );
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      frame++;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0A0D1A";
      ctx.fillRect(0, 0, W, H);

      // Subtle radial glow in center
      if (frame > BLOOM_START) {
        const progress = Math.min(1, (frame - BLOOM_START) / 100);
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 20);
        grd.addColorStop(0, `rgba(139, 34, 82, ${0.12 * progress})`);
        grd.addColorStop(0.4, `rgba(196, 181, 212, ${0.06 * progress})`);
        grd.addColorStop(1, "rgba(10, 13, 26, 0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Update & draw particles
      particles.forEach((p) => {
        if (frame < p.delay) return;

        if (frame < GATHER_START) {
          p.alpha = Math.min(0.6, p.alpha + 0.02);
          p.x += (Math.random() - 0.5) * 0.5;
          p.y += (Math.random() - 0.5) * 0.5;
        } else if (frame < BLOOM_START) {
          const progress = (frame - GATHER_START) / (BLOOM_START - GATHER_START);
          p.x += (p.tx - p.x) * 0.04;
          p.y += (p.ty - p.y) * 0.04;
          p.alpha = Math.min(1, p.alpha + 0.03);
          p.phase = "gather";
        } else if (frame < PULSE_START) {
          p.phase = "bloom";
          p.alpha = Math.min(1, p.alpha + 0.02);
          p.angle += p.speed;
          p.x = p.tx + Math.cos(p.angle) * p.radius * 0.5;
          p.y = p.ty + Math.sin(p.angle) * p.radius * 0.5;
        } else if (frame < FINISH) {
          p.phase = "pulse";
          const pulseProgress = (frame - PULSE_START) / (FINISH - PULSE_START);
          p.alpha = 1 - pulseProgress * 0.3;
          p.angle += p.speed * 1.5;
          p.x = p.tx + Math.cos(p.angle) * p.radius;
          p.y = p.ty + Math.sin(p.angle) * p.radius;
        } else {
          p.alpha -= 0.015;
        }

        if (p.alpha <= 0) return;

        // Draw lily petal shape for particles
        if (p.size > 2.5) {
          drawLilyPetal(ctx, p.x, p.y, p.size * 1.2, p.angle, p.color, p.alpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      // Falling petals after bloom with more realistic movement
      if (frame > BLOOM_START) {
        petals.forEach((petal, i) => {
          if (frame > BLOOM_START + i * 2) {
            petal.active = true;
            petal.alpha = Math.min(0.8, petal.alpha + 0.015);
          }
          if (!petal.active) return;
          petal.wobble += petal.wobbleSpeed;
          petal.x += petal.vx + Math.sin(petal.wobble) * 0.5;
          petal.y += petal.vy;
          petal.rotation += petal.rotSpeed;
          petal.vx += Math.sin(frame * 0.015 + i) * 0.008;
          if (petal.y > H + 20) {
            petal.y = -20;
            petal.x = Math.random() * W;
            petal.alpha = 0;
          }
          drawPetal(ctx, petal.x, petal.y, petal.size, petal.rotation, petal.color, petal.alpha);
        });
      }

      // Lily blooms around heart center (decorative) with more variety
      if (frame > BLOOM_START + 30) {
        const bloomProgress = Math.min(1, (frame - BLOOM_START - 30) / 80);
        const lilyPositions = [
          { x: cx - scale * 8, y: cy - scale * 6, color: "#F2D4D4", type: "lily" },
          { x: cx + scale * 8, y: cy - scale * 6, color: "#C4B5D4", type: "rose" },
          { x: cx, y: cy + scale * 10, color: "#FFF8F0", type: "tulip" },
          { x: cx - scale * 14, y: cy + scale * 2, color: "#E8C4D4", type: "lily" },
          { x: cx + scale * 14, y: cy + scale * 2, color: "#C4B5D4", type: "rose" },
          { x: cx - scale * 6, y: cy + scale * 14, color: "#D4A820", type: "lily" },
          { x: cx + scale * 6, y: cy + scale * 14, color: "#FFE060", type: "tulip" },
        ];

        lilyPositions.forEach((pos) => {
          const s = (scale * 1.0) * bloomProgress;
          const petalCount = pos.type === "rose" ? 8 : (pos.type === "tulip" ? 6 : 6);
          
          for (let p = 0; p < petalCount; p++) {
            const angle = (p / petalCount) * Math.PI * 2;
            const petalSize = pos.type === "rose" ? s * (1 - p * 0.06) : s;
            drawLilyPetal(ctx, pos.x, pos.y, petalSize, angle, pos.color, 0.5 * bloomProgress);
          }
          
          // Center with different styles based on flower type
          ctx.beginPath();
          if (pos.type === "rose") {
            ctx.arc(pos.x, pos.y, s * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = pos.color;
          } else if (pos.type === "tulip") {
            ctx.ellipse(pos.x, pos.y, s * 0.15, s * 0.1, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#FFE060";
          } else {
            ctx.arc(pos.x, pos.y, s * 0.12, 0, Math.PI * 2);
            ctx.fillStyle = "#FFE4B5";
          }
          ctx.globalAlpha = 0.8 * bloomProgress;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // Title text fade in
      if (frame > PULSE_START) {
        const textProgress = Math.min(1, (frame - PULSE_START) / 60);
        ctx.save();
        ctx.globalAlpha = textProgress * 0.9;
        ctx.fillStyle = "#FFF8F0";
        ctx.font = `300 ${Math.min(W * 0.04, 22)}px 'DM Sans', sans-serif`;
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.3em";
        ctx.fillText("for you", cx, cy + scale * 18);
        ctx.restore();
      }

      // Complete
      if (frame >= FINISH + 30) {
        cancelAnimationFrame(animFrameRef.current);
        if (containerRef.current) {
          containerRef.current.style.transition = "opacity 1.2s ease";
          containerRef.current.style.opacity = "0";
          setTimeout(onComplete, 1300);
        }
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="loader-container"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0A0D1A",
        opacity: 1,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}