"use client";

import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { NavBar } from "./nav-bar";

export function VideoPlayer() {
  const { relightCandles, goToGallery } = useBirthdayStore();

  return (
    <motion.div
      className="flex flex-col items-center gap-4 w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <NavBar
        title="🎉 ¡Las apagaste todas!"
        onBack={relightCandles}
        backLabel="← Velas"
      />

      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-cookie-dark/10">
        <video
          className="w-full h-full object-cover"
          controls
          autoPlay
          preload="metadata"
          poster="/video/poster.jpg"
        >
          <source src="/video/birthday.mp4" type="video/mp4" />
          Tu navegador no soporta video.
        </video>
      </div>

      <motion.button
        className="w-full h-12 rounded-full bg-cookie-brown text-white font-medium shadow-md active:bg-cookie-dark transition-colors"
        onClick={goToGallery}
        whileTap={{ scale: 0.95 }}
      >
        Ir a la Galería →
      </motion.button>
    </motion.div>
  );
}
