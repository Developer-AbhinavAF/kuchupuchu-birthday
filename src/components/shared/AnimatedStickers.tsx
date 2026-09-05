"use client";
import { useEffect, useRef } from "react";

interface AnimatedStickersProps {
  type?: "hearts" | "stars" | "flowers" | "balloons" | "confetti";
  count?: number;
}

export default function AnimatedStickers({ type = "hearts", count = 10 }: AnimatedStickersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stickers = container.querySelectorAll(".animated-sticker");
    stickers.forEach((sticker, i) => {
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;
      const xMovement = (Math.random() - 0.5) * 50;
      const yMovement = (Math.random() - 0.5) * 30;
      const rotation = (Math.random() - 0.5) * 20;

      sticker.style.animation = `sticker-float ${duration}s ease-in-out ${delay}s infinite`;
      sticker.style.setProperty("--x-move", `${xMovement}px`);
      sticker.style.setProperty("--y-move", `${yMovement}px`);
      sticker.style.setProperty("--rotation", `${rotation}deg`);
    });
  }, [type, count]);

  const getStickers = () => {
    switch (type) {
      case "hearts":
        return ["💕", "💖", "💗", "💓", "❤️", "💘"];
      case "stars":
        return ["⭐", "✨", "💫", "🌟", "✴️", "🌠"];
      case "flowers":
        return ["🌸", "🌺", "🌹", "🌷", "💐", "🏵️"];
      case "balloons":
        return ["🎈", "🎈", "🎈", "🎉", "🎊", "🎁"];
      case "confetti":
        return ["🎊", "🎉", "🎈", "✨", "💫", "🌟"];
      default:
        return ["💕", "✨", "🌸", "⭐"];
    }
  };

  const stickers = getStickers();

  return (
    <div ref={containerRef} className="animated-stickers-container" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animated-sticker"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${1 + Math.random() * 1.5}rem`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {stickers[i % stickers.length]}
        </div>
      ))}
    </div>
  );
}