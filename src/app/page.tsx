"use client";

import { useBirthdayStore } from "@/lib/store";
import { CookieHero } from "@/components/cookie-hero";
import { FloatingPhotos } from "@/components/floating-photos";
import { Sparkles } from "@/components/sparkles";

export default function Home() {
  const { phase } = useBirthdayStore();

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
      <Sparkles />

      {phase === "cake" && <CookieHero />}
      {phase === "photos" && <FloatingPhotos />}
    </div>
  );
}
