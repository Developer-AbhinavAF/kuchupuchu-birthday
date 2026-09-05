"use client";
import { useEffect, useRef } from "react";

interface ConfettiBurstProps {
  trigger?: boolean;
  onComplete?: () => void;
}

export default function ConfettiBurst({ trigger = false, onComplete }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!trigger || hasTriggered.current) return;
    hasTriggered.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const colors = [
      "#C4B5D4", "#F2D4D4", "#8B2252", "#FFF8F0", "#FFD700", 
      "#E8C4D4", "#4A5E4A", "#FF6B9D", "#87CEEB", "#FFB347"
    ];

    interface Confetti {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      alpha: number;
      shape: "circle" | "square" | "heart" | "star";
    }

    const confetti: Confetti[] = [];
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 15;
      const shapes: ("circle" | "square" | "heart" | "star")[] = ["circle", "square", "heart", "star"];
      confetti.push({
        x: W / 2,
        y: H / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    let frame = 0;
    function animate() {
      animRef.current = requestAnimationFrame(animate);
      frame++;
      ctx.clearRect(0, 0, W, H);

      confetti.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.2; // Gravity
        c.vx *= 0.99; // Air resistance
        c.rotation += c.rotationSpeed;
        c.alpha -= 0.008;

        if (c.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);

        if (c.shape === "circle") {
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (c.shape === "square") {
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        } else if (c.shape === "heart") {
          ctx.fillStyle = c.color;
          const s = c.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(0, -s * 0.1, -s, -s * 0.1, -s, s * 0.3);
          ctx.bezierCurveTo(-s, s * 0.7, 0, s * 1.1, 0, s * 1.3);
          ctx.bezierCurveTo(0, s * 1.1, s, s * 0.7, s, s * 0.3);
          ctx.bezierCurveTo(s, -s * 0.1, 0, -s * 0.1, 0, s * 0.3);
          ctx.fill();
        } else if (c.shape === "star") {
          ctx.fillStyle = c.color;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * c.size / 2;
            const y = Math.sin(angle) * c.size / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      if (frame > 180) {
        cancelAnimationFrame(animRef.current);
        ctx.clearRect(0, 0, W, H);
        onComplete?.();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [trigger, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
      aria-hidden="true"
    />
  );
}