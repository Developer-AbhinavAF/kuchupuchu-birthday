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

      // Generate zigzag path points
      const zigzagPoints = [];
      const segments = 8;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = lerp(starA.x, starB.x, t);
        const zigzagY = Math.sin(t * Math.PI * 4) * 40; // Zigzag pattern
        const y = lerp(starA.y, starB.y, t) + zigzagY;
        zigzagPoints.push({ x, y });
      }

      // Traveling particles
      interface TravelParticle {
        progress: number;
        speed: number;
        color: string;
        size: number;
        active: boolean;
        offset: number;
      }
      const travelers: TravelParticle[] = Array.from({ length: 30 }, () => ({
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        color: ["#C4B5D4", "#F2D4D4", "#FFF8F0", "#8B2252", "#FF6B9D"][Math.floor(Math.random() * 5)],
        size: 1.5 + Math.random() * 2.5,
        active: Math.random() > 0.2,
        offset: Math.random() * Math.PI * 2,
      }));

      let pathProgress = 0;
      let frame = 0;

      function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
      }

      // Get position on zigzag path
      function getZigzagPosition(progress: number) {
        const totalSegments = zigzagPoints.length - 1;
        const segmentProgress = progress * totalSegments;
        const segmentIndex = Math.floor(segmentProgress);
        const segmentT = segmentProgress - segmentIndex;

        if (segmentIndex >= totalSegments) {
          return zigzagPoints[zigzagPoints.length - 1];
        }

        const p1 = zigzagPoints[segmentIndex];
        const p2 = zigzagPoints[segmentIndex + 1];
        return {
          x: lerp(p1.x, p2.x, segmentT),
          y: lerp(p1.y, p2.y, segmentT),
        };
      }

      function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, glow: number) {
        ctx.save();
        // Enhanced glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
        grad.addColorStop(0, `rgba(196, 181, 212, ${glow})`);
        grad.addColorStop(0.5, `rgba(139, 34, 82, ${glow * 0.5})`);
        grad.addColorStop(1, "rgba(196, 181, 212, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Star center
        ctx.fillStyle = "#FFF8F0";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Enhanced sparkle lines
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + frame * 0.02;
          ctx.strokeStyle = `rgba(255, 248, 240, ${glow * 0.9})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * size * 4, y + Math.sin(angle) * size * 4);
          ctx.stroke();
        }
        ctx.restore();
      }

      function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#DC2626";
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.3);
        ctx.bezierCurveTo(x, y - size * 0.1, x - size, y - size * 0.1, x - size, y + size * 0.3);
        ctx.bezierCurveTo(x - size, y + size * 0.7, x, y + size * 1.1, x, y + size * 1.3);
        ctx.bezierCurveTo(x, y + size * 1.1, x + size, y + size * 0.7, x + size, y + size * 0.3);
        ctx.bezierCurveTo(x + size, y - size * 0.1, x, y - size * 0.1, x, y + size * 0.3);
        ctx.fill();
        ctx.restore();
      }

      function animate() {
        animFrameRef.current = requestAnimationFrame(animate);
        frame++;
        ctx.clearRect(0, 0, W, H);

        const pulse = 0.6 + Math.sin(frame * 0.03) * 0.4;
        pathProgress = Math.min(1, pathProgress + 0.004);

        // Enhanced background stars
        if (frame % 2 === 0) {
          for (let i = 0; i < 4; i++) {
            const sx = Math.random() * W;
            const sy = Math.random() * H;
            const starSize = Math.random() * 1.5;
            const starAlpha = Math.random() * 0.4;
            ctx.fillStyle = `rgba(255, 248, 240, ${starAlpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw zigzag path
        if (pathProgress > 0) {
          const visibleSegments = Math.floor(pathProgress * segments);
          const partialSegment = (pathProgress * segments) % 1;

          ctx.save();
          ctx.strokeStyle = "rgba(220, 38, 38, 0.4)"; // Red string color
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 12]);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          ctx.beginPath();
          ctx.moveTo(starA.x, starA.y);

          for (let i = 0; i < visibleSegments; i++) {
            if (i < zigzagPoints.length - 1) {
              ctx.lineTo(zigzagPoints[i + 1].x, zigzagPoints[i + 1].y);
            }
          }

          // Draw partial segment
          if (visibleSegments < zigzagPoints.length - 1) {
            const current = zigzagPoints[visibleSegments];
            const next = zigzagPoints[visibleSegments + 1];
            const partialX = lerp(current.x, next.x, partialSegment);
            const partialY = lerp(current.y, next.y, partialSegment);
            ctx.lineTo(partialX, partialY);
          }

          ctx.stroke();

          // Add hearts along the path
          ctx.setLineDash([]);
          for (let i = 0; i < visibleSegments; i++) {
            const point = zigzagPoints[i];
            const heartAlpha = Math.min(1, (pathProgress - (i / segments)) * 3);
            if (heartAlpha > 0) {
              drawHeart(ctx, point.x, point.y, 8, heartAlpha * 0.6);
            }
          }

          ctx.restore();
        }

        // Enhanced traveling particles on zigzag path
        travelers.forEach((t) => {
          if (!t.active) return;
          t.progress += t.speed;
          if (t.progress > 1) t.progress = 0;

          const pos = getZigzagPosition(t.progress);
          const wobble = Math.sin(frame * 0.05 + t.offset) * 8;
          const py = pos.y + wobble;

          ctx.save();
          ctx.globalAlpha = Math.sin(t.progress * Math.PI) * 0.95;
          ctx.fillStyle = t.color;
          ctx.shadowColor = t.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(pos.x, py, t.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw stars
        drawStar(ctx, starA.x, starA.y, 6, pulse);
        drawStar(ctx, starB.x, starB.y, 6, 1 - pulse * 0.3 + 0.3);

        // Enhanced heart constellation at midpoint
        if (pathProgress > 0.7) {
          const heartProgress = (pathProgress - 0.7) / 0.3;
          const midpoint = getZigzagPosition(0.5);
          const hy = midpoint.y - 30;
          const hs = 15 * heartProgress;

          // Multiple pulsing hearts
          for (let i = 0; i < 3; i++) {
            const delay = i * 0.3;
            const localProgress = Math.max(0, Math.min(1, (heartProgress - delay) / 0.3));
            if (localProgress > 0) {
              const heartPulse = 0.8 + Math.sin(frame * 0.08 + i) * 0.2;
              drawHeart(ctx, midpoint.x, hy, hs * heartPulse, localProgress * 0.8);
            }
          }
        }

        // Connecting red string animation
        if (pathProgress > 0.9) {
          const stringProgress = (pathProgress - 0.9) / 0.1;
          ctx.save();
          ctx.strokeStyle = `rgba(220, 38, 38, ${stringProgress * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 6]);
          ctx.beginPath();
          ctx.moveTo(starA.x, starA.y + 20);
          ctx.lineTo(starB.x, starB.y + 20);
          ctx.stroke();
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
        { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.2,
          stagger: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate location labels
      const labels = section.querySelectorAll(".distance-label");
      gsap.fromTo(
        labels,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
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