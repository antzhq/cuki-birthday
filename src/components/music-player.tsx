"use client";

import { useEffect, useRef } from "react";
import { useBirthdayStore } from "@/lib/store";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { musicStarted, startMusic } = useBirthdayStore();

  // WHY: iOS requires a user gesture to start audio. We attach a one-time
  // click listener to the whole page to start playback on first interaction.
  useEffect(() => {
    if (musicStarted) return;

    const handleInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
        startMusic();
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [musicStarted, startMusic]);

  return (
    <audio
      ref={audioRef}
      src="/audio/birthday.mp3"
      loop
      preload="auto"
    />
  );
}
