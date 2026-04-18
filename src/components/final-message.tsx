"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { PHOTO_FILES, PHOTO_CAPTIONS } from "@/lib/constants";
import Image from "next/image";

export function FinalMessage() {
  const { relightCandles, setPhase } = useBirthdayStore();

  return (
    <motion.div
      className="flex flex-col items-center gap-8 w-full py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h2
        className="text-3xl font-bold text-cookie-dark text-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        🍪 ¡Felices 18, Cuki! 🍪
      </motion.h2>

      <motion.p
        className="text-center text-cookie-dark/80 max-w-sm leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ¡Desbloqueaste todos los recuerdos! Cada una de estas fotos
        es un recordatorio de lo especial que sos. Bienvenida a la
        adultez — el mundo tiene suerte de tenerte.
        <br /><br />
        Te quiero mucho, hermanita. 💖
      </motion.p>

      <div className="grid grid-cols-3 gap-2 w-full">
        {PHOTO_FILES.map((src, i) => (
          <motion.div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <Image
              src={src}
              alt={PHOTO_CAPTIONS[i]}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 150px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
              <p className="text-white text-[10px] text-center leading-tight">
                {PHOTO_CAPTIONS[i]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.button
          className="px-6 py-2 rounded-full bg-cookie-brown text-white font-medium shadow-md hover:bg-cookie-dark transition-colors"
          onClick={relightCandles}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🕯️ ¡Soplar las velas de nuevo!
        </motion.button>

        <button
          className="text-sm text-cookie-dark/40 hover:text-cookie-dark/60 transition-colors"
          onClick={() => setPhase("video")}
        >
          Ver el video de nuevo
        </button>
      </div>
    </motion.div>
  );
}
