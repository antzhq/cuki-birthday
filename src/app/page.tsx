"use client";

import { useBirthdayStore } from "@/lib/store";
import { CookieHero } from "@/components/cookie-hero";
import { FloatingPhotos } from "@/components/floating-photos";
import { Sparkles } from "@/components/sparkles";
import { MusicPlayer } from "@/components/music-player";

export default function Home() {
  const { phase } = useBirthdayStore();

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
      <Sparkles />
      <MusicPlayer />

      {phase === "cake" && <CookieHero />}
      {phase === "photos" && <FloatingPhotos />}
    </div>
  );
}
