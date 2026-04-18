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
    play();
    startMusic();
  };

  const handleBlow = () => {
    // WHY: Blow 3-5 candles per tap for a satisfying pace on mobile
    const toExtinguish = Math.min(candlesLit, 3 + Math.floor(Math.random() * 3));
    for (let i = 0; i < toExtinguish; i++) {
      setTimeout(() => blowCandle(), i * 100);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 select-none w-full max-w-md mx-auto px-5">
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

      {/* Buttons */}
      {!musicStarted ? (
        <button
          className="w-full max-w-xs h-14 rounded-full bg-pink text-white font-semibold text-lg shadow-lg active:bg-pink/80 transition-colors"
          onTouchEnd={(e) => {
            e.preventDefault();
            handleStartMusic();
          }}
          onClick={handleStartMusic}
        >
          🎵 Tocá para escuchar
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm text-cookie-dark/60">
            {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
          </p>

          <button
            className="w-full max-w-xs h-14 rounded-full bg-cookie-brown text-white font-semibold text-lg shadow-lg active:bg-cookie-dark active:scale-95 transition-all"
            onTouchEnd={(e) => {
              e.preventDefault();
              handleBlow();
            }}
            onClick={handleBlow}
          >
            Tocá para soplar 💨
          </button>

          {candlesLit > 0 && candlesLit < 15 && (
            <button
              className="text-xs text-cookie-dark/40 underline active:text-cookie-dark/60 min-h-[44px] flex items-center"
              onTouchEnd={(e) => {
                e.preventDefault();
                blowAllCandles();
              }}
              onClick={blowAllCandles}
            >
              apagar todas
            </button>
          )}
        </div>
      )}
    </div>
  );
}
