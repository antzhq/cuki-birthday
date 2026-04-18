"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { BirthdayCake } from "./birthday-cake";
import { useMusicPlayer } from "./music-player";
import { TOTAL_CANDLES } from "@/lib/constants";

export function CookieHero() {
  const { candlesLit, musicStarted, startMusic, blowCandle, blowAllCandles } =
    useBirthdayStore();
  const { play } = useMusicPlayer();

  const handleStartMusic = () => {
    // WHY: play() must be called in the same synchronous click handler
    // for iOS to allow audio playback
    play();
    startMusic();
  };

  const handleBlow = () => {
    const toExtinguish = Math.min(candlesLit, 2 + Math.floor(Math.random() * 2));
    for (let i = 0; i < toExtinguish; i++) {
      setTimeout(() => blowCandle(), i * 150);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-5 select-none w-full max-w-md mx-auto px-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <div className="text-center">
        <motion.h1
          className="text-2xl font-bold text-cookie-dark leading-tight"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ¡Feliz cumpleaños #18
        </motion.h1>
        <motion.p
          className="text-4xl font-bold text-pink mt-1"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          Cuki!
        </motion.p>
      </div>

      {/* Cake */}
      <BirthdayCake candlesLit={candlesLit} totalCandles={TOTAL_CANDLES} />

      {/* Phase: tap to start music first, then blow */}
      {!musicStarted ? (
        <motion.button
          className="w-full max-w-xs h-12 rounded-full bg-pink text-white font-semibold text-base shadow-lg active:bg-pink/80 transition-colors"
          onClick={handleStartMusic}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🎵 Tocá para escuchar
        </motion.button>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm text-cookie-dark/60">
            {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
          </p>

          <motion.button
            className="w-full max-w-xs h-12 rounded-full bg-cookie-brown text-white font-semibold text-base shadow-lg active:bg-cookie-dark transition-colors"
            onClick={handleBlow}
            whileTap={{ scale: 0.95 }}
          >
            Tocá para soplar 💨
          </motion.button>

          {candlesLit > 0 && candlesLit < 15 && (
            <button
              className="text-xs text-cookie-dark/40 underline active:text-cookie-dark/60 min-h-[44px] flex items-center"
              onClick={blowAllCandles}
            >
              apagar todas
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
