"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { MEMORY_ICONS } from "@/lib/constants";
import { UnlockAnimation } from "../unlock-animation";

interface Card {
  id: number;
  icon: string;
  matched: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(): Card[] {
  const pairs = MEMORY_ICONS.flatMap((icon, i) => [
    { id: i * 2, icon, matched: false },
    { id: i * 2 + 1, icon, matched: false },
  ]);
  return shuffleArray(pairs);
}

export function MemoryMatch() {
  const { completeGame, exitGame } = useBirthdayStore();
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [moves, setMoves] = useState(0);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      setShowUnlock(true);
    }
  }, [allMatched, cards.length]);

  const handleFlip = useCallback(
    (id: number) => {
      if (checking || flipped.includes(id)) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.matched) return;

      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setChecking(true);
        setMoves((m) => m + 1);
        const [first, second] = newFlipped.map((fid) =>
          cards.find((c) => c.id === fid)!
        );

        if (first.icon === second.icon) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first.id || c.id === second.id
                  ? { ...c, matched: true }
                  : c
              )
            );
            setFlipped([]);
            setChecking(false);
          }, 500);
        } else {
          setTimeout(() => {
            setFlipped([]);
            setChecking(false);
          }, 800);
        }
      }
    },
    [cards, flipped, checking]
  );

  if (showUnlock) {
    return (
      <UnlockAnimation count={4} onDone={() => completeGame("memory")} />
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between w-full">
        <button
          className="text-sm text-cookie-dark/50 hover:text-cookie-dark"
          onClick={exitGame}
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-cookie-dark">🧠 Memory Match</h2>
        <span className="text-sm text-cookie-dark/50">{moves} moves</span>
      </div>

      <p className="text-sm text-cookie-dark/60">Find all matching pairs!</p>

      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <motion.button
              key={card.id}
              className={`aspect-square rounded-lg text-2xl flex items-center justify-center font-bold transition-colors ${
                card.matched
                  ? "bg-green-100 border-2 border-green-300"
                  : isFlipped
                  ? "bg-cream border-2 border-gold"
                  : "bg-cookie-brown/20 border-2 border-cookie-light hover:bg-cookie-brown/30"
              }`}
              onClick={() => handleFlip(card.id)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isFlipped ? (
                  <motion.span
                    key="icon"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.icon}
                  </motion.span>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.2 }}
                    className="text-cookie-brown/40"
                  >
                    🍪
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
