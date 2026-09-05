"use client";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";
import ConfettiBurst from "@/components/shared/ConfettiBurst";
import AnimatedStickers from "@/components/shared/AnimatedStickers";

interface BirthdayCakeProps {
  onWishMade?: () => void;
  recipientName?: string;
}

export default function BirthdayCake({ onWishMade, recipientName = "Friend" }: BirthdayCakeProps) {
  const [wishState, setWishState] = useState<"idle" | "dimming" | "blowing" | "burst" | "done">("idle");
  const [candlesLit, setCandlesLit] = useState(false);
  const [cakeSliding, setCakeSliding] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const initialized = useRef(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      // Animate cake sliding in from bottom
      const cakeWrapper = section.querySelector(".cake-wrapper");
      gsap.fromTo(
        cakeWrapper,
        { y: 300, opacity: 0, rotation: 5 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            onEnter: () => {
              setCakeSliding(true);
              setTimeout(() => setCandlesLit(true), 1500);
            },
          },
        }
      );

      // Animate cake layers in sequence
      const layers = section.querySelectorAll(".cake-layer");
      gsap.fromTo(
        layers,
        { scaleY: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.5)",
          delay: 0.5,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Enhanced balloons with more variety
      const balloons = section.querySelectorAll(".balloon");
      gsap.fromTo(
        balloons,
        { y: 300, opacity: 0, scale: 0.5 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.8,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Float balloons with more natural movement
      balloons.forEach((balloon, i) => {
        gsap.to(balloon, {
          y: "-=30",
          x: "+=10",
          rotation: (i % 2 === 0 ? 5 : -5),
          duration: 3 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // Birthday text with enhanced animation
      gsap.fromTo(
        section.querySelector(".birthday-title"),
        { opacity: 0, scale: 0.5, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Age number "16" candle animation
      const ageCandle = section.querySelector(".age-candle");
      gsap.fromTo(
        ageCandle,
        { scale: 0, rotation: -10 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          delay: 1.5,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    };

    initGSAP();
  }, []);

  // Swipe gesture handling for cute cake animation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      // Horizontal swipe detected
      triggerCuteAnimation();
    }
  };

  const triggerCuteAnimation = async () => {
    if (isSwiped) return;
    setIsSwiped(true);

    const { gsap } = await import("gsap");
    const cakeWrapper = sectionRef.current?.querySelector(".cake-wrapper");
    if (!cakeWrapper) return;

    // Cute bounce and wiggle animation
    gsap.to(cakeWrapper, {
      rotation: 10,
      duration: 0.15,
      ease: "power2.out",
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        gsap.to(cakeWrapper, {
          scale: 1.1,
          duration: 0.2,
          ease: "back.out(1.7)",
          yoyo: true,
          repeat: 1,
        });
      },
    });

    // Add floating hearts on swipe
    const container = sectionRef.current;
    if (container) {
      for (let i = 0; i < 10; i++) {
        const heart = document.createElement("div");
        heart.textContent = "💕";
        heart.style.cssText = `
          position: absolute;
          left: ${40 + Math.random() * 20}%;
          top: ${40 + Math.random() * 20}%;
          font-size: ${1.5 + Math.random()}rem;
          pointer-events: none;
          z-index: 100;
        `;
        container.appendChild(heart);
        
        gsap.to(heart, {
          y: -200,
          x: (Math.random() - 0.5) * 100,
          opacity: 0,
          duration: 1.5 + Math.random(),
          ease: "power2.out",
          onComplete: () => heart.remove(),
        });
      }
    }

    setTimeout(() => setIsSwiped(false), 2000);
  };

  const handleWish = async () => {
    if (wishState !== "idle") return;
    setWishState("dimming");

    setTimeout(() => {
      setWishState("blowing");
      setTimeout(() => {
        setCandlesLit(false);
        setWishState("burst");
        startParticleBurst();
        setTimeout(() => {
          setWishState("done");
          onWishMade?.();
        }, 2500);
      }, 1500);
    }, 1000);
  };

  const startParticleBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H * 0.4;

    const colors = ["#C4B5D4", "#F2D4D4", "#8B2252", "#FFF8F0", "#FFD700", "#E8C4D4", "#4A5E4A", "#FF6B9D"];

    interface Burst {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      gravity: number;
      isHeart: boolean;
      isConfetti: boolean;
    }

    const bursts: Burst[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      const type = Math.random();
      bursts.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 8,
        alpha: 1,
        gravity: 0.12,
        isHeart: type > 0.6,
        isConfetti: type > 0.8,
      });
    }

    let frame = 0;
    function animateBurst() {
      animRef.current = requestAnimationFrame(animateBurst);
      ctx!.clearRect(0, 0, W, H);

      bursts.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += b.gravity;
        b.vx *= 0.99; // Air resistance
        b.alpha -= 0.008;
        if (b.alpha <= 0) return;

        ctx!.save();
        ctx!.globalAlpha = b.alpha;
        
        if (b.isConfetti) {
          // Confetti pieces
          ctx!.fillStyle = b.color;
          ctx!.translate(b.x, b.y);
          ctx!.rotate(frame * 0.1 + b.x * 0.01);
          ctx!.fillRect(-b.size/2, -b.size/2, b.size, b.size * 0.6);
        } else if (b.isHeart) {
          // Heart shapes
          ctx!.fillStyle = b.color;
          const hs = b.size * 0.8;
          ctx!.beginPath();
          ctx!.moveTo(b.x, b.y + hs * 0.3);
          ctx!.bezierCurveTo(b.x, b.y, b.x - hs, b.y, b.x - hs, b.y + hs * 0.3);
          ctx!.bezierCurveTo(b.x - hs, b.y + hs * 0.7, b.x, b.y + hs * 1.1, b.x, b.y + hs * 1.3);
          ctx!.bezierCurveTo(b.x, b.y + hs * 1.1, b.x + hs, b.y + hs * 0.7, b.x + hs, b.y + hs * 0.3);
          ctx!.bezierCurveTo(b.x + hs, b.y, b.x, b.y, b.x, b.y + hs * 0.3);
          ctx!.fill();
        } else {
          // Sparkles
          ctx!.fillStyle = b.color;
          ctx!.beginPath();
          ctx!.arc(b.x, b.y, b.size * 0.5, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      });

      frame++;
      if (frame > 180) {
        cancelAnimationFrame(animRef.current);
        ctx!.clearRect(0, 0, W, H);
      }
    }
    animateBurst();
  };

  const age = birthdayConfig.age || 16;

  return (
    <div
      ref={sectionRef}
      className={`birthday-section ${wishState === "dimming" || wishState === "blowing" ? "birthday-dimmed" : ""}`}
    >
      {/* Confetti burst on wish completion */}
      {wishState === "burst" && <ConfettiBurst trigger={true} onComplete={() => {}} />}

      {/* Animated stickers throughout */}
      <AnimatedStickers type="balloons" count={4} />
      <AnimatedStickers type="hearts" count={5} />
      <AnimatedStickers type="flowers" count={6} />
      <AnimatedStickers type="stars" count={4} />

      {/* Canvas for burst particles */}
      <canvas ref={canvasRef} className="burst-canvas" aria-hidden="true" />

      {/* Enhanced balloons with more variety */}
      <div className="balloons-container" aria-hidden="true">
        {[
          { color: "#C4B5D4", x: "5%", delay: 0 },
          { color: "#F2D4D4", x: "12%", delay: 0.2 },
          { color: "#8B2252", x: "18%", delay: 0.4 },
          { color: "#FF6B9D", x: "70%", delay: 0.1 },
          { color: "#C4B5D4", x: "78%", delay: 0.3 },
          { color: "#4A5E4A", x: "85%", delay: 0.5 },
          { color: "#FFB347", x: "92%", delay: 0.2 },
          { color: "#87CEEB", x: "8%", delay: 0.6 },
        ].map((b, i) => (
          <div key={i} className="balloon" style={{ left: b.x, animationDelay: `${b.delay}s` }}>
            <svg width="60" height="75" viewBox="0 0 60 75" fill="none">
              <ellipse cx="30" cy="32" rx="26" ry="30" fill={b.color} opacity="0.9" />
              <ellipse cx="22" cy="22" rx="8" ry="5" fill="white" opacity="0.4" transform="rotate(-30 22 22)" />
              <path d="M 30 62 Q 34 67 30 72 Q 26 67 30 62" stroke={b.color} strokeWidth="2" fill="none" opacity="0.7" />
              <line x1="30" y1="62" x2="30" y2="75" stroke={b.color} strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>
        ))}
      </div>

      {/* Birthday text */}
      <div className="birthday-header">
        <p className="birthday-eyebrow">Today is your special day</p>
        <h2 className="birthday-title">Happy {age}th Birthday! 🎂</h2>
        <p className="birthday-subtitle">
          {recipientName}, every year you get more wonderful.
        </p>
      </div>

      {/* Cake with enhanced animation */}
      <div 
        className="cake-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          width="220"
          height="250"
          viewBox="0 0 220 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cake-svg"
          role="img"
          aria-label={`Birthday cake with ${age} candle`}
        >
          {/* Enhanced plate */}
          <ellipse cx="110" cy="235" rx="95" ry="15" fill="#2A1F3D" opacity="0.5" />
          <ellipse cx="110" cy="230" rx="90" ry="12" fill="#C4B5D4" opacity="0.6" />
          <ellipse cx="110" cy="228" rx="85" ry="8" fill="#D4C5E4" opacity="0.4" />

          {/* Bottom tier */}
          <rect x="25" y="170" width="170" height="55" rx="10" fill="#8B2252" className="cake-layer" />
          <ellipse cx="110" cy="170" rx="85" ry="12" fill="#A0284A" className="cake-layer" />
          {/* Enhanced frosting drips bottom */}
          {[35, 55, 75, 95, 115, 135, 155, 175].map((x, i) => (
            <ellipse key={i} cx={x} cy="170" rx="8" ry="6" fill="#FFF8F0" opacity="0.95" />
          ))}

          {/* Middle tier */}
          <rect x="40" y="120" width="140" height="50" rx="8" fill="#C4B5D4" className="cake-layer" />
          <ellipse cx="110" cy="120" rx="70" ry="10" fill="#D4C5E4" className="cake-layer" />
          {/* Enhanced frosting drips middle */}
          {[50, 70, 90, 110, 130, 150, 170].map((x, i) => (
            <ellipse key={i} cx={x} cy="120" rx="7" ry="5" fill="#FFF8F0" opacity="0.95" />
          ))}

          {/* Top tier */}
          <rect x="60" y="78" width="100" height="42" rx="6" fill="#F2D4D4" className="cake-layer" />
          <ellipse cx="110" cy="78" rx="50" ry="8" fill="#F8E0E0" className="cake-layer" />
          {/* Enhanced frosting drips top */}
          {[70, 85, 100, 115, 130, 145].map((x, i) => (
            <ellipse key={i} cx={x} cy="78" rx="6" ry="4" fill="#FFF8F0" opacity="0.95" />
          ))}

          {/* Enhanced flowers on cake */}
          {[{ cx: 55, cy: 195 }, { cx: 110, cy: 192 }, { cx: 165, cy: 195 }].map((pos, fi) => (
            <g key={fi}>
              {Array.from({ length: 6 }).map((_, p) => {
                const a = (p / 6) * Math.PI * 2;
                return (
                  <ellipse
                    key={p}
                    cx={pos.cx + Math.cos(a) * 8}
                    cy={pos.cy + Math.sin(a) * 8}
                    rx="3.5"
                    ry="6"
                    transform={`rotate(${(p / 6) * 360} ${pos.cx + Math.cos(a) * 8} ${pos.cy + Math.sin(a) * 8})`}
                    fill={["#FFF8F0", "#C4B5D4", "#F2D4D4", "#FF6B9D"][fi]}
                    opacity="0.95"
                  />
                );
              })}
              <circle cx={pos.cx} cy={pos.cy} r="3.5" fill="#FFE4B5" />
            </g>
          ))}

          {/* Single "16" candle instead of multiple */}
          <g className="age-candle">
            {/* Candle body */}
            <rect x="95" y="30" width="30" height="48" rx="15" fill="#FFD700" className="cake-layer" />
            <rect x="100" y="30" width="20" height="48" rx="10" fill="#FFC700" opacity="0.5" />
            
            {/* Candle decorative bands */}
            <rect x="95" y="45" width="30" height="4" fill="#FFF8F0" opacity="0.8" />
            <rect x="95" y="60" width="30" height="4" fill="#FFF8F0" opacity="0.8" />
            
            {/* "16" text on candle */}
            <text x="110" y="55" fontSize="14" fontWeight="bold" fill="#8B2252" textAnchor="middle" dominantBaseline="middle">
              {age}
            </text>
            
            {/* Flame */}
            {candlesLit && (
              <>
                <ellipse
                  cx="110"
                  cy="25"
                  rx="6"
                  ry="8"
                  fill="#FFD700"
                  opacity="0.95"
                  className="candle-flame"
                />
                <ellipse cx="110" cy="23" rx="3" ry="4" fill="#FF8C00" opacity="0.9" className="candle-flame" />
                <ellipse cx="110" cy="21" rx="1.5" ry="2.5" fill="#FFF" opacity="0.95" className="candle-flame" />
                {/* Enhanced glow */}
                <ellipse cx="110" cy="25" rx="12" ry="12" fill="#FFD700" opacity="0.2" />
                <ellipse cx="110" cy="25" rx="18" ry="18" fill="#FFD700" opacity="0.1" />
              </>
            )}
          </g>
        </svg>

        {/* Enhanced floating sparkles */}
        <div className="sparkles-container" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${5 + Math.random() * 70}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${0.8 + Math.random() * 0.8}rem`,
              }}
            >
              {["✦", "✨", "⭐", "💫"][i % 4]}
            </div>
          ))}
        </div>
      </div>

      {/* Wish button */}
      {wishState === "idle" && (
        <button className="wish-btn" onClick={handleWish} aria-label="Make a wish">
          <span className="wish-btn-glow" />
          <span className="wish-btn-text">Make a Wish ✨</span>
        </button>
      )}

      {wishState === "dimming" && (
        <p className="wish-prompt">Close your eyes... 🕯️</p>
      )}
      {wishState === "blowing" && (
        <p className="wish-prompt">Make your wish... 💫</p>
      )}
      {wishState === "done" && (
        <p className="wish-done">Your wish has been sent to the universe 🌸</p>
      )}
    </div>
  );
}