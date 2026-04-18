"use client";

import { useBirthdayStore } from "@/lib/store";
import { CookieHero } from "@/components/cookie-hero";
import { VideoPlayer } from "@/components/video-player";
import { PhotoGallery } from "@/components/photo-gallery";
import { GameMenu } from "@/components/game-menu";
import { MemoryMatch } from "@/components/games/memory-match";
import { GuessTheYear } from "@/components/games/guess-the-year";
import { Trivia } from "@/components/games/trivia";
import { SlidingPuzzle } from "@/components/games/sliding-puzzle";
import { FinalMessage } from "@/components/final-message";
import { Sparkles } from "@/components/sparkles";

export default function Home() {
  const { phase, activeGame } = useBirthdayStore();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <Sparkles />

      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
        {phase === "landing" && <CookieHero />}
        {phase === "blowing" && <CookieHero />}
        {phase === "video" && <VideoPlayer />}
        {phase === "gallery" && <PhotoGallery />}
        {phase === "game" && activeGame === "memory" && <MemoryMatch />}
        {phase === "game" && activeGame === "guess-year" && <GuessTheYear />}
        {phase === "game" && activeGame === "trivia" && <Trivia />}
        {phase === "game" && activeGame === "puzzle" && <SlidingPuzzle />}
        {phase === "complete" && <FinalMessage />}
      </main>
    </div>
  );
}
