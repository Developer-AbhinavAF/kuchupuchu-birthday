"use client";
import { useEffect, useRef } from "react";

export default function TulipGarden() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Animate tulip bouquets
      const bouquets = section.querySelectorAll(".tulip-bouquet");
      bouquets.forEach((bouquet, i) => {
        gsap.fromTo(
          bouquet,
          { 
            opacity: 0, 
            y: 100, 
            scale: 0.8,
            rotation: (i % 2 === 0 ? -15 : 15)
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate individual flowers
      const flowers = section.querySelectorAll(".garden-flower");
      flowers.forEach((flower, i) => {
        gsap.fromTo(
          flower,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.3 + i * 0.05,
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Gentle swaying animation
      bouquets.forEach((bouquet, i) => {
        gsap.to(bouquet, {
          rotation: (i % 2 === 0 ? 3 : -3),
          transformOrigin: "bottom center",
          duration: 3 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // Floating petals
      const petals = section.querySelectorAll(".floating-garden-petal");
      petals.forEach((petal, i) => {
        gsap.to(petal, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "random(-45, 45)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        });
      });

      // Text animations
      const textElements = section.querySelectorAll(".garden-text");
      gsap.fromTo(
        textElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    };

    initGSAP();
  }, []);

  return (
    <div ref={sectionRef} className="tulip-garden-section">
      {/* Atmospheric background */}
      <div className="tulip-atmosphere" aria-hidden="true" />

      {/* Fixed rectangle container for flowers */}
      <div className="garden-rectangle" aria-hidden="true">
        {/* Text content */}
        <div className="tulip-text-container">
          <p className="garden-text tulip-eyebrow">A Garden of Love</p>
          <h2 className="garden-text tulip-heading">Where Every Flower Blooms For You</h2>
          <p className="garden-text tulip-subtext">
            Like these tulips, my love for you grows more beautiful each day 🌷
          </p>
        </div>

        {/* Tulip Garden SVG - constrained to rectangle */}
        <div className="tulip-svg-container" aria-hidden="true">
          <svg
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tulip-svg"
          >
            <defs>
              {/* Tulip petal gradients */}
              {[
                { id: "tulip1", colors: ["#FF6B9D", "#FF8FB1", "#FFB3C6"] },
                { id: "tulip2", colors: ["#C4B5D4", "#D4C4E4", "#E4D4F4"] },
                { id: "tulip3", colors: ["#F2D4D4", "#FFE4E4", "#FFF4F4"] },
                { id: "tulip4", colors: ["#FFB347", "#FFC773", "#FFDB9F"] },
                { id: "tulip5", colors: ["#87CEEB", "#A8D8EA", "#C9E8F0"] },
              ].map((tulip) => (
                <radialGradient key={tulip.id} id={`tulip-garden-${tulip.id}Grad`} cx="50%" cy="70%" r="60%">
                  <stop offset="0%" stopColor={tulip.colors[0]} stopOpacity="1" />
                  <stop offset="50%" stopColor={tulip.colors[1]} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={tulip.colors[2]} stopOpacity="0.8" />
                </radialGradient>
              ))}

              {/* Leaf gradient */}
              <linearGradient id="tulip-garden-leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A5E4A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3A4A3A" stopOpacity="0.8" />
              </linearGradient>

              {/* Stem gradient */}
              <linearGradient id="tulip-garden-stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5A7A5A" stopOpacity="1" />
                <stop offset="100%" stopColor="#3A5A3A" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Ground */}
            <ellipse cx="600" cy="580" rx="700" ry="40" fill="url(#tulip-garden-leafGrad)" opacity="0.4" />

            {/* Tulip Bouquets */}
            {[
              { x: 150, y: 550, type: "tulip1", scale: 1.2, rotation: -5 },
              { x: 300, y: 530, type: "tulip2", scale: 1.0, rotation: 3 },
              { x: 450, y: 510, type: "tulip3", scale: 1.3, rotation: -2 },
              { x: 600, y: 490, type: "tulip4", scale: 1.1, rotation: 4 },
              { x: 750, y: 510, type: "tulip5", scale: 1.2, rotation: -3 },
              { x: 900, y: 530, type: "tulip1", scale: 1.0, rotation: 2 },
              { x: 1050, y: 550, type: "tulip2", scale: 1.3, rotation: -4 },
            ].map((bouquet, i) => (
              <g key={i} className="tulip-bouquet" transform={`translate(${bouquet.x}, ${bouquet.y}) rotate(${bouquet.rotation}) scale(${bouquet.scale})`}>
                {/* Stem */}
                <path
                  d="M 0 0 Q 5 50 0 150"
                  stroke="url(#tulip-garden-stemGrad)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Leaves */}
                <path
                  d="M 0 50 Q -30 30 -40 10 Q -20 40 0 50"
                  fill="url(#tulip-garden-leafGrad)"
                  opacity="0.8"
                />
                <path
                  d="M 0 80 Q 30 60 40 40 Q 20 70 0 80"
                  fill="url(#tulip-garden-leafGrad)"
                  opacity="0.8"
                />

                {/* Tulip petals */}
                {Array.from({ length: 6 }).map((_, p) => {
                  const angle = (p / 6) * Math.PI * 2 - Math.PI / 2;
                  const petalLength = 35 * (1 - p * 0.05);
                  return (
                    <g key={p} className="garden-flower">
                      <ellipse
                        cx={Math.cos(angle) * petalLength * 0.4}
                        cy={Math.sin(angle) * petalLength * 0.5 - 15}
                        rx={petalLength * 0.3}
                        ry={petalLength * 0.5}
                        transform={`rotate(${(p / 6) * 360} 0 -15)`}
                        fill={`url(#tulip-garden-${bouquet.type}Grad)`}
                        opacity="0.9"
                      />
                    </g>
                  );
                })}

                {/* Tulip center */}
                <ellipse cx="0" cy="-15" rx="8" ry="5" fill="#FFE4B5" opacity="0.9" />
              </g>
            ))}

            {/* Floating petals - reduced for performance */}
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={i}
                className="floating-garden-petal"
                cx={100 + Math.random() * 1000}
                cy={100 + Math.random() * 400}
                rx={4 + Math.random() * 6}
                ry={8 + Math.random() * 10}
                fill={["#FF6B9D", "#C4B5D4", "#F2D4D4", "#FFB347", "#87CEEB"][i % 5]}
                opacity="0.4"
                transform={`rotate(${Math.random() * 360} ${100 + Math.random() * 1000} ${100 + Math.random() * 400})`}
              />
            ))}

            {/* Small decorative flowers - reduced for performance */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} className="garden-flower" transform={`translate(${50 + Math.random() * 1100}, ${300 + Math.random() * 250})`}>
                {Array.from({ length: 5 }).map((_, p) => (
                  <ellipse
                    key={p}
                    cx={Math.cos((p / 5) * Math.PI * 2) * 8}
                    cy={Math.sin((p / 5) * Math.PI * 2) * 8}
                    rx="3"
                    ry="5"
                    fill={["#FFE4B5", "#FFD700", "#C4B5D4", "#FF6B9D", "#87CEEB"][i % 5]}
                    opacity="0.6"
                  />
                ))}
                <circle cx="0" cy="0" r="2" fill="#FFF8F0" opacity="0.8" />
              </g>
            ))}
          </svg>
        </div>

        {/* Butterfly decorations */}
        <div className="butterfly-container" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="butterfly"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 1.5}s`,
              }}
            >
              🦋
            </div>
          ))}
        </div>

        {/* Animated floating elements */}
        <div className="floating-elements" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            >
              {["🌸", "💕", "✨", "🌷"][i % 4]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}