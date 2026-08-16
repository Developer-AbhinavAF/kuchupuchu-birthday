"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const FloralHeartLoader = dynamic(() => import("@/components/intro/FloralHeartLoader"), { ssr: false });
const GiftQuestion = dynamic(() => import("@/components/gift-question/GiftQuestion"), { ssr: false });
const PasscodeScene = dynamic(() => import("@/components/passcode/PasscodeScene"), { ssr: false });
const LilyGarden = dynamic(() => import("@/components/flower-garden/LilyGarden"), { ssr: false });
const LongDistanceSection = dynamic(() => import("@/components/distance/LongDistanceSection"), { ssr: false });
const LetterSection = dynamic(() => import("@/components/letter/LetterSection"), { ssr: false });
const FutureSection = dynamic(() => import("@/components/future/FutureSection"), { ssr: false });
const BirthdayCake = dynamic(() => import("@/components/birthday/BirthdayCake"), { ssr: false });
const GrandFinale = dynamic(() => import("@/components/finale/GrandFinale"), { ssr: false });
const MusicPlayer = dynamic(() => import("@/components/shared/MusicPlayer"), { ssr: false });
const ThreeBackground = dynamic(() => import("@/components/shared/ThreeBackground"), { ssr: false });

type Scene = "loader" | "gift" | "passcode" | "journey";

export default function HomePage() {
  const [scene, setScene] = useState<Scene>("loader");
  const [wishMade, setWishMade] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const journeyRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoaderComplete = () => setScene("gift");
  const handleYes = () => setScene("passcode");
  const handlePasscodeCorrect = () => {
    setScene("journey");
  };
  const handleWishMade = () => setWishMade(true);

  // Full-page scroll snapping logic
  useEffect(() => {
    if (scene !== "journey") return;

    const container = journeyRef.current;
    if (!container) return;

    // Fade in
    container.style.opacity = "0";
    setTimeout(() => {
      if (container) {
        container.style.transition = "opacity 1.5s ease";
        container.style.opacity = "1";
      }
    }, 100);

    const sections = Array.from(container.querySelectorAll(".snap-section")) as HTMLElement[];
    sectionsRef.current = sections as HTMLDivElement[];

    let currentIndex = 0;
    let isScrolling = false;

    const scrollToSection = (index: number) => {
      if (index < 0 || index >= sections.length) return;
      isScrolling = true;
      setIsSnapping(true);
      currentIndex = index;
      setActiveSection(index);

      sections[index].scrollIntoView({ behavior: "smooth", block: "start" });

      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(() => {
        isScrolling = false;
        setIsSnapping(false);
      }, 900);
    };

    const onWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      scrollToSection(currentIndex + dir);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 40) {
        scrollToSection(currentIndex + (diff > 0 ? 1 : -1));
      }
    };

    // Keyboard navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToSection(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(currentIndex - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [scene]);

  return (
    <>
      {/* Global Three.js background — only during journey */}
      {scene === "journey" && <ThreeBackground />}

      {/* Scroll progress dots */}
      {scene === "journey" && (
        <nav className="scroll-dots" aria-label="Section navigation">
          {Array.from({ length: 7 }).map((_, i) => (
            <button
              key={i}
              className={`scroll-dot ${activeSection === i ? "scroll-dot-active" : ""}`}
              aria-label={`Go to section ${i + 1}`}
              onClick={() => {
                const sections = sectionsRef.current;
                if (sections[i]) {
                  sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveSection(i);
                }
              }}
            />
          ))}
        </nav>
      )}

      {/* Loader */}
      {scene === "loader" && <FloralHeartLoader onComplete={handleLoaderComplete} />}

      {/* Gift Question */}
      {scene === "gift" && <GiftQuestion onYes={handleYes} />}

      {/* Passcode */}
      {scene === "passcode" && <PasscodeScene onCorrect={handlePasscodeCorrect} />}

      {/* Full Journey — snap sections */}
      {scene === "journey" && (
        <div ref={journeyRef} className="journey-container" style={{ overflow: "hidden" }}>
          <MusicPlayer />

          <div className="snap-section">
            <LilyGarden />
          </div>

          <div className="snap-section">
            <LongDistanceSection />
          </div>

          <div className="snap-section">
            <LetterSection />
          </div>

          <div className="snap-section">
            <FutureSection />
          </div>

          <div className="snap-section">
            <BirthdayCake onWishMade={handleWishMade} />
          </div>

          <div className="snap-section">
            <GrandFinale />
          </div>
        </div>
      )}
    </>
  );
}