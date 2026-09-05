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
    for (let i = 0; i < 400; i++) {
      const t = (i / 400) * Math.PI * 2;
      heartPoints.push({
        x: cx + heartX(t) * scale,
        y: cy + heartY(t) * scale,
      });
    }

    // Heart border properties
    let heartBorderProgress = 0;
    let heartGlowIntensity = 0;
    let heartPulsePhase = 0;

    // Particle system with increased count for more richness
    const PARTICLE_COUNT = 400;
    const colors = ["#C4B5D4", "#F2D4D4", "#8B2252", "#FFF8F0", "#E8C4D4", "#B8A4CC", "#D4A820", "#FFE060", "#FF6B9D", "#C4A4D4", "#F5D0E0", "#9B59B6"];

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
        delay: Math.random() * 40,
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
    for (let i = 0; i < 80; i++) {
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

    // Sparkle particles for extra magic
    interface Sparkle {
      x: number;
      y: number;
      size: number;
      alpha: number;
      phase: number;
      speed: number;
      active: boolean;
    }
    const sparkles: Sparkle[] = [];
    for (let i = 0; i < 50; i++) {
      sparkles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 1 + Math.random() * 3,
        alpha: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.08,
        active: false,
      });
    }

    let frame = 0;
    const GATHER_START = 60;
    const BLOOM_START = 180;
    const PULSE_START = 280;
    const FINISH = 400;

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

    function drawHeartBorder(
      ctx: CanvasRenderingContext2D,
      progress: number,
      glowIntensity: number,
      pulsePhase: number
    ) {
      if (progress <= 0) return;

      ctx.save();
      ctx.globalAlpha = progress * 0.9;
      
      // Main thick heart border
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const t = (i / 400) * Math.PI * 2;
        const x = cx + heartX(t) * scale;
        const y = cy + heartY(t) * scale;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Thick border with pulsing effect
      const pulseWidth = 4 + Math.sin(pulsePhase) * 1.5;
      ctx.lineWidth = pulseWidth;
      ctx.strokeStyle = `rgba(196, 181, 212, ${0.8 + glowIntensity * 0.2})`;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Inner glowing border
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(139, 34, 82, ${0.6 + glowIntensity * 0.3})`;
      ctx.stroke();

      // Outer glow effect
      if (glowIntensity > 0.3) {
        ctx.shadowColor = `rgba(196, 181, 212, ${glowIntensity * 0.5})`;
        ctx.shadowBlur = 20 + glowIntensity * 30;
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255, 248, 240, ${glowIntensity * 0.4})`;
        ctx.stroke();
      }

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

      // Update heart border animation
      if (frame > BLOOM_START + 20) {
        heartBorderProgress = Math.min(1, (frame - BLOOM_START - 20) / 80);
        heartGlowIntensity = Math.min(1, (frame - BLOOM_START - 60) / 60);
        heartPulsePhase += 0.08;
        
        // Draw heart border
        drawHeartBorder(ctx, heartBorderProgress, heartGlowIntensity, heartPulsePhase);
      }

      // Update & draw particles
      particles.forEach((p) => {
        if (frame < p.delay) return;

        if (frame < GATHER_START) {
          p.alpha = Math.min(0.6, p.alpha + 0.03);
          p.x += (Math.random() - 0.5) * 0.5;
          p.y += (Math.random() - 0.5) * 0.5;
        } else if (frame < BLOOM_START) {
          const progress = (frame - GATHER_START) / (BLOOM_START - GATHER_START);
          p.x += (p.tx - p.x) * 0.05;
          p.y += (p.ty - p.y) * 0.05;
          p.alpha = Math.min(1, p.alpha + 0.04);
          p.phase = "gather";
        } else if (frame < PULSE_START) {
          p.phase = "bloom";
          p.alpha = Math.min(1, p.alpha + 0.02);
          p.angle += p.speed;
          // Enhanced swirling with secondary movement
          const swirlX = Math.cos(p.angle * 2 + frame * 0.02) * p.radius * 0.3;
          const swirlY = Math.sin(p.angle * 2 + frame * 0.02) * p.radius * 0.3;
          p.x = p.tx + Math.cos(p.angle) * p.radius * 0.5 + swirlX;
          p.y = p.ty + Math.sin(p.angle) * p.radius * 0.5 + swirlY;
        } else if (frame < FINISH) {
          p.phase = "pulse";
          const pulseProgress = (frame - PULSE_START) / (FINISH - PULSE_START);
          p.alpha = 1 - pulseProgress * 0.3;
          p.angle += p.speed * 1.5;
          // Enhanced pulsing with variable radius
          const pulseRadius = p.radius * (1 + Math.sin(frame * 0.1 + p.angle) * 0.3);
          p.x = p.tx + Math.cos(p.angle) * pulseRadius;
          p.y = p.ty + Math.sin(p.angle) * pulseRadius;
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
          
          // Enhanced realistic movement with wind gusts
          const windEffect = Math.sin(frame * 0.02 + i * 0.5) * 0.8;
          const liftEffect = Math.cos(frame * 0.03 + i * 0.3) * 0.3;
          
          petal.x += petal.vx + Math.sin(petal.wobble) * 0.5 + windEffect;
          petal.y += petal.vy + liftEffect;
          petal.rotation += petal.rotSpeed + Math.sin(frame * 0.01 + i) * 0.02;
          petal.vx += Math.sin(frame * 0.015 + i) * 0.008;
          
          // Size variation for depth perception
          const depthScale = 0.8 + Math.sin(frame * 0.005 + i) * 0.2;
          
          if (petal.y > H + 20) {
            petal.y = -20;
            petal.x = Math.random() * W;
            petal.alpha = 0;
          }
          drawPetal(ctx, petal.x, petal.y, petal.size * depthScale, petal.rotation, petal.color, petal.alpha);
        });
      }

      // Sparkle particles around heart
      if (frame > BLOOM_START + 40) {
        sparkles.forEach((sparkle, i) => {
          if (frame > BLOOM_START + 40 + i * 3) {
            sparkle.active = true;
          }
          if (!sparkle.active) return;
          
          sparkle.phase += sparkle.speed;
          sparkle.alpha = (Math.sin(sparkle.phase) + 1) / 2 * 0.8;
          
          // Position sparkles around heart shape
          const t = (i / sparkles.length) * Math.PI * 2 + frame * 0.01;
          const heartRadius = scale * 1.2;
          sparkle.x = cx + heartX(t) * heartRadius + (Math.random() - 0.5) * 10;
          sparkle.y = cy + heartY(t) * heartRadius + (Math.random() - 0.5) * 10;
          
          ctx.save();
          ctx.globalAlpha = sparkle.alpha;
          ctx.beginPath();
          ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
          ctx.fillStyle = "#FFF8F0";
          ctx.fill();
          
          // Add glow to sparkles
          ctx.shadowColor = "#C4B5D4";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        });
      }

      // Lily blooms around heart center (decorative) with more variety
      if (frame > BLOOM_START + 30) {
        const bloomProgress = Math.min(1, (frame - BLOOM_START - 30) / 60);
        const lilyPositions = [
          { x: cx - scale * 8, y: cy - scale * 6, color: "#F2D4D4", type: "lily" },
          { x: cx + scale * 8, y: cy - scale * 6, color: "#C4B5D4", type: "rose" },
          { x: cx, y: cy + scale * 10, color: "#FFF8F0", type: "tulip" },
          { x: cx - scale * 14, y: cy + scale * 2, color: "#E8C4D4", type: "lily" },
          { x: cx + scale * 14, y: cy + scale * 2, color: "#C4B5D4", type: "rose" },
          { x: cx - scale * 6, y: cy + scale * 14, color: "#D4A820", type: "lily" },
          { x: cx + scale * 6, y: cy + scale * 14, color: "#FFE060", type: "tulip" },
          { x: cx - scale * 10, y: cy - scale * 12, color: "#FF6B9D", type: "rose" },
          { x: cx + scale * 10, y: cy - scale * 12, color: "#C4A4D4", type: "lily" },
        ];

        lilyPositions.forEach((pos, idx) => {
          const staggeredProgress = Math.min(1, (frame - BLOOM_START - 30 - idx * 5) / 60);
          if (staggeredProgress <= 0) return;
          
          const s = (scale * 1.1) * staggeredProgress;
          const petalCount = pos.type === "rose" ? 8 : (pos.type === "tulip" ? 6 : 6);
          const swayAngle = Math.sin(frame * 0.03 + idx) * 0.1;
          
          for (let p = 0; p < petalCount; p++) {
            const angle = (p / petalCount) * Math.PI * 2 + swayAngle;
            const petalSize = pos.type === "rose" ? s * (1 - p * 0.06) : s;
            const breathingScale = 1 + Math.sin(frame * 0.05 + p * 0.5) * 0.05;
            drawLilyPetal(ctx, pos.x, pos.y, petalSize * breathingScale, angle, pos.color, 0.6 * staggeredProgress);
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
          ctx.globalAlpha = 0.8 * staggeredProgress;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // Title text fade in with enhanced effect
      if (frame > PULSE_START) {
        const textProgress = Math.min(1, (frame - PULSE_START) / 50);
        const textGlow = Math.sin(frame * 0.1) * 0.1 + 0.9;
        
        ctx.save();
        ctx.globalAlpha = textProgress * 0.95;
        
        // Text glow effect
        ctx.shadowColor = `rgba(196, 181, 212, ${textGlow * 0.3})`;
        ctx.shadowBlur = 15 * textProgress;
        
        ctx.fillStyle = "#FFF8F0";
        ctx.font = `300 ${Math.min(W * 0.04, 22)}px 'DM Sans', sans-serif`;
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.3em";
        
        // Subtle floating animation
        const floatY = Math.sin(frame * 0.05) * 3;
        ctx.fillText("for you", cx, cy + scale * 18 + floatY);
        
        ctx.restore();
      }

      // Complete
      if (frame >= FINISH + 20) {
        cancelAnimationFrame(animFrameRef.current);
        if (containerRef.current) {
          containerRef.current.style.transition = "opacity 1.0s ease";
          containerRef.current.style.opacity = "0";
          setTimeout(onComplete, 1100);
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