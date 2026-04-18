"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BirthdayCakeProps {
  candlesLit: number;
  totalCandles: number;
}

export function BirthdayCake({ candlesLit, totalCandles }: BirthdayCakeProps) {
  const candles = Array.from({ length: totalCandles }, (_, i) => i);

  return (
    <div className="relative flex flex-col items-center">
      {/* Candles row — sitting ON the cake top */}
      <div className="flex items-end justify-center gap-[6px] mb-[-2px] relative z-10 px-4">
        {candles.map((i) => {
          const lit = i < candlesLit;
          // Alternate candle colors for a festive look
          const colors = ["#FF69B4", "#FFD700", "#87CEEB", "#FF6B6B", "#98FB98", "#DDA0DD"];
          const color = colors[i % colors.length];

          return (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <AnimatePresence>
                {lit && (
                  <motion.div
                    className="relative mb-[-1px]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, y: -10, transition: { duration: 0.3 } }}
                  >
                    {/* Glow */}
                    <motion.div
                      className="absolute -inset-1.5 rounded-full blur-sm"
                      style={{ background: "rgba(255, 200, 50, 0.4)" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 0.6 + i * 0.03, repeat: Infinity }}
                    />
                    {/* Flame shape */}
                    <motion.div
                      className="w-[5px] h-[10px]"
                      style={{
                        background: "linear-gradient(to top, #FF8C00, #FFE066, #FFF)",
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                      }}
                      animate={{
                        scaleY: [1, 1.15, 0.9, 1.05, 1],
                        scaleX: [1, 0.9, 1.1, 0.95, 1],
                      }}
                      transition={{ duration: 0.4 + i * 0.02, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Candle stick */}
              <div
                className="w-[4px] h-[22px] rounded-t-sm"
                style={{ background: color }}
              />
            </div>
          );
        })}
      </div>

      {/* Cake body */}
      <div className="relative">
        {/* Top tier — small */}
        <div className="relative mx-auto w-48 h-10 rounded-t-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF0E0 0%, #FFDAB9 100%)",
            boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Frosting drips */}
          <div className="absolute bottom-0 left-0 right-0 h-3"
            style={{ background: "linear-gradient(180deg, transparent, #FF69B4)" }}
          />
          {/* Sprinkles */}
          {[15, 30, 55, 75, 90, 110, 130, 150].map((left, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                top: 4 + (i % 3) * 3,
                left,
                background: ["#FF69B4", "#FFD700", "#87CEEB", "#98FB98"][i % 4],
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>

        {/* Middle tier */}
        <div className="relative mx-auto w-56 h-12"
          style={{
            background: "linear-gradient(180deg, #FFB6C1 0%, #FF91A4 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Cream stripe */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        </div>

        {/* Bottom tier — widest */}
        <div className="relative mx-auto w-64 h-14 rounded-b-lg"
          style={{
            background: "linear-gradient(180deg, #FFDAB9 0%, #DEB887 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {/* Frosting drips from middle */}
          <div className="absolute top-0 left-0 right-0 h-3"
            style={{ background: "linear-gradient(180deg, #FF91A4, transparent)" }}
          />
          {/* "18" text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white/80 drop-shadow-md">18</span>
          </div>
        </div>

        {/* Plate */}
        <div className="mx-auto w-72 h-3 rounded-b-xl"
          style={{
            background: "linear-gradient(180deg, #E8E8E8, #D0D0D0)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
}
