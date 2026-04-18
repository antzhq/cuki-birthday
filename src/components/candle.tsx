"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CandleProps {
  lit: boolean;
  index: number;
}

export function Candle({ lit, index }: CandleProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            key={`flame-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
              y: -20,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            className="relative mb-[-2px]"
          >
            {/* Outer glow */}
            <motion.div
              className="absolute -inset-2 rounded-full bg-flame-orange/30 blur-md"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 0.8 + index * 0.05,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Flame body */}
            <motion.div
              className="w-2 h-4 rounded-full bg-gradient-to-t from-flame-orange via-flame-yellow to-white"
              style={{
                animation: `candle-flicker ${0.3 + index * 0.02}s ease-in-out infinite`,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candle stick */}
      <div
        className="w-1.5 h-6 rounded-t-sm"
        style={{
          background: `hsl(${340 + (index % 6) * 10}, 70%, ${65 + (index % 3) * 10}%)`,
        }}
      />
    </div>
  );
}
