"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { TRIVIA_QUESTIONS } from "@/lib/constants";
import { UnlockAnimation } from "../unlock-animation";
import { NavBar } from "../nav-bar";

export function Trivia() {
  const { completeGame, exitGame } = useBirthdayStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const question = TRIVIA_QUESTIONS[currentQ];
  const isLast = currentQ === TRIVIA_QUESTIONS.length - 1;

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    const correct = index === question.correctIndex;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (isLast) {
        setShowResult(true);
      } else {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      }
    }, 1200);
  };

  const handleFinish = () => {
    setShowUnlock(true);
  };

  if (showUnlock) {
    return (
      <UnlockAnimation count={3} onDone={() => completeGame("trivia")} />
    );
  }

  if (showResult) {
    return (
      <motion.div
        className="flex flex-col items-center gap-5 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-bold text-cookie-dark">¡Resultados!</h2>
        <p className="text-5xl">
          {score === TRIVIA_QUESTIONS.length
            ? "🏆"
            : score >= TRIVIA_QUESTIONS.length / 2
            ? "🎉"
            : "💪"}
        </p>
        <p className="text-lg text-cookie-dark">
          {score} / {TRIVIA_QUESTIONS.length} correctas
        </p>
        <p className="text-sm text-cookie-dark/60">
          {score === TRIVIA_QUESTIONS.length
            ? "¡Realmente conocés a Cuki!"
            : "¡Igual desbloqueaste las fotos!"}
        </p>
        <motion.button
          className="w-full h-12 rounded-full bg-cookie-brown text-white font-medium shadow-md active:bg-cookie-dark"
          onClick={handleFinish}
          whileTap={{ scale: 0.95 }}
        >
          ¡Reclamar fotos! 🔓
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <NavBar
        title="❓ Trivia de Cuki"
        onBack={exitGame}
        right={
          <span className="text-xs text-cookie-dark/50">
            {currentQ + 1}/{TRIVIA_QUESTIONS.length}
          </span>
        }
      />

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-cookie-light/30 rounded-full overflow-hidden -mt-2">
        <motion.div
          className="h-full bg-gold rounded-full"
          animate={{
            width: `${((currentQ + 1) / TRIVIA_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="w-full flex flex-col gap-3"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-base font-semibold text-cookie-dark text-center py-3">
            {question.question}
          </p>

          <div className="flex flex-col gap-2">
            {question.options.map((option, i) => {
              let bg = "bg-white border-cookie-light active:border-gold";
              if (selected !== null) {
                if (i === question.correctIndex) {
                  bg = "bg-green-100 border-green-400";
                } else if (i === selected) {
                  bg = "bg-red-100 border-red-400";
                }
              }

              return (
                <motion.button
                  key={i}
                  className={`w-full p-3.5 rounded-xl border-2 text-left text-sm font-medium text-cookie-dark transition-colors min-h-[48px] ${bg}`}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  whileTap={{ scale: 0.97 }}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
