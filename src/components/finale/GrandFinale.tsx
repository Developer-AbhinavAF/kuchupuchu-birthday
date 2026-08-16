"use client";
import { useEffect, useRef } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

export default function GrandFinale() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Canvas ambient particles
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const W = window.innerWidth;
        const H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        interface FinaleParticle {
          x: number;
          y: number;
          vx: number;
          vy: number;
          size: number;
          color: string;
          alpha: number;
          type: "petal" | "star" | "sparkle";
        }

        const particles: FinaleParticle[] = Array.from({ length: 60 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.3 - Math.random() * 0.5,
          size: 3 + Math.random() * 8,
          color: ["#C4B5D4", "#F2D4D4", "#8B2252", "#FFF8F0", "#E8C4D4"][Math.floor(Math.random() * 5)],
          alpha: 0.3 + Math.random() * 0.5,
          type: (["petal", "star", "sparkle"] as const)[Math.floor(Math.random() * 3)],
        }));

        function animateFinale() {
          animRef.current = requestAnimationFrame(animateFinale);
          ctx!.clearRect(0, 0, W, H);

          particles.forEach((p) => {
            p.x += p.vx + Math.sin(Date.now() * 0.001 + p.y) * 0.2;
            p.y += p.vy;
            if (p.y < -20) p.y = H + 20;

            ctx!.save();
            ctx!.globalAlpha = p.alpha * (0.7 + Math.sin(Date.now() * 0.002 + p.x) * 0.3);

            if (p.type === "petal") {
              ctx!.fillStyle = p.color;
              ctx!.beginPath();
              ctx!.ellipse(p.x, p.y, p.size * 0.4, p.size, Math.sin(Date.now() * 0.001) * 0.5, 0, Math.PI * 2);
              ctx!.fill();
            } else if (p.type === "star") {
              ctx!.fillStyle = "#FFF8F0";
              ctx!.beginPath();
              ctx!.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
              ctx!.fill();
            } else {
              ctx!.fillStyle = p.color;
              ctx!.font = `${p.size * 1.5}px serif`;
              ctx!.fillText("✦", p.x, p.y);
            }
            ctx!.restore();
          });
        }

        animateFinale();
      }
    }

    // GSAP animations
    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      // Staggered lily bloom reveal
      const finaleLilies = section.querySelectorAll(".finale-lily");
      gsap.fromTo(
        finaleLilies,
        { scale: 0, opacity: 0, rotate: -20 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // HAPPY BIRTHDAY text
      const letters = section.querySelectorAll(".hb-letter");
      gsap.fromTo(
        letters,
        { opacity: 0, y: -60, rotateX: 90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Message
      gsap.fromTo(
        section.querySelector(".finale-message"),
        { opacity: 0, y: 40, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power2.out",
          delay: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Pulsing heart
      gsap.to(section.querySelector(".finale-heart"), {
        scale: 1.08,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    initGSAP();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const hbText = "HAPPY BIRTHDAY";

  return (
    <div ref={sectionRef} className="finale-section">
      {/* Canvas ambient */}
      <canvas ref={canvasRef} className="finale-canvas" aria-hidden="true" />

      {/* Dense lily garden background */}
      <div className="finale-garden" aria-hidden="true">
        <FinaleGarden />
      </div>

      {/* Main content */}
      <div className="finale-content">
        {/* Animated HAPPY BIRTHDAY */}
        <div className="hb-container" aria-label="Happy Birthday">
          {hbText.split("").map((char, i) => (
            <span
              key={i}
              className={`hb-letter ${char === " " ? "hb-space" : ""}`}
              aria-hidden={char === " "}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Heart */}
        <div className="finale-heart" aria-hidden="true">
          <svg width="60" height="55" viewBox="0 0 60 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 30 50 Q 5 35 5 18 Q 5 5 18 5 Q 24 5 30 12 Q 36 5 42 5 Q 55 5 55 18 Q 55 35 30 50 Z"
              fill="#8B2252"
              opacity="0.9"
            />
            <path
              d="M 20 15 Q 18 22 22 28"
              stroke="#F2D4D4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Personal message */}
        <div className="finale-message">
          <p className="finale-main-text">{birthdayConfig.finaleMessage}</p>
          <p className="finale-sub-text">{birthdayConfig.finaleSubMessage}</p>
          <p className="finale-from">— {birthdayConfig.senderName}</p>
        </div>

        {/* Final lily bloom sequence */}
        <div className="finale-bloom-row" aria-hidden="true">
          {[
            { color: "#C4B5D4", size: 35 },
            { color: "#8B2252", size: 45 },
            { color: "#F2D4D4", size: 40 },
            { color: "#FFF8F0", size: 50 },
            { color: "#C4B5D4", size: 40 },
            { color: "#8B2252", size: 45 },
            { color: "#F2D4D4", size: 35 },
          ].map((lily, i) => (
            <div key={i} className="finale-lily">
              <svg
                width={lily.size}
                height={lily.size}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Array.from({ length: 6 }).map((_, p) => {
                  const a = (p / 6) * Math.PI * 2;
                  return (
                    <ellipse
                      key={p}
                      cx={25 + Math.cos(a) * 16}
                      cy={25 + Math.sin(a) * 16}
                      rx="6"
                      ry="11"
                      transform={`rotate(${(p / 6) * 360} ${25 + Math.cos(a) * 16} ${25 + Math.sin(a) * 16})`}
                      fill={lily.color}
                      opacity="0.9"
                    />
                  );
                })}
                <circle cx="25" cy="25" r="5" fill="#FFE4B5" />
              </svg>
            </div>
          ))}
        </div>

        {/* Sparkle row */}
        <div className="finale-sparkle-row" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="finale-sparkle" style={{ animationDelay: `${i * 0.3}s` }}>
              ✦
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinaleGarden() {
  const lilies = [
    { x: 2, y: 70, size: 1.8, color: "#C4B5D4", blur: 3 },
    { x: 8, y: 60, size: 1.4, color: "#F2D4D4", blur: 2 },
    { x: 15, y: 75, size: 2.2, color: "#8B2252", blur: 4 },
    { x: 22, y: 65, size: 1.6, color: "#C4B5D4", blur: 1 },
    { x: 30, y: 80, size: 1.9, color: "#FFF8F0", blur: 3 },
    { x: 38, y: 68, size: 1.5, color: "#F2D4D4", blur: 2 },
    { x: 45, y: 78, size: 2.0, color: "#8B2252", blur: 1 },
    { x: 52, y: 62, size: 1.7, color: "#C4B5D4", blur: 3 },
    { x: 60, y: 74, size: 1.4, color: "#F2D4D4", blur: 2 },
    { x: 68, y: 69, size: 2.1, color: "#8B2252", blur: 4 },
    { x: 75, y: 76, size: 1.6, color: "#FFF8F0", blur: 1 },
    { x: 82, y: 63, size: 1.8, color: "#C4B5D4", blur: 3 },
    { x: 88, y: 71, size: 1.5, color: "#F2D4D4", blur: 2 },
    { x: 95, y: 78, size: 2.0, color: "#8B2252", blur: 1 },
  ];

  return (
    <div className="finale-garden-inner">
      {lilies.map((lily, i) => (
        <div
          key={i}
          className="finale-garden-lily"
          style={{
            left: `${lily.x}%`,
            bottom: `${100 - lily.y}%`,
            filter: `blur(${lily.blur}px)`,
            transform: `scale(${lily.size})`,
            transformOrigin: "bottom center",
          }}
        >
          <svg width="50" height="80" viewBox="0 0 50 80" fill="none">
            <line x1="25" y1="80" x2="25" y2="30" stroke="#4A5E4A" strokeWidth="2" />
            <ellipse cx="10" cy="55" rx="12" ry="5" fill="#4A5E4A" transform="rotate(-25 10 55)" opacity="0.8" />
            {Array.from({ length: 6 }).map((_, p) => {
              const a = (p / 6) * Math.PI * 2;
              return (
                <ellipse
                  key={p}
                  cx={25 + Math.cos(a) * 16}
                  cy={30 + Math.sin(a) * 16}
                  rx="6"
                  ry="11"
                  transform={`rotate(${(p / 6) * 360} ${25 + Math.cos(a) * 16} ${30 + Math.sin(a) * 16})`}
                  fill={lily.color}
                  opacity="0.85"
                />
              );
            })}
            <circle cx="25" cy="30" r="5" fill="#FFE4B5" />
          </svg>
        </div>
      ))}
    </div>
  );
}