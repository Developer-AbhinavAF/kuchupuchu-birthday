"use client";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/data/birthdayConfig";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!birthdayConfig?.musicUrl) return;
    setVisible(true);
    audioRef.current = new Audio(birthdayConfig.musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
    return () => {
      audioRef?.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef?.current) return;
    if (playing) {
      audioRef?.current?.pause();
      setPlaying(false);
    } else {
      audioRef?.current?.play()?.catch(() => {});
      setPlaying(true);
    }
  };

  if (!visible) return null;

  return (
    <button
      className="music-player-btn"
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
    >
      <span className="music-icon">{playing ? "♫" : "♪"}</span>
      {playing && <span className="music-pulse" aria-hidden="true" />}
    </button>
  );
}