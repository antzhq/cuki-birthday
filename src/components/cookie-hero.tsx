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
    <motion.div
      className="flex flex-col items-center gap-6 select-none w-full max-w-md mx-auto px-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Title */}
      <div className="text-center">
        <motion.h1
          className="text-4xl font-black text-pink"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          Feliz Cumple Cuki
        </motion.h1>
        <motion.p
          className="text-sm text-cookie-dark/55 mt-2 leading-relaxed max-w-[260px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Yo sé que no soy el hermano perfecto pero de verdad te quiero mucho
        </motion.p>
      </div>

      {/* Cake */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <BirthdayCake candlesLit={candlesLit} totalCandles={TOTAL_CANDLES} />
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-col items-center gap-3 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {!musicStarted ? (
          <button
            className="w-full max-w-xs h-14 rounded-full font-semibold text-base shadow-lg transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #E8587A, #D44060)",
              color: "white",
              boxShadow: "0 4px 20px rgba(232,88,122,0.35)",
            }}
            onTouchEnd={(e) => { e.preventDefault(); handleStartMusic(); }}
            onClick={handleStartMusic}
          >
            🎵 Tocá para escuchar
          </button>
        ) : micState === "idle" ? (
          <>
            <p className="text-sm text-cookie-dark/50 font-medium">
              ¡Ahora soplá las velas!
            </p>
            <button
              className="w-full max-w-xs h-14 rounded-full font-semibold text-base shadow-lg transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #B8784A, #8A5530)",
                color: "white",
                boxShadow: "0 4px 20px rgba(138,85,48,0.3)",
              }}
              onTouchEnd={(e) => { e.preventDefault(); startMic(); }}
              onClick={startMic}
            >
              🎤 Activar micrófono
            </button>
          </>
        ) : micState === "active" ? (
          <>
            <motion.div
              className="flex items-center gap-2 text-sm font-medium text-cookie-dark/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              Escuchando...
            </motion.div>

            <p className="text-xs text-cookie-dark/40">
              {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
            </p>

            {/* Blow indicator banner */}
            <motion.div
              className="w-full max-w-xs flex flex-col items-center gap-1 py-3 px-4 rounded-2xl"
              style={{ background: "rgba(232,168,56,0.1)", border: "1px solid rgba(232,168,56,0.2)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.p
                className="text-sm font-semibold text-cookie-dark/70"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ¡Soplá hacia abajo!
              </motion.p>
              <motion.div
                className="text-2xl"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                👇
              </motion.div>
              <p className="text-[10px] text-cookie-dark/40">
                Soplá en el puerto de carga
              </p>
            </motion.div>

            <button
              className="text-xs text-cookie-dark/35 underline decoration-dotted active:text-cookie-dark/55 min-h-[44px] flex items-center"
              onTouchEnd={(e) => { e.preventDefault(); handleTapBlow(); }}
              onClick={handleTapBlow}
            >
              o tocá aquí para soplar
            </button>

            {candlesLit > 0 && candlesLit < 10 && (
              <button
                className="text-[10px] text-cookie-dark/25 active:text-cookie-dark/40 min-h-[36px] flex items-center"
                onTouchEnd={(e) => { e.preventDefault(); blowAllCandles(); }}
                onClick={blowAllCandles}
              >
                apagar todas
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-cookie-dark/50 font-medium text-center">
              Micrófono no disponible
            </p>
            <p className="text-xs text-cookie-dark/40">
              {candlesLit} vela{candlesLit !== 1 ? "s" : ""} restante{candlesLit !== 1 ? "s" : ""}
            </p>
            <button
              className="w-full max-w-xs h-14 rounded-full font-semibold text-base shadow-lg transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #B8784A, #8A5530)",
                color: "white",
                boxShadow: "0 4px 20px rgba(138,85,48,0.3)",
              }}
              onTouchEnd={(e) => { e.preventDefault(); handleTapBlow(); }}
              onClick={handleTapBlow}
            >
              Tocá para soplar 💨
            </button>
            {candlesLit > 0 && candlesLit < 10 && (
              <button
                className="text-[10px] text-cookie-dark/25 active:text-cookie-dark/40 min-h-[36px] flex items-center"
                onTouchEnd={(e) => { e.preventDefault(); blowAllCandles(); }}
                onClick={blowAllCandles}
              >
                apagar todas
              </button>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
