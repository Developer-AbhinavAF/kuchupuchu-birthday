"use client";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

export default function LetterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
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

      gsap.fromTo(
        section.querySelector(".envelope-container"),
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    };

    initGSAP();
  }, []);

  const handleOpen = async () => {
    if (isOpen) return;
    setIsOpen(true);
    setIsRevealing(true);

    const { gsap } = await import("gsap");
    const section = sectionRef.current;
    if (!section) return;

    // Animate letter paragraphs in sequence
    const paras = section.querySelectorAll(".letter-para");
    gsap.fromTo(
      paras,
      { opacity: 0, y: 20, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.5,
        ease: "power2.out",
        delay: 0.8,
        onComplete: () => setIsRevealing(false),
      }
    );

    const flowerAccents = section.querySelectorAll(".letter-flower-accent");
    gsap.fromTo(
      flowerAccents,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.4,
        ease: "back.out(2)",
        delay: 1.5,
      }
    );
  };

  return (
    <div ref={sectionRef} className="letter-section">
      {/* Floral background */}
      <div className="letter-bg" aria-hidden="true">
        <div className="letter-bg-glow" />
      </div>

      {/* Floral frame decorations */}
      <div className="letter-floral-left" aria-hidden="true">
        <LetterFloral side="left" />
      </div>
      <div className="letter-floral-right" aria-hidden="true">
        <LetterFloral side="right" />
      </div>

      {!isOpen ? (
        /* Envelope */
        <div className="envelope-container">
          <p className="letter-eyebrow">Something I wrote for you</p>
          <div
            className="envelope"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label="Open the letter"
            onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          >
            <div className="envelope-body">
              <div className="envelope-flap" />
              <div className="envelope-front">
                <div className="envelope-seal">
                  <LilySeal />
                </div>
                <p className="envelope-label">For You</p>
                <p className="envelope-hint">Click to open 💌</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Letter paper */
        <div className="letter-paper-container">
          <div className="letter-paper">
            {/* Paper texture lines */}
            <div className="paper-lines" aria-hidden="true">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="paper-line" />
              ))}
            </div>

            {/* Letter content */}
            <div className="letter-content">
              <div className="letter-flower-accent letter-top-flower" aria-hidden="true">
                <SmallLily color="#C4B5D4" />
              </div>

              <h2 className="letter-heading">{birthdayConfig.letterHeading}</h2>

              {birthdayConfig.letterParagraphs.map((para, i) => (
                <div key={i} className="letter-para-wrapper">
                  <p className="letter-para">{para}</p>
                  {i === 1 && (
                    <div className="letter-flower-accent inline-flower" aria-hidden="true">
                      <SmallLily color="#F2D4D4" />
                    </div>
                  )}
                  {i === 3 && (
                    <div className="letter-flower-accent inline-flower" aria-hidden="true">
                      <SmallLily color="#8B2252" />
                    </div>
                  )}
                </div>
              ))}

              <div className="letter-closing">
                <p className="letter-closing-text">{birthdayConfig.letterClosing}</p>
                <p className="letter-signature">{birthdayConfig.senderName}</p>
              </div>

              <div className="letter-flower-accent letter-bottom-flower" aria-hidden="true">
                <SmallLily color="#C4B5D4" />
                <SmallLily color="#F2D4D4" />
                <SmallLily color="#8B2252" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LilySeal() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="#8B2252" opacity="0.9" />
      {Array.from({ length: 6 }).map((_, p) => {
        const a = (p / 6) * Math.PI * 2;
        return (
          <ellipse
            key={p}
            cx={30 + Math.cos(a) * 14}
            cy={30 + Math.sin(a) * 14}
            rx="5"
            ry="9"
            transform={`rotate(${(p / 6) * 360} ${30 + Math.cos(a) * 14} ${30 + Math.sin(a) * 14})`}
            fill="#F2D4D4"
            opacity="0.9"
          />
        );
      })}
      <circle cx="30" cy="30" r="5" fill="#FFE4B5" />
    </svg>
  );
}

function SmallLily({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 6 }).map((_, p) => {
        const a = (p / 6) * Math.PI * 2;
        return (
          <ellipse
            key={p}
            cx={15 + Math.cos(a) * 8}
            cy={15 + Math.sin(a) * 8}
            rx="3"
            ry="6"
            transform={`rotate(${(p / 6) * 360} ${15 + Math.cos(a) * 8} ${15 + Math.sin(a) * 8})`}
            fill={color}
            opacity="0.85"
          />
        );
      })}
      <circle cx="15" cy="15" r="3" fill="#FFE4B5" />
    </svg>
  );
}

function LetterFloral({ side }: { side: "left" | "right" }) {
  const flip = side === "right" ? "scale(-1,1)" : "";
  return (
    <svg width="140" height="400" viewBox="0 0 140 400" fill="none" xmlns="http://www.w3.org/2000/svg" transform={flip}>
      <path d="M 70 400 Q 65 300 60 200 Q 55 120 70 40" stroke="#4A5E4A" strokeWidth="2" fill="none" opacity="0.6" />
      {[
        { x: 65, y: 340, size: 16, color: "#C4B5D4" },
        { x: 55, y: 260, size: 20, color: "#F2D4D4" },
        { x: 75, y: 190, size: 14, color: "#8B2252" },
        { x: 60, y: 120, size: 18, color: "#C4B5D4" },
        { x: 72, y: 60, size: 12, color: "#F2D4D4" },
      ].map((lily, i) => (
        <g key={i}>
          {Array.from({ length: 6 }).map((_, p) => {
            const a = (p / 6) * Math.PI * 2;
            return (
              <ellipse
                key={p}
                cx={lily.x + Math.cos(a) * lily.size * 0.7}
                cy={lily.y + Math.sin(a) * lily.size * 0.7}
                rx={lily.size * 0.3}
                ry={lily.size * 0.6}
                transform={`rotate(${(p / 6) * 360} ${lily.x + Math.cos(a) * lily.size * 0.7} ${lily.y + Math.sin(a) * lily.size * 0.7})`}
                fill={lily.color}
                opacity="0.6"
              />
            );
          })}
          <circle cx={lily.x} cy={lily.y} r={lily.size * 0.2} fill="#FFE4B5" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}