"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface UnlockAnimationProps {
  count: number;
  onDone: () => void;
}

export function UnlockAnimation({ count, onDone }: UnlockAnimationProps) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);

  useEffect(() => {
    const emojis = ["🎉", "✨", "🍪", "💖", "⭐", "🎈"];
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      emoji: emojis[i % emojis.length],
    }));
    setParticles(generated);

    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-4xl font-bold text-gold text-center"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.5 }}
      >
        🔓 ¡{count} fotos desbloqueadas!
      </motion.div>

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-2xl"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </motion.div>
  );
}
