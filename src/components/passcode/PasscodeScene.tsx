"use client";
import { useRef, useState } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

interface PasscodeSceneProps {
  onCorrect: () => void;
}

export default function PasscodeScene({ onCorrect }: PasscodeSceneProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDigit = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
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
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = "opacity 1.2s ease";
          containerRef.current.style.opacity = "0";
          setTimeout(onCorrect, 1300);
        }
      }, 1500);
    } else {
      setStatus("wrong");
      setShake(true);
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
      {/* Atmospheric background */}
      <div className="passcode-bg" aria-hidden="true">
        <div className="passcode-glow" />
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="star-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      {/* Floral frame */}
      <div className="passcode-floral-frame" aria-hidden="true">
        <PasscodeFloralFrame />
      </div>

      <div className="passcode-content">
        <p className="passcode-eyebrow">Before we open your gift...</p>
        <h2 className="passcode-heading">Enter the secret code 🔐</h2>
        <p className="passcode-hint">Only you know this one 💫</p>

        {/* PIN inputs */}
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
            </div>
          ))}
        </div>

        {/* Status messages */}
        {status === "wrong" && (
          <p className="passcode-wrong" role="alert">Hmm... that&apos;s not it 👀 Try again!</p>
        )}
        {status === "correct" && (
          <p className="passcode-correct" role="status">✨ That&apos;s it! Opening your gift... 🌸</p>
        )}

        {/* Sparkle burst */}
        {sparkle && (
          <div className="sparkle-burst" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="sparkle-particle"
                style={{ transform: `rotate(${i * 22.5}deg) translateY(-0px)` }}
              />
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
      {/* Corner stems */}
      {[
        { path: "M 0 600 Q 50 400 150 300 Q 200 250 250 150 Q 280 80 300 0", opacity: 0.5 },
        { path: "M 800 600 Q 750 400 650 300 Q 600 250 550 150 Q 520 80 500 0", opacity: 0.5 },
      ].map((stem, i) => (
        <path key={i} d={stem.path} stroke="#4A5E4A" strokeWidth="1.5" fill="none" opacity={stem.opacity} />
      ))}

      {/* Lily clusters - bottom left */}
      {[
        { x: 60, y: 500, size: 25, color: "#C4B5D4" },
        { x: 120, y: 450, size: 20, color: "#F2D4D4" },
        { x: 40, y: 430, size: 18, color: "#8B2252" },
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

      {/* Lily clusters - top right */}
      {[
        { x: 740, y: 80, size: 22, color: "#C4B5D4" },
        { x: 700, y: 130, size: 18, color: "#F2D4D4" },
        { x: 760, y: 150, size: 20, color: "#8B2252" },
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
    </svg>
  );
}