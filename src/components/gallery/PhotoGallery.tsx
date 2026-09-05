"use client";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

export default function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<number>(20);
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

      // Animate gallery title
      gsap.fromTo(
        section.querySelector(".gallery-title"),
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate photo cards with scroll trigger
      const animateCards = () => {
        const cards = section.querySelectorAll(".gallery-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { 
              opacity: 0, 
              scale: 0.7, 
              y: 50,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      };

      animateCards();
    };

    initGSAP();
  }, []);

  // Load more cards on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        setVisibleCards(prev => Math.min(prev + 20, 100));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const cardsToShow = Array.isArray(birthdayConfig.galleryPictures) 
    ? birthdayConfig.galleryPictures.slice(0, visibleCards)
    : [];

  return (
    <div ref={sectionRef} className="gallery-section">
      {/* Gallery background */}
      <div className="gallery-bg" aria-hidden="true" />

      {/* Gallery title */}
      <div className="gallery-header">
        <p className="gallery-eyebrow">Our Journey Together</p>
        <h2 className="gallery-title">100 Memories of Us 💕</h2>
        <p className="gallery-subtitle">
          Every moment with you is a treasure I hold close to my heart
        </p>
      </div>

      {/* Gallery container */}
      <div ref={containerRef} className="gallery-container">
        {/* Photo cards grid */}
        <div className="gallery-grid">
          {cardsToShow.map((photo, index) => (
            <div
              key={index}
              className="gallery-card"
              style={{
                animationDelay: `${index * 0.05}s`,
                "--rotation": `${(Math.random() - 0.5) * 10}deg`,
              }}
            >
              <div className="card-inner">
                <div className="card-image-wrapper">
                  <img
                    src={photo.path}
                    alt=""
                    className="card-image"
                    loading="lazy"
                  />
                  <div className="card-shine" />
                </div>
                <div className="card-pin">
                  <div className="pin-head" />
                  <div className="pin-body" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more indicator */}
        {visibleCards < 100 && (
          <div className="load-more-indicator">
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
            <p>Scroll for more memories</p>
          </div>
        )}
      </div>

      {/* Floating hearts - reduced for performance */}
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            💕
          </div>
        ))}
      </div>
    </div>
  );
}