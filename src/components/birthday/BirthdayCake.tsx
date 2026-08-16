"use client";
import { useEffect, useRef, useState } from "react";

interface BirthdayCakeProps {
  onWishMade?: () => void;
  recipientName?: string;
}

export default function BirthdayCake({ onWishMade, recipientName = "Friend" }: BirthdayCakeProps) {
  const [wishState, setWishState] = useState<"idle" | "dimming" | "blowing" | "burst" | "done">("idle");
  const [candlesLit, setCandlesLit] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      // Animate cake layers in
      const layers = section.querySelectorAll(".cake-layer");
      gsap.fromTo(
        layers,
        { scaleY: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            onEnter: () => {
              setTimeout(() => setCandlesLit(true), 1200);
            },
          },
        }
      );

      // Balloons
      const balloons = section.querySelectorAll(".balloon");
      gsap.fromTo(
        balloons,
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Float balloons
      balloons.forEach((balloon, i) => {
        gsap.to(balloon, {
          y: "-=20",
          duration: 2 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });

      // Birthday text
      gsap.fromTo(
        section.querySelector(".birthday-title"),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    };

    initGSAP();
  }, []);

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

    const colors = ["#C4B5D4", "#F2D4D4", "#8B2252", "#FFF8F0", "#FFD700", "#E8C4D4", "#4A5E4A"];

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
    }

    const bursts: Burst[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      bursts.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 6,
        alpha: 1,
        gravity: 0.15,
        isHeart: Math.random() > 0.7,
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
        b.alpha -= 0.012;
        if (b.alpha <= 0) return;

        ctx!.save();
        ctx!.globalAlpha = b.alpha;
        if (b.isHeart) {
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
          ctx!.fillStyle = b.color;
          ctx!.beginPath();
          ctx!.arc(b.x, b.y, b.size * 0.5, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      });

      frame++;
      if (frame > 150) {
        cancelAnimationFrame(animRef.current);
        ctx!.clearRect(0, 0, W, H);
      }
    }
    animateBurst();
  };

  const candles = [
    { x: 67, color: "#8B2252" },
    { x: 79, color: "#C4B5D4" },
    { x: 91, color: "#4A5E4A" },
    { x: 103, color: "#8B2252" },
    { x: 115, color: "#C4B5D4" },
  ];

  return (
    <div
      ref={sectionRef}
      className={`birthday-section ${wishState === "dimming" || wishState === "blowing" ? "birthday-dimmed" : ""}`}
    >
      {/* Canvas for burst particles */}
      <canvas ref={canvasRef} className="burst-canvas" aria-hidden="true" />

      {/* Balloons */}
      <div className="balloons-container" aria-hidden="true">
        {[
          { color: "#C4B5D4", x: "10%", delay: 0 },
          { color: "#F2D4D4", x: "20%", delay: 0.3 },
          { color: "#8B2252", x: "75%", delay: 0.1 },
          { color: "#C4B5D4", x: "85%", delay: 0.4 },
          { color: "#4A5E4A", x: "90%", delay: 0.2 },
        ].map((b, i) => (
          <div key={i} className="balloon" style={{ left: b.x, animationDelay: `${b.delay}s` }}>
            <svg width="50" height="65" viewBox="0 0 50 65" fill="none">
              <ellipse cx="25" cy="28" rx="22" ry="26" fill={b.color} opacity="0.85" />
              <ellipse cx="18" cy="18" rx="6" ry="4" fill="white" opacity="0.3" transform="rotate(-30 18 18)" />
              <path d="M 25 54 Q 28 58 25 62 Q 22 58 25 54" stroke={b.color} strokeWidth="1.5" fill="none" opacity="0.6" />
              <line x1="25" y1="54" x2="25" y2="65" stroke={b.color} strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        ))}
      </div>

      {/* Birthday text */}
      <div className="birthday-header">
        <p className="birthday-eyebrow">Today is your day</p>
        <h2 className="birthday-title">Happy Birthday! 🎂</h2>
        <p className="birthday-subtitle">
          {recipientName}, every year you get more wonderful.
        </p>
      </div>

      {/* Cake */}
      <div className="cake-wrapper">
        <svg
          width="200"
          height="220"
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cake-svg"
          role="img"
          aria-label="Birthday cake with candles"
        >
          {/* Plate */}
          <ellipse cx="100" cy="205" rx="85" ry="12" fill="#2A1F3D" opacity="0.4" />
          <ellipse cx="100" cy="200" rx="80" ry="8" fill="#C4B5D4" opacity="0.5" />

          {/* Bottom tier */}
          <rect x="20" y="150" width="160" height="50" rx="8" fill="#8B2252" className="cake-layer" />
          <ellipse cx="100" cy="150" rx="80" ry="10" fill="#A0284A" className="cake-layer" />
          {/* Frosting drips bottom */}
          {[30, 50, 70, 90, 110, 130, 150].map((x, i) => (
            <ellipse key={i} cx={x} cy="150" rx="7" ry="5" fill="#FFF8F0" opacity="0.9" />
          ))}

          {/* Middle tier */}
          <rect x="35" y="105" width="130" height="45" rx="6" fill="#C4B5D4" className="cake-layer" />
          <ellipse cx="100" cy="105" rx="65" ry="8" fill="#D4C5E4" className="cake-layer" />
          {/* Frosting drips middle */}
          {[45, 65, 85, 105, 125, 145].map((x, i) => (
            <ellipse key={i} cx={x} cy="105" rx="6" ry="4" fill="#FFF8F0" opacity="0.9" />
          ))}

          {/* Top tier */}
          <rect x="55" y="68" width="90" height="37" rx="5" fill="#F2D4D4" className="cake-layer" />
          <ellipse cx="100" cy="68" rx="45" ry="7" fill="#F8E0E0" className="cake-layer" />
          {/* Frosting drips top */}
          {[65, 82, 100, 118, 135].map((x, i) => (
            <ellipse key={i} cx={x} cy="68" rx="5" ry="4" fill="#FFF8F0" opacity="0.9" />
          ))}

          {/* Flowers on cake */}
          {[{ cx: 50, cy: 175 }, { cx: 100, cy: 172 }, { cx: 150, cy: 175 }].map((pos, fi) => (
            <g key={fi}>
              {Array.from({ length: 5 }).map((_, p) => {
                const a = (p / 5) * Math.PI * 2;
                return (
                  <ellipse
                    key={p}
                    cx={pos.cx + Math.cos(a) * 7}
                    cy={pos.cy + Math.sin(a) * 7}
                    rx="3"
                    ry="5"
                    transform={`rotate(${(p / 5) * 360} ${pos.cx + Math.cos(a) * 7} ${pos.cy + Math.sin(a) * 7})`}
                    fill={["#FFF8F0", "#C4B5D4", "#F2D4D4"][fi]}
                    opacity="0.9"
                  />
                );
              })}
              <circle cx={pos.cx} cy={pos.cy} r="3" fill="#FFE4B5" />
            </g>
          ))}

          {/* Candles */}
          {candles.map((c, i) => (
            <g key={i}>
              <rect x={c.x - 3} y={44} width="6" height="24" rx="3" fill={c.color} className="cake-layer" />
              {candlesLit && (
                <>
                  <ellipse
                    cx={c.x}
                    cy={41}
                    rx="4"
                    ry="6"
                    fill="#FFD700"
                    opacity="0.9"
                    className="candle-flame"
                  />
                  <ellipse cx={c.x} cy={40} rx="2" ry="3" fill="#FF8C00" opacity="0.8" className="candle-flame" />
                  <ellipse cx={c.x} cy={39} rx="1" ry="2" fill="#FFF" opacity="0.9" className="candle-flame" />
                  {/* Glow */}
                  <ellipse cx={c.x} cy={41} rx="8" ry="8" fill="#FFD700" opacity="0.15" />
                </>
              )}
            </g>
          ))}
        </svg>

        {/* Floating sparkles */}
        <div className="sparkles-container" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✦
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