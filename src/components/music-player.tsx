"use client";

import { useRef, useCallback } from "react";

// WHY: We expose a play function via ref so the button click (user gesture)
// directly triggers play — iOS requires audio.play() inside the same
// synchronous call stack as the user interaction.
export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/birthday.mp3");
      audio.loop = true;
      audio.volume = 0.7;
      audioRef.current = audio;
    }
    audioRef.current.play().catch(() => {});
  }, []);

  return { play };
}
