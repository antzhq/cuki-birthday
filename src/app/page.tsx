"use client";

import { useBirthdayStore } from "@/lib/store";
import { CookieHero } from "@/components/cookie-hero";
import { VideoPlayer } from "@/components/video-player";
import { PhotoGallery } from "@/components/photo-gallery";
import { MemoryMatch } from "@/components/games/memory-match";
import { GuessTheYear } from "@/components/games/guess-the-year";
import { Trivia } from "@/components/games/trivia";
import { SlidingPuzzle } from "@/components/games/sliding-puzzle";
import { FinalMessage } from "@/components/final-message";
import { Sparkles } from "@/components/sparkles";

export default function Home() {
  const { phase, activeGame } = useBirthdayStore();

  // WHY: Cookie/blowing are centered vertically (hero), everything else scrolls from top
  const isCentered = phase === "landing" || phase === "blowing";

  return (
    <div
      className={`relative flex-1 flex flex-col ${
        isCentered ? "items-center justify-center" : ""
      } overflow-x-hidden`}
    >
      <Sparkles />

      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-6 flex flex-col items-center">
        {(phase === "landing" || phase === "blowing") && <CookieHero />}
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
