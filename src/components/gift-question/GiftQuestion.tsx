"use client";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

type CatState = "cute" | "confused" | "annoyed" | "angry" | "frustrated" | "pleading";

const CAT_STATES: CatState[] = ["cute", "confused", "annoyed", "angry", "frustrated", "pleading"];

const CAT_MESSAGES: Record<CatState, string> = {
  cute: "Do you want your gift? 🎁",
  confused: "Wait... you said no? 🤨",
  annoyed: "Come on, it's your birthday! 😤",
  angry: "I worked so hard on this... 😠",
  frustrated: "PLEASE just say yes!! 😤",
  pleading: "Pleeeeease? 🥺",
};

const CAT_EMOJIS: Record<CatState, string> = {
  cute: "🐱",
  confused: "😕",
  annoyed: "😾",
  angry: "😿",
  frustrated: "🙀",
  pleading: "🥺",
};

const YES_SCALES = [1.0, 1.2, 1.5, 1.9, 2.5, 3.2];

interface GiftQuestionProps {
  onYes: () => void;
}

export default function GiftQuestion({ onYes }: GiftQuestionProps) {
  const [noCount, setNoCount] = useState(0);
  const [catState, setCatState] = useState<CatState>("cute");
  const [catAnimating, setCatAnimating] = useState(false);
  const [yesScale, setYesScale] = useState(1.0);
  const [noVisible, setNoVisible] = useState(true);
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = Math.min(noCount, CAT_STATES.length - 1);
    const scaleIdx = Math.min(noCount, YES_SCALES.length - 1);
    setCatAnimating(true);
    const t = setTimeout(() => {
      setCatState(CAT_STATES[idx]);
      setCatAnimating(false);
    }, 300);
    setYesScale(YES_SCALES[scaleIdx]);
    if (noCount >= 5) setNoVisible(false);
    return () => clearTimeout(t);
  }, [noCount]);

  // Add floating hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingHearts(prev => [...prev, Date.now()].slice(-10));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleNo = () => {
    setNoCount((c) => c + 1);
    // Add shake animation
    if (sectionRef.current) {
      sectionRef.current.style.animation = "none";
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.style.animation = "shake 0.5s ease";
        }
      }, 10);
    }
  };

  const handleYes = () => {
    // Celebration effect
    setFloatingHearts(Array.from({ length: 20 }, () => Date.now() + Math.random() * 1000));
    
    if (sectionRef.current) {
      sectionRef.current.style.transition = "opacity 1.2s ease, transform 1.2s ease";
      sectionRef.current.style.opacity = "0";
      sectionRef.current.style.transform = "scale(1.1)";
      setTimeout(onYes, 1300);
    }
  };

  const rotation =
    catState === "confused" ?"rotate(-8deg)"
      : catState === "annoyed" ?"rotate(4deg) scale(0.95)"
      : catState === "angry" ?"rotate(-5deg) scale(1.05)"
      : catState === "frustrated" ?"rotate(6deg) scale(1.1)"
      : catState === "pleading" ?"rotate(-3deg) scale(1.08)" :"rotate(0deg) scale(1)";

  return (
    <div
      ref={sectionRef}
      className="gift-question-scene"
    >
      {/* Enhanced floating petals background */}
      <div className="petals-bg" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="floating-petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Floating hearts */}
      <div className="hearts-bg" aria-hidden="true">
        {floatingHearts.map((timestamp) => (
          <div
            key={timestamp}
            className="floating-heart"
            style={{
              left: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Animated sparkles */}
      <div className="sparkles-bg" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Floral corner decorations */}
      <div className="corner-flowers top-left" aria-hidden="true">
        <FloralCorner />
      </div>
      <div className="corner-flowers top-right flipped" aria-hidden="true">
        <FloralCorner />
      </div>

      <div className="gift-content">
        {/* Message with enhanced animation */}
        <div className="question-message">
          <p className="question-text">{CAT_MESSAGES[catState]}</p>
        </div>

        {/* Realistic cat video with enhanced container */}
        <div
          className={`cat-container ${catAnimating ? "cat-animating" : ""}`}
          style={{ transform: catAnimating ? "scale(0.85) translateY(10px)" : rotation }}
          aria-label={`Cat feeling ${catState}`}
        >
          {/* Realistic cat video */}
          <div className="cat-video-container">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="cat-video"
              poster="/assets/images/app_logo.png"
            >
              <source src={birthdayConfig.catAssetPaths.cute} type="video/mp4" />
            </video>
            {/* Fallback to SVG if video doesn't load */}
            <div className="cat-illustration-fallback">
              <CatSVG state={catState} />
            </div>
          </div>
          
          {/* Enhanced flower ring around cat */}
          <div className="cat-flower-ring" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="ring-flower"
                style={{ 
                  transform: `rotate(${i * 30}deg) translateY(-100px)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Floating emojis around cat */}
          <div className="cat-floating-emojis" aria-hidden="true">
            {catState === "cute" && ["💕", "✨", "🌸", "💗"].map((emoji, i) => (
              <span
                key={i}
                className="floating-emoji"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + (i % 2) * 80}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons with enhanced animations */}
        <div className="button-group">
          {/* YES button */}
          <button
            className="yes-btn"
            onClick={handleYes}
            style={{
              transform: `scale(${yesScale})`,
              transformOrigin: "center",
            }}
            aria-label="Yes, I want my gift"
          >
            <span className="btn-glow" />
            <span className="btn-text">YES! 🎁</span>
            <span className="btn-sparkles">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="btn-sparkle">✨</span>
              ))}
            </span>
          </button>

          {/* NO button */}
          {noVisible && (
            <button
              className="no-btn"
              onClick={handleNo}
              aria-label="No thank you"
            >
              No thanks
            </button>
          )}
        </div>

        {noCount > 0 && noCount < 5 && (
          <p className="no-counter-hint">
            {noCount === 1 && "Are you sure? 🤔"}
            {noCount === 2 && "Really really sure? 😅"}
            {noCount === 3 && "Last chance... 👀"}
            {noCount === 4 && "Okay I'm begging now 🙏"}
          </p>
        )}
      </div>
    </div>
  );
}

function FloralCorner() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 110 Q10 10 110 10" stroke="#4A5E4A" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M10 110 Q10 60 60 10" stroke="#4A5E4A" strokeWidth="1" fill="none" opacity="0.4" />
      {[
        { cx: 20, cy: 100, r: 8, color: "#C4B5D4" },
        { cx: 40, cy: 75, r: 6, color: "#F2D4D4" },
        { cx: 65, cy: 48, r: 7, color: "#8B2252" },
        { cx: 90, cy: 25, r: 5, color: "#C4B5D4" },
      ].map((f, i) => (
        <g key={i}>
          {Array.from({ length: 6 }).map((_, p) => (
            <ellipse
              key={p}
              cx={f.cx + Math.cos((p / 6) * Math.PI * 2) * f.r}
              cy={f.cy + Math.sin((p / 6) * Math.PI * 2) * f.r}
              rx={f.r * 0.45}
              ry={f.r * 0.7}
              transform={`rotate(${(p / 6) * 360} ${f.cx + Math.cos((p / 6) * Math.PI * 2) * f.r} ${f.cy + Math.sin((p / 6) * Math.PI * 2) * f.r})`}
              fill={f.color}
              opacity="0.8"
            />
          ))}
          <circle cx={f.cx} cy={f.cy} r={f.r * 0.3} fill="#FFE4B5" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

function CatSVG({ state }: { state: CatState }) {
  const expressions: Record<CatState, React.ReactNode> = {
    cute: (
      <>
        <ellipse cx="28" cy="38" rx="5" ry="4" fill="#2A1F3D" />
        <ellipse cx="72" cy="38" rx="5" ry="4" fill="#2A1F3D" />
        <ellipse cx="29" cy="37" rx="2" ry="2" fill="white" />
        <ellipse cx="73" cy="37" rx="2" ry="2" fill="white" />
        <path d="M 40 55 Q 50 62 60 55" stroke="#8B2252" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="53" r="3" fill="#F4A0A0" opacity="0.7" />
        <path d="M 50 55 L 44 60 M 50 55 L 56 60" stroke="#8B2252" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    confused: (
      <>
        <ellipse cx="28" cy="40" rx="5" ry="3" fill="#2A1F3D" />
        <ellipse cx="72" cy="38" rx="5" ry="4" fill="#2A1F3D" />
        <path d="M 38 55 Q 50 52 62 57" stroke="#8B2252" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 22 32 Q 28 28 34 32" stroke="#4A5E4A" strokeWidth="2" fill="none" />
        <text x="65" y="30" fontSize="14" fill="#C4B5D4">?</text>
      </>
    ),
    annoyed: (
      <>
        <ellipse cx="28" cy="40" rx="5" ry="3" fill="#2A1F3D" />
        <ellipse cx="72" cy="40" rx="5" ry="3" fill="#2A1F3D" />
        <path d="M 38 58 Q 50 54 62 58" stroke="#8B2252" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 20 32 L 36 36" stroke="#2A1F3D" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 64 36 L 80 32" stroke="#2A1F3D" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    angry: (
      <>
        <ellipse cx="28" cy="42" rx="5" ry="3" fill="#8B2252" />
        <ellipse cx="72" cy="42" rx="5" ry="3" fill="#8B2252" />
        <path d="M 38 60 Q 50 56 62 60" stroke="#8B2252" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 18 30 L 36 38" stroke="#8B2252" strokeWidth="3" strokeLinecap="round" />
        <path d="M 64 38 L 82 30" stroke="#8B2252" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    frustrated: (
      <>
        <ellipse cx="28" cy="42" rx="5" ry="3" fill="#8B2252" />
        <ellipse cx="72" cy="42" rx="5" ry="3" fill="#8B2252" />
        <path d="M 38 62 Q 50 58 62 62" stroke="#8B2252" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 18 28 L 36 38" stroke="#8B2252" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 64 38 L 82 28" stroke="#8B2252" strokeWidth="3.5" strokeLinecap="round" />
        <text x="68" y="25" fontSize="12" fill="#8B2252">!</text>
        <text x="18" y="22" fontSize="12" fill="#8B2252">!</text>
      </>
    ),
    pleading: (
      <>
        <ellipse cx="28" cy="38" rx="6" ry="7" fill="#2A1F3D" />
        <ellipse cx="72" cy="38" rx="6" ry="7" fill="#2A1F3D" />
        <ellipse cx="29" cy="36" rx="2.5" ry="2.5" fill="white" />
        <ellipse cx="73" cy="36" rx="2.5" ry="2.5" fill="white" />
        <path d="M 40 58 Q 50 64 60 58" stroke="#8B2252" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="27" cy="50" rx="4" ry="2" fill="#A0C4FF" opacity="0.6" />
        <ellipse cx="73" cy="50" rx="4" ry="2" fill="#A0C4FF" opacity="0.6" />
      </>
    ),
  };

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="65" rx="30" ry="25" fill="#F2D4D4" />
      {/* Head */}
      <ellipse cx="50" cy="42" rx="28" ry="26" fill="#F2D4D4" />
      {/* Ears */}
      <polygon points="22,22 15,5 35,18" fill="#F2D4D4" />
      <polygon points="78,22 85,5 65,18" fill="#F2D4D4" />
      <polygon points="24,20 19,8 32,19" fill="#E8A0A0" opacity="0.6" />
      <polygon points="76,20 81,8 68,19" fill="#E8A0A0" opacity="0.6" />
      {/* Nose */}
      <ellipse cx="50" cy="50" rx="3" ry="2" fill="#E8A0A0" />
      {/* Expression */}
      {expressions[state]}
      {/* Whiskers */}
      <line x1="20" y1="48" x2="40" y2="50" stroke="#8B7A8B" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="52" x2="40" y2="52" stroke="#8B7A8B" strokeWidth="1" opacity="0.6" />
      <line x1="60" y1="50" x2="80" y2="48" stroke="#8B7A8B" strokeWidth="1" opacity="0.6" />
      <line x1="60" y1="52" x2="80" y2="52" stroke="#8B7A8B" strokeWidth="1" opacity="0.6" />
      {/* Tail */}
      <path d="M 75 80 Q 95 75 90 95 Q 85 100 78 88" stroke="#F2D4D4" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}