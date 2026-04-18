"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface BirthdayCakeProps {
  candlesLit: number;
  totalCandles: number;
}

export function BirthdayCake({ candlesLit, totalCandles }: BirthdayCakeProps) {
  const candles = Array.from({ length: totalCandles }, (_, i) => i);
  const prevLitRef = useRef(candlesLit);
  const [smokeCandles, setSmokeCandles] = useState<number[]>([]);

  // WHY: Track which candles just went out so we can show smoke on those
  useEffect(() => {
    if (candlesLit < prevLitRef.current) {
      const newlyOut: number[] = [];
      for (let i = candlesLit; i < prevLitRef.current; i++) {
        newlyOut.push(i);
      }
      setSmokeCandles((prev) => [...prev, ...newlyOut]);

      setTimeout(() => {
        setSmokeCandles((prev) => prev.filter((c) => !newlyOut.includes(c)));
      }, 1800);
    }
    prevLitRef.current = candlesLit;
  }, [candlesLit]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Candles */}
      <div className="flex items-end justify-center gap-[6px] mb-[-2px] relative z-10 px-2">
        {candles.map((i) => {
          const lit = i < candlesLit;
          const showSmoke = smokeCandles.includes(i);
          const colors = [
            "#E8587A", "#E8A838", "#6BC5D2", "#E86B6B",
            "#7BC88F", "#C490D1",
          ];
          const color = colors[i % colors.length];

          return (
            <div key={i} className="flex flex-col items-center relative">
              {/* Dramatic smoke + flash — when candle goes out */}
              <AnimatePresence>
                {showSmoke && (
                  <>
                    {/* Flash of light where flame was */}
                    <motion.div
                      className="absolute -top-2 left-1/2 w-3 h-3 rounded-full"
                      style={{ background: "rgba(255,220,100,0.9)" }}
                      initial={{ opacity: 1, scale: 1, x: "-50%" }}
                      animate={{ opacity: 0, scale: 3 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Big main smoke */}
                    <motion.div
                      className="absolute -top-3 left-1/2 w-[5px] h-[5px] rounded-full"
                      style={{ background: "rgba(160,160,170,0.7)" }}
                      initial={{ opacity: 0.9, y: 0, x: "-50%", scale: 0.5 }}
                      animate={{ opacity: 0, y: -35, x: "-20%", scale: 4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    {/* Secondary smoke — drifts left */}
                    <motion.div
                      className="absolute -top-3 left-1/2 w-[4px] h-[4px] rounded-full"
                      style={{ background: "rgba(150,150,160,0.5)" }}
                      initial={{ opacity: 0.7, y: 0, x: "-60%", scale: 0.5 }}
                      animate={{ opacity: 0, y: -28, x: "-120%", scale: 3.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.08 }}
                    />
                    {/* Tertiary smoke — drifts right */}
                    <motion.div
                      className="absolute -top-3 left-1/2 w-[3px] h-[3px] rounded-full"
                      style={{ background: "rgba(170,170,175,0.4)" }}
                      initial={{ opacity: 0.6, y: 0, x: "-30%", scale: 0.5 }}
                      animate={{ opacity: 0, y: -40, x: "60%", scale: 3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.3, ease: "easeOut", delay: 0.04 }}
                    />
                    {/* Wispy tail */}
                    <motion.div
                      className="absolute -top-2 left-1/2 w-[2px] h-[2px] rounded-full"
                      style={{ background: "rgba(180,180,185,0.3)" }}
                      initial={{ opacity: 0.5, y: 0, x: "-45%", scale: 0.5 }}
                      animate={{ opacity: 0, y: -50, x: "-10%", scale: 2.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.15 }}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Flame */}
              <AnimatePresence>
                {lit && (
                  <motion.div
                    className="relative mb-[-1px]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                  >
                    <motion.div
                      className="absolute -inset-2 rounded-full blur-md"
                      style={{ background: "rgba(255, 180, 50, 0.35)" }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 0.5 + i * 0.03, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-[6px] h-[13px]"
                      style={{
                        background: "linear-gradient(to top, #E8871E, #FFD866, #FFFDE8)",
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                      }}
                      animate={{
                        scaleY: [1, 1.2, 0.85, 1.1, 1],
                        scaleX: [1, 0.85, 1.15, 0.9, 1],
                      }}
                      transition={{ duration: 0.35 + i * 0.02, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Candle stick */}
              <div
                className="w-[5px] h-[26px] rounded-t-sm"
                style={{
                  background: `linear-gradient(180deg, ${color}, ${color}dd)`,
                  boxShadow: `0 0 3px ${color}40`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Cake */}
      <div className="relative" style={{ filter: "drop-shadow(0 8px 24px rgba(80,40,10,0.18))" }}>
        {/* Top tier */}
        <div
          className="relative mx-auto w-56 h-12 rounded-t-xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF5E8 0%, #FFE0C0 60%, #F5C89A 100%)",
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-[10px]"
            style={{ background: "linear-gradient(180deg, transparent 0%, #E8587A 100%)" }}
          />
          {[16, 36, 60, 84, 108, 130, 152, 174, 196].map((left, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3, height: 3,
                top: 3 + (i % 3) * 3,
                left,
                background: ["#E8587A", "#E8A838", "#6BC5D2", "#7BC88F", "#C490D1"][i % 5],
              }}
            />
          ))}
        </div>

        {/* Middle tier */}
        <div
          className="relative mx-auto w-[272px] h-14"
          style={{
            background: "linear-gradient(180deg, #F4A0B0 0%, #E8587A 100%)",
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[3px]"
            style={{ background: "rgba(255,255,255,0.35)" }}
          />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
        </div>

        {/* Bottom tier */}
        <div
          className="relative mx-auto w-[310px] h-[60px] rounded-b-lg"
          style={{
            background: "linear-gradient(180deg, #FFD4A8 0%, #D4A06A 100%)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[6px]"
            style={{ background: "linear-gradient(180deg, #E8587A80, transparent)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-2xl font-black tracking-wider"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(255,255,255,0.85)",
                textShadow: "0 1px 3px rgba(120,60,20,0.3)",
              }}
            >
              18
            </span>
          </div>
        </div>

        {/* Plate */}
        <div
          className="mx-auto w-[324px] h-[7px] rounded-b-2xl"
          style={{
            background: "linear-gradient(180deg, #EAEAEA, #D8D8D8)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        />
      </div>
    </div>
  );
}
