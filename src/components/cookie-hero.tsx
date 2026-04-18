"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { BirthdayCake } from "./birthday-cake";
import { useMusicPlayer } from "./music-player";
import { useBlowDetection } from "@/hooks/use-blow-detection";
import { TOTAL_CANDLES } from "@/lib/constants";
import { useCallback } from "react";

export function CookieHero() {
  const { candlesLit, musicStarted, startMusic, blowCandle, blowAllCandles } =
    useBirthdayStore();
  const { play } = useMusicPlayer();

  const handleBlow = useCallback(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => blowCandle(), i * 100);
    }
  }, [blowCandle]);

  const { micState, startMic } = useBlowDetection({
    onBlow: handleBlow,
    enabled: musicStarted && candlesLit > 0,
  });

  const handleStartMusic = () => {
    play();
    startMusic();
  };

  const handleTapBlow = () => {
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

      {/* Flow: 1) Start music → 2) Enable mic → 3) Blow */}
      {!musicStarted ? (
        <button
          className="w-full max-w-xs h-14 rounded-full bg-pink text-white font-semibold text-lg shadow-lg active:bg-pink/80 transition-colors"
          onTouchEnd={(e) => { e.preventDefault(); handleStartMusic(); }}
          onClick={handleStartMusic}
        >
          🎵 Tocá para escuchar
        </button>
      ) : micState === "idle" ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm text-cookie-dark/60">
            ¡Ahora soplá las velas!
          </p>
          <button
            className="w-full max-w-xs h-14 rounded-full bg-cookie-brown text-white font-semibold text-lg shadow-lg active:bg-cookie-dark transition-colors"
            onTouchEnd={(e) => { e.preventDefault(); startMic(); }}
            onClick={startMic}
          >
            🎤 Activar micrófono
          </button>
        </div>
      ) : micState === "active" ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <motion.div
            className="flex items-center gap-2 text-sm text-cookie-dark/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Escuchando... ¡soplá las velas!
          </motion.div>

          <p className="text-sm text-cookie-dark/60">
            {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
          </p>

          {/* Tap fallback */}
          <button
            className="text-xs text-cookie-dark/40 underline active:text-cookie-dark/60 min-h-[44px] flex items-center"
            onTouchEnd={(e) => { e.preventDefault(); handleTapBlow(); }}
            onClick={handleTapBlow}
          >
            o tocá aquí para soplar
          </button>

          {candlesLit > 0 && candlesLit < 10 && (
            <button
              className="text-xs text-cookie-dark/30 underline active:text-cookie-dark/50 min-h-[44px] flex items-center"
              onTouchEnd={(e) => { e.preventDefault(); blowAllCandles(); }}
              onClick={blowAllCandles}
            >
              apagar todas
            </button>
          )}
        </div>
      ) : (
        /* Mic denied — tap-only fallback */
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm text-cookie-dark/60">
            Micrófono no disponible — ¡tocá para soplar!
          </p>
          <p className="text-sm text-cookie-dark/60">
            {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
          </p>

          <button
            className="w-full max-w-xs h-14 rounded-full bg-cookie-brown text-white font-semibold text-lg shadow-lg active:bg-cookie-dark active:scale-95 transition-all"
            onTouchEnd={(e) => { e.preventDefault(); handleTapBlow(); }}
            onClick={handleTapBlow}
          >
            Tocá para soplar 💨
          </button>

          {candlesLit > 0 && candlesLit < 10 && (
            <button
              className="text-xs text-cookie-dark/30 underline active:text-cookie-dark/50 min-h-[44px] flex items-center"
              onTouchEnd={(e) => { e.preventDefault(); blowAllCandles(); }}
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
