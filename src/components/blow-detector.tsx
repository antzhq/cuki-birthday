"use client";

import { motion } from "framer-motion";
import { useBlowDetection } from "@/hooks/use-blow-detection";

interface BlowDetectorProps {
  onBlow: () => void;
}

export function BlowDetector({ onBlow }: BlowDetectorProps) {
  const { micActive, permissionDenied, startMic } = useBlowDetection({
    onBlow,
    enabled: true,
  });

  if (permissionDenied) {
    return (
      <p className="text-sm text-cookie-dark/60 text-center">
        Micrófono no disponible — ¡usá el botón de abajo!
      </p>
    );
  }

  if (!micActive) {
    return (
      <motion.button
        className="px-6 py-2 rounded-full bg-pink/20 text-pink font-medium text-sm border border-pink/40 hover:bg-pink/30 transition-colors"
        onClick={startMic}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎤 Activar micrófono para soplar
      </motion.button>
    );
  }

  return (
    <motion.div
      className="flex items-center gap-2 text-sm text-cookie-dark/70"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="w-2 h-2 rounded-full bg-green-500" />
      Escuchando... ¡soplá al micrófono!
    </motion.div>
  );
}
