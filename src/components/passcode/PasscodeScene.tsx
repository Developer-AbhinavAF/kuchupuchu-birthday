"use client";
import { useRef, useState, useEffect } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

interface PasscodeSceneProps {
  onCorrect: () => void;
}

export default function PasscodeScene({ onCorrect }: PasscodeSceneProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [floatingElements, setFloatingElements] = useState<number[]>([]);
  const [successBurst, setSuccessBurst] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Add floating animated elements - more stable
  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => i);
    setFloatingElements(elements);
  }, []);

  const handleDigit = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    
    // Add small animation when digit is entered
    if (value) {
      const slot = containerRef.current?.querySelectorAll('.pin-slot')[index];
      if (slot) {
        slot.style.animation = 'none';
        setTimeout(() => {
          if (slot) {
            slot.style.animation = 'digit-pop 0.3s ease';
          }
        }, 10);
      }
    }
    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newDigits.every((d) => d !== "")) {
      checkCode(newDigits);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkCode = (d: string[]) => {
    const entered = d.join("");
    if (entered === birthdayConfig.passcode) {
      setStatus("correct");
      setSparkle(true);
      setSuccessBurst(true);
      
      // Success celebration
      setTimeout(() => {
        setFloatingElements(Array.from({ length: 30 }, () => Date.now() + Math.random() * 2000));
      }, 300);
      
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = "opacity 1.5s ease, transform 1.5s ease";
          containerRef.current.style.opacity = "0";
          containerRef.current.style.transform = "scale(1.1)";
          setTimeout(onCorrect, 1600);
        }
      }, 2000);
    } else {
      setStatus("wrong");
      setShake(true);
      
      // Error animation
      setTimeout(() => {
        setShake(false);
        setStatus("idle");
        setDigits(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 1200);
    }
  };

  return (
    <div ref={containerRef} className="passcode-scene">
      {/* Enhanced atmospheric background */}
      <div className="passcode-bg" aria-hidden="true">
        <div className="passcode-glow" />
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="star-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
        
        {/* Floating magical elements */}
        {floatingElements.map((timestamp) => (
          <div
            key={timestamp}
            className="floating-magic"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {Math.random() > 0.5 ? '✨' : '💫'}
          </div>
        ))}
      </div>

      {/* Enhanced floral frame */}
      <div className="passcode-floral-frame" aria-hidden="true">
        <PasscodeFloralFrame />
      </div>

      <div className="passcode-content">
        <p className="passcode-eyebrow">Before we open your gift...</p>
        <h2 className="passcode-heading">Enter the secret code 🔐</h2>
        <p className="passcode-hint">Only you know this one 💫</p>

        {/* Enhanced PIN inputs */}
        <div
          className={`pin-container ${shake ? "pin-shake" : ""} ${status === "correct" ? "pin-correct" : ""}`}
          role="group"
          aria-label="4-digit passcode input"
        >
          {digits.map((digit, i) => (
            <div key={i} className="pin-slot">
              <input
                ref={(el) => { inputRefs.current[i] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`pin-input ${digit ? "pin-filled" : ""} ${status === "correct" ? "pin-input-correct" : ""}`}
                aria-label={`Digit ${i + 1}`}
                autoComplete="off"
              />
              <div className="pin-underline" />
              {digit && <div className="pin-glow" />}
            </div>
          ))}
        </div>

        {/* Status messages with enhanced animations */}
        {status === "wrong" && (
          <p className="passcode-wrong" role="alert">
            <span className="error-icon">❌</span>
            Hmm... that&apos;s not it 👀 Try again!
          </p>
        )}
        {status === "correct" && (
          <p className="passcode-correct" role="status">
            <span className="success-icon">✨</span>
            That&apos;s it! Opening your gift... 🌸
          </p>
        )}

        {/* Enhanced sparkle burst */}
        {sparkle && (
          <div className="sparkle-burst" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="sparkle-particle"
                style={{ 
                  transform: `rotate(${i * 15}deg) translateY(-0px)`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Success burst celebration */}
        {successBurst && (
          <div className="success-burst" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="success-particle"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 18}deg)`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {['🎉', '💖', '✨', '🌸', '💕'][i % 5]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PasscodeFloralFrame() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      {/* Enhanced corner stems with curves */}
      {[
        { path: "M 0 600 Q 50 400 150 300 Q 200 250 250 150 Q 280 80 300 0", opacity: 0.5 },
        { path: "M 800 600 Q 750 400 650 300 Q 600 250 550 150 Q 520 80 500 0", opacity: 0.5 },
        { path: "M 0 0 Q 100 50 200 100 Q 300 150 400 200", opacity: 0.3 },
        { path: "M 800 0 Q 700 50 600 100 Q 500 150 400 200", opacity: 0.3 },
      ].map((stem, i) => (
        <path key={i} d={stem.path} stroke="#4A5E4A" strokeWidth="1.5" fill="none" opacity={stem.opacity} />
      ))}

      {/* Enhanced Lily clusters - bottom left */}
      {[
        { x: 60, y: 500, size: 25, color: "#C4B5D4" },
        { x: 120, y: 450, size: 20, color: "#F2D4D4" },
        { x: 40, y: 430, size: 18, color: "#8B2252" },
        { x: 90, y: 520, size: 22, color: "#E8C4D4" },
      ].map((lily, li) => (
        <g key={li}>
          {Array.from({ length: 6 }).map((_, p) => (
            <ellipse
              key={p}
              cx={lily.x + Math.cos((p / 6) * Math.PI * 2) * lily.size * 0.8}
              cy={lily.y + Math.sin((p / 6) * Math.PI * 2) * lily.size * 0.8}
              rx={lily.size * 0.35}
              ry={lily.size * 0.65}
              transform={`rotate(${(p / 6) * 360 + 90} ${lily.x + Math.cos((p / 6) * Math.PI * 2) * lily.size * 0.8} ${lily.y + Math.sin((p / 6) * Math.PI * 2) * lily.size * 0.8})`}
              fill={lily.color}
              opacity="0.5"
            />
          ))}
          <circle cx={lily.x} cy={lily.y} r={lily.size * 0.2} fill="#FFE4B5" opacity="0.7" />
        </g>
      ))}

      {/* Enhanced Lily clusters - top right */}
      {[
        { x: 740, y: 80, size: 22, color: "#C4B5D4" },
        { x: 700, y: 130, size: 18, color: "#F2D4D4" },
        { x: 760, y: 150, size: 20, color: "#8B2252" },
        { x: 720, y: 60, size: 16, color: "#D4A820" },
      ].map((lily, li) => (
        <g key={li + 10}>
          {Array.from({ length: 6 }).map((_, p) => (
            <ellipse
              key={p}
              cx={lily.x + Math.cos((p / 6) * Math.PI * 2) * lily.size * 0.8}
              cy={lily.y + Math.sin((p / 6) * Math.PI * 2) * lily.size * 0.8}
              rx={lily.size * 0.35}
              ry={lily.size * 0.65}
              transform={`rotate(${(p / 6) * 360 + 90} ${lily.x + Math.cos((p / 6) * Math.PI * 2) * lily.size * 0.8} ${lily.y + Math.sin((p / 6) * Math.PI * 2) * lily.size * 0.8})`}
              fill={lily.color}
              opacity="0.5"
            />
          ))}
          <circle cx={lily.x} cy={lily.y} r={lily.size * 0.2} fill="#FFE4B5" opacity="0.7" />
        </g>
      ))}

      {/* Floating petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx={100 + Math.random() * 600}
          cy={100 + Math.random() * 400}
          rx={3 + Math.random() * 4}
          ry={5 + Math.random() * 6}
          fill={["#C4B5D4", "#F2D4D4", "#8B2252", "#E8C4D4"][i % 4]}
          opacity="0.3"
          transform={`rotate(${Math.random() * 360} ${100 + Math.random() * 600} ${100 + Math.random() * 400})`}
        />
      ))}
    </svg>
  );
}