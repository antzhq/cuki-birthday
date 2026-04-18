"use client";

import { useEffect, useRef } from "react";
import { useBirthdayStore } from "@/lib/store";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicStarted = useBirthdayStore((s) => s.musicStarted);

  useEffect(() => {
    if (musicStarted && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [musicStarted]);

  return (
    <audio
      ref={audioRef}
      src="/audio/birthday.mp3"
      loop
      preload="auto"
    />
  );
}
