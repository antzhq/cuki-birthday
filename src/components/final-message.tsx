"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { PHOTO_FILES, PHOTO_CAPTIONS } from "@/lib/constants";
import { NavBar } from "./nav-bar";
import Image from "next/image";

export function FinalMessage() {
  const { relightCandles, setPhase } = useBirthdayStore();

  return (
    <motion.div
      className="flex flex-col items-center gap-5 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <NavBar
        title="🍪 ¡Felices 18, Cuki! 🍪"
        onBack={() => setPhase("gallery")}
        backLabel="← Galería"
      />

      <motion.p
        className="text-center text-cookie-dark/80 text-sm leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ¡Desbloqueaste todos los recuerdos! Cada una de estas fotos
        es un recordatorio de lo especial que sos. Bienvenida a la
        adultez — el mundo tiene suerte de tenerte.
        <br /><br />
        Te quiero mucho, hermanita. 💖
      </motion.p>

      {/* Full gallery */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {PHOTO_FILES.map((src, i) => (
          <motion.div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
          >
            <Image
              src={src}
              alt={PHOTO_CAPTIONS[i]}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 33vw, 140px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
              <p className="text-white text-[10px] text-center leading-tight">
                {PHOTO_CAPTIONS[i]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 w-full pb-4">
        <motion.button
          className="w-full h-12 rounded-full bg-cookie-brown text-white font-medium shadow-md active:bg-cookie-dark transition-colors"
          onClick={relightCandles}
          whileTap={{ scale: 0.95 }}
        >
          🕯️ ¡Soplar las velas de nuevo!
        </motion.button>

        <button
          className="text-sm text-cookie-dark/40 active:text-cookie-dark/60 min-h-[44px] flex items-center"
          onClick={() => setPhase("video")}
        >
          Ver el video de nuevo
        </button>
      </div>
    </motion.div>
  );
}
