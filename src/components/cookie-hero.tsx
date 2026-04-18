"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { Candle } from "./candle";
import { BlowDetector } from "./blow-detector";
import { TOTAL_CANDLES } from "@/lib/constants";

export function CookieHero() {
  const {
    phase,
    candlesLit,
    hasVisitedGallery,
    setPhase,
    blowCandle,
    blowAllCandles,
    goToGallery,
  } = useBirthdayStore();

  const handleBlow = () => {
    const toExtinguish = Math.min(candlesLit, 2 + Math.floor(Math.random() * 2));
    for (let i = 0; i < toExtinguish; i++) {
      setTimeout(() => blowCandle(), i * 150);
    }
  };

  const candles = Array.from({ length: TOTAL_CANDLES }, (_, i) => i);

  return (
    <motion.div
      className="flex flex-col items-center gap-5 select-none w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-2xl font-bold text-cookie-dark text-center leading-tight"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ¡Feliz cumpleaños #18
        <br />
        <span className="text-4xl text-pink">Cuki!</span>
      </motion.h1>

      {/* Cookie */}
      <div className="relative">
        <motion.div
          className="relative w-56 h-56 rounded-full shadow-2xl flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, #E8C99B, #C68B59 50%, #8B5E3C 100%)",
            boxShadow:
              "inset 0 -4px 8px rgba(0,0,0,0.2), 0 8px 32px rgba(139,94,60,0.4)",
          }}
        >
          {/* Chocolate chips */}
          {[
            { top: "25%", left: "30%", size: 12 },
            { top: "40%", left: "55%", size: 14 },
            { top: "55%", left: "35%", size: 10 },
            { top: "35%", left: "70%", size: 11 },
            { top: "60%", left: "60%", size: 13 },
            { top: "70%", left: "40%", size: 10 },
            { top: "30%", left: "45%", size: 9 },
            { top: "50%", left: "25%", size: 12 },
          ].map((chip, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: chip.top,
                left: chip.left,
                width: chip.size,
                height: chip.size * 0.8,
                background:
                  "radial-gradient(circle at 30% 30%, #5C3317, #2C1810)",
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}

          {/* Candles */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
            {candles.map((i) => (
              <Candle key={i} index={i} lit={i < candlesLit} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      {phase === "landing" && (
        <div className="flex flex-col items-center gap-3 w-full">
          <motion.button
            className="w-full max-w-xs h-12 rounded-full bg-cookie-brown text-white font-semibold text-base shadow-lg active:bg-cookie-dark transition-colors"
            onClick={() => setPhase("blowing")}
            whileTap={{ scale: 0.95 }}
          >
            ¡Pedí un deseo y soplá! 🌬️
          </motion.button>

          {hasVisitedGallery && (
            <button
              className="text-sm text-cookie-dark/50 active:text-cookie-dark/70 min-h-[44px]"
              onClick={goToGallery}
            >
              Ir a la galería →
            </button>
          )}
        </div>
      )}

      {phase === "blowing" && (
        <div className="flex flex-col items-center gap-3 w-full">
          <BlowDetector onBlow={handleBlow} />

          <p className="text-sm text-cookie-dark/60 text-center">
            {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
          </p>

          <motion.button
            className="w-full max-w-xs h-12 rounded-full bg-gold/20 text-cookie-dark font-medium text-sm border border-gold/40 active:bg-gold/30 transition-colors"
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
