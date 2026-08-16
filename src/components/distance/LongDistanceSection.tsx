"use client";
import { useEffect, useRef } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

export default function LongDistanceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.offsetWidth || 800;
      const H = canvas.offsetHeight || 500;
      canvas.width = W;
      canvas.height = H;

      // Two star positions
      const starA = { x: W * 0.15, y: H * 0.35 };
      const starB = { x: W * 0.85, y: H * 0.35 };

      // Traveling particles
      interface TravelParticle {
        progress: number;
        speed: number;
        color: string;
        size: number;
        active: boolean;
      }
      const travelers: TravelParticle[] = Array.from({ length: 20 }, () => ({
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        color: ["#C4B5D4", "#F2D4D4", "#FFF8F0", "#8B2252"][Math.floor(Math.random() * 4)],
        size: 1 + Math.random() * 2,
        active: Math.random() > 0.3,
      }));

      let constellationProgress = 0;
      let frame = 0;

      function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
      }

      function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, glow: number) {
        ctx.save();
        // Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        grad.addColorStop(0, `rgba(196, 181, 212, ${glow})`);
        grad.addColorStop(1, "rgba(196, 181, 212, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Star center
        ctx.fillStyle = "#FFF8F0";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle lines
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          ctx.strokeStyle = `rgba(255, 248, 240, ${glow * 0.8})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * size * 3, y + Math.sin(angle) * size * 3);
          ctx.stroke();
        }
        ctx.restore();
      }

      function animate() {
        animFrameRef.current = requestAnimationFrame(animate);
        frame++;
        ctx.clearRect(0, 0, W, H);

        const pulse = 0.6 + Math.sin(frame * 0.04) * 0.4;
        constellationProgress = Math.min(1, constellationProgress + 0.003);

        // Background stars
        if (frame % 3 === 0) {
          for (let i = 0; i < 3; i++) {
            const sx = Math.random() * W;
            const sy = Math.random() * H;
            ctx.fillStyle = `rgba(255, 248, 240, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(sx, sy, Math.random() * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Constellation line
        if (constellationProgress > 0) {
          const endX = lerp(starA.x, starB.x, constellationProgress);
          const endY = lerp(starA.y, starB.y, constellationProgress);
          ctx.save();
          ctx.strokeStyle = "rgba(196, 181, 212, 0.3)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 8]);
          ctx.beginPath();
          ctx.moveTo(starA.x, starA.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.restore();
        }

        // Traveling particles
        travelers.forEach((t) => {
          if (!t.active) return;
          t.progress += t.speed;
          if (t.progress > 1) t.progress = 0;

          const px = lerp(starA.x, starB.x, t.progress);
          const py = lerp(starA.y, starB.y, t.progress) + Math.sin(t.progress * Math.PI) * -30;

          ctx.save();
          ctx.globalAlpha = Math.sin(t.progress * Math.PI) * 0.9;
          ctx.fillStyle = t.color;
          ctx.beginPath();
          ctx.arc(px, py, t.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw stars
        drawStar(ctx, starA.x, starA.y, 5, pulse);
        drawStar(ctx, starB.x, starB.y, 5, 1 - pulse * 0.3 + 0.3);

        // Heart constellation at midpoint
        if (constellationProgress > 0.8) {
          const heartProgress = (constellationProgress - 0.8) / 0.2;
          const hx = (starA.x + starB.x) / 2;
          const hy = starA.y - 20;
          const hs = 12 * heartProgress;

          ctx.save();
          ctx.globalAlpha = heartProgress * 0.6;
          ctx.fillStyle = "#8B2252";
          ctx.beginPath();
          ctx.moveTo(hx, hy + hs * 0.3);
          ctx.bezierCurveTo(hx, hy - hs * 0.1, hx - hs, hy - hs * 0.1, hx - hs, hy + hs * 0.3);
          ctx.bezierCurveTo(hx - hs, hy + hs * 0.7, hx, hy + hs * 1.1, hx, hy + hs * 1.3);
          ctx.bezierCurveTo(hx, hy + hs * 1.1, hx + hs, hy + hs * 0.7, hx + hs, hy + hs * 0.3);
          ctx.bezierCurveTo(hx + hs, hy - hs * 0.1, hx, hy - hs * 0.1, hx, hy + hs * 0.3);
          ctx.fill();
          ctx.restore();
        }
      }

      animate();
    };

    initCanvas();

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const textItems = section.querySelectorAll(".distance-text-item");
      gsap.fromTo(
        textItems,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    };

    initGSAP();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef} className="distance-section">
      {/* Canvas constellation */}
      <canvas ref={canvasRef} className="distance-canvas" aria-hidden="true" />

      {/* Text overlay */}
      <div className="distance-text-overlay">
        {birthdayConfig.distanceTexts.map((text, i) => (
          <p
            key={i}
            className={`distance-text-item ${i === birthdayConfig.distanceTexts.length - 1 ? "distance-text-final" : ""}`}
            style={{ transitionDelay: `${i * 0.2}s` }}
          >
            {text}
          </p>
        ))}
      </div>

      {/* Location labels */}
      <div className="distance-labels">
        <div className="distance-label distance-label-left">
          <div className="label-dot" />
          <span>here</span>
        </div>
        <div className="distance-label distance-label-right">
          <div className="label-dot" />
          <span>there</span>
        </div>
      </div>
    </div>
  );
}