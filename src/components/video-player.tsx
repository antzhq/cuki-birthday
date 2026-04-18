"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";

export function VideoPlayer() {
  const setPhase = useBirthdayStore((s) => s.setPhase);

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-cookie-dark text-center">
        🎉 ¡Las apagaste todas!
      </h2>

      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-cookie-dark/10">
        <video
          className="w-full h-full object-cover"
          controls
          autoPlay
          preload="metadata"
          poster="/video/poster.jpg"
          onEnded={() => setPhase("gallery")}
        >
          <source src="/video/birthday.mp4" type="video/mp4" />
          Tu navegador no soporta video.
        </video>
      </div>

      <motion.button
        className="px-6 py-2 rounded-full bg-cookie-brown text-white font-medium shadow-md hover:bg-cookie-dark transition-colors"
        onClick={() => setPhase("gallery")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Ir a la Galería →
      </motion.button>
    </motion.div>
  );
}
