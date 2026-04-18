"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { PHOTO_FILES, PHOTO_CAPTIONS, TOTAL_PHOTOS } from "@/lib/constants";
import { PhotoCard } from "./photo-card";
import { GameMenu } from "./game-menu";

export function PhotoGallery() {
  const { unlockedPhotos, completedGames, setPhase, relightCandles } =
    useBirthdayStore();

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between w-full">
        <button
          className="text-sm text-cookie-dark/50 hover:text-cookie-dark"
          onClick={() => setPhase("video")}
        >
          ← Video
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cookie-dark">
            Galería de Cuki
          </h2>
          <p className="text-sm text-cookie-dark/60 mt-1">
            {unlockedPhotos.length} / {TOTAL_PHOTOS} fotos desbloqueadas
          </p>
        </div>
        <button
          className="text-sm text-cookie-dark/50 hover:text-cookie-dark"
          onClick={relightCandles}
        >
          🕯️ Velas
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full">
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
        <div className="w-full mt-4">
          <h3 className="text-lg font-semibold text-cookie-dark text-center mb-3">
            ¡Jugá para desbloquear más! 🎮
          </h3>
          <GameMenu />
        </div>
      )}
    </motion.div>
  );
}
