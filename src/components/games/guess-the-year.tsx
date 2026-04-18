"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { BIRTH_YEAR, CURRENT_YEAR, GUESS_YEAR_ANSWER } from "@/lib/constants";
import { UnlockAnimation } from "../unlock-animation";
import Image from "next/image";

export function GuessTheYear() {
  const { completeGame, exitGame } = useBirthdayStore();
  const [guess, setGuess] = useState(Math.floor((BIRTH_YEAR + CURRENT_YEAR) / 2));
  const [submitted, setSubmitted] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const distance = Math.abs(guess - GUESS_YEAR_ANSWER);
  const maxDistance = CURRENT_YEAR - BIRTH_YEAR;
  const blurAmount = Math.round((distance / maxDistance) * 20);
  const isCorrect = distance === 0;

  const handleSubmit = () => {
    if (isCorrect) {
      setSubmitted(true);
      setTimeout(() => setShowUnlock(true), 1000);
    }
  };

  if (showUnlock) {
    return (
      <UnlockAnimation count={3} onDone={() => completeGame("guess-year")} />
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-5 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between w-full">
        <button
          className="text-sm text-cookie-dark/50 hover:text-cookie-dark"
          onClick={exitGame}
        >
          ← Volver
        </button>
        <h2 className="text-xl font-bold text-cookie-dark">
          📅 Adiviná el Año
        </h2>
        <div />
      </div>

      <p className="text-sm text-cookie-dark/60 text-center">
        ¿Cuándo se tomó esta foto? Deslizá para adivinar — ¡la foto se aclara
        cuando te acercás!
      </p>

      <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-lg">
        <Image
          src="/photos/CumpleCuki5.jpg"
          alt="Adiviná cuándo se tomó"
          fill
          className="object-cover transition-all duration-300"
          style={{ filter: `blur(${blurAmount}px)` }}
          sizes="320px"
        />
        {submitted && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-4xl">🎉</span>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-xs flex flex-col gap-2">
        <input
          type="range"
          min={BIRTH_YEAR}
          max={CURRENT_YEAR}
          value={guess}
          onChange={(e) => setGuess(Number(e.target.value))}
          disabled={submitted}
          className="w-full accent-cookie-brown"
        />
        <div className="flex justify-between text-xs text-cookie-dark/50">
          <span>{BIRTH_YEAR}</span>
          <span className="text-lg font-bold text-cookie-dark">{guess}</span>
          <span>{CURRENT_YEAR}</span>
        </div>
      </div>

      {!submitted && (
        <p className="text-sm text-cookie-dark/60">
          {distance === 0
            ? "🎯 ¡Perfecto! ¡Ese es!"
            : distance <= 2
            ? "🔥 ¡Muy cerca!"
            : distance <= 5
            ? "🤔 Te estás acercando..."
            : "❄️ Todavía no..."}
        </p>
      )}

      <motion.button
        className={`px-6 py-2 rounded-full font-medium shadow-md transition-colors ${
          isCorrect
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-cookie-brown/30 text-cookie-dark/50 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={!isCorrect || submitted}
        whileHover={isCorrect ? { scale: 1.05 } : {}}
        whileTap={isCorrect ? { scale: 0.95 } : {}}
      >
        {isCorrect ? "¡Confirmar! ✓" : "Deslizá al año correcto"}
      </motion.button>
    </motion.div>
  );
}
