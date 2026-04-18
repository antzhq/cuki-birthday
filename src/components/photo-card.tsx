"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PhotoCardProps {
  src: string;
  caption: string;
  unlocked: boolean;
  index: number;
}

export function PhotoCard({ src, caption, unlocked, index }: PhotoCardProps) {
  return (
    <motion.div
      className="relative aspect-square rounded-xl overflow-hidden shadow-md bg-cookie-light/30"
      initial={false}
      animate={unlocked ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Image
        src={src}
        alt={unlocked ? caption : "Locked photo"}
        fill
        className={`object-cover transition-all duration-700 ${
          unlocked ? "blur-0 saturate-100" : "blur-xl saturate-50 brightness-50"
        }`}
        sizes="(max-width: 640px) 33vw, 150px"
      />

      {/* Lock overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>
      )}

      {/* Caption on hover/tap when unlocked */}
      {unlocked && (
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <p className="text-white text-xs text-center leading-tight">
            {caption}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
