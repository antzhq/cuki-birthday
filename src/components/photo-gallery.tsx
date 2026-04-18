"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { PHOTO_FILES, PHOTO_CAPTIONS, TOTAL_PHOTOS } from "@/lib/constants";
import { PhotoCard } from "./photo-card";
import { GameMenu } from "./game-menu";
import { NavBar } from "./nav-bar";

export function PhotoGallery() {
  const { unlockedPhotos, completedGames, setPhase, relightCandles } =
    useBirthdayStore();

  return (
    <motion.div
      className="flex flex-col items-center gap-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <NavBar
        title="Galería de Cuki"
        onBack={relightCandles}
        backLabel="← Velas"
        right={
          <button
            className="text-sm text-cookie-dark/50 active:text-cookie-dark min-h-[44px] flex items-center"
            onClick={relightCandles}
          >
            🕯️
          </button>
        }
      />

      <p className="text-sm text-cookie-dark/60 -mt-2">
        {unlockedPhotos.length} / {TOTAL_PHOTOS} fotos desbloqueadas
      </p>

      {/* Photo grid — 3 columns on mobile */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {PHOTO_FILES.map((src, i) => (
          <PhotoCard
            key={i}
            src={src}
            caption={PHOTO_CAPTIONS[i]}
            unlocked={unlockedPhotos.includes(i)}
            index={i}
          />
        ))}
      </div>

      {completedGames.length < 4 && (
        <div className="w-full mt-2">
          <h3 className="text-base font-semibold text-cookie-dark text-center mb-3">
            ¡Jugá para desbloquear más! 🎮
          </h3>
          <GameMenu />
        </div>
      )}
    </motion.div>
  );
}
