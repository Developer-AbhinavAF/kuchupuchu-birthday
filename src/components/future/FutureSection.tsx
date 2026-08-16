"use client";
import { useEffect, useRef } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

export default function FutureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized?.current) return;
    initialized.current = true;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap?.registerPlugin(ScrollTrigger);

      const section = sectionRef?.current;
      if (!section) return;

      // Horizon transition: dark → dawn
      gsap?.to(section?.querySelector(".future-sky"), {
        background: "linear-gradient(to bottom, #1a0a2e 0%, #3d1a5c 30%, #8B2252 60%, #F2A07A 85%, #FFF8F0 100%)",
        duration: 2,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 40%",
          scrub: true,
        },
      });

      // Stars fade out
      gsap?.to(section?.querySelectorAll(".future-star"), {
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "center 30%",
          scrub: true,
        },
      });

      // Dawn flowers bloom
      const dawnFlowers = section?.querySelectorAll(".dawn-flower");
      gsap?.fromTo(
        dawnFlowers,
        { scale: 0, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Text lines
      const textLines = section?.querySelectorAll(".future-line");
      gsap?.fromTo(
        textLines,
        { opacity: 0, y: 30, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.5,
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
  }, []);

  return (
    <div ref={sectionRef} className="future-section">
      {/* Sky gradient background */}
      <div
        className="future-sky"
        style={{ background: "linear-gradient(to bottom, #0A0D1A 0%, #1a0a2e 40%, #2A1F3D 100%)" }}
        aria-hidden="true"
      />
      {/* Stars */}
      <div className="future-stars" aria-hidden="true">
        {Array.from({ length: 40 })?.map((_, i) => (
          <div
            key={i}
            className="future-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      {/* Horizon dawn flowers */}
      <div className="dawn-flowers-row" aria-hidden="true">
        {[
          { color: "#F2D4D4", size: 30, x: "10%" },
          { color: "#C4B5D4", size: 40, x: "25%" },
          { color: "#8B2252", size: 35, x: "40%" },
          { color: "#FFF8F0", size: 45, x: "55%" },
          { color: "#C4B5D4", size: 38, x: "70%" },
          { color: "#F2D4D4", size: 32, x: "85%" },
        ]?.map((f, i) => (
          <div key={i} className="dawn-flower" style={{ left: f?.x }}>
            <svg width={f?.size} height={f?.size * 1.4} viewBox="0 0 50 70" fill="none">
              <line x1="25" y1="70" x2="25" y2="28" stroke="#4A5E4A" strokeWidth="2" />
              {Array.from({ length: 6 })?.map((_, p) => {
                const a = (p / 6) * Math.PI * 2;
                return (
                  <ellipse
                    key={p}
                    cx={25 + Math.cos(a) * 14}
                    cy={28 + Math.sin(a) * 14}
                    rx="5"
                    ry="9"
                    transform={`rotate(${(p / 6) * 360} ${25 + Math.cos(a) * 14} ${28 + Math.sin(a) * 14})`}
                    fill={f?.color}
                    opacity="0.85"
                  />
                );
              })}
              <circle cx="25" cy="28" r="4" fill="#FFE4B5" />
            </svg>
          </div>
        ))}
      </div>
      {/* Future text */}
      <div className="future-text-container">
        {birthdayConfig?.futureText?.map((line, i) => (
          <p
            key={i}
            className={`future-line ${i === birthdayConfig?.futureText?.length - 1 ? "future-line-final" : ""}`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}