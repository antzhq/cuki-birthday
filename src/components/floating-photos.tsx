"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHOTO_FILES } from "@/lib/constants";
import { useBirthdayStore } from "@/lib/store";
import Image from "next/image";

interface PhotoState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  phase: "dropping" | "floating";
}

const PHOTO_SIZE = 180;
const GRAVITY = 0.5;
const FLOAT_SPEED = 1.5;

export function FloatingPhotos() {
  const reset = useBirthdayStore((s) => s.reset);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [openPhoto, setOpenPhoto] = useState<number | null>(null);
  const photosRef = useRef<PhotoState[]>([]);
  const animRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const pausedRef = useRef(false);

  // Pause/resume animation when lightbox opens/closes
  useEffect(() => {
    pausedRef.current = openPhoto !== null;
  }, [openPhoto]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    dimsRef.current = { w, h };

    const initial: PhotoState[] = PHOTO_FILES.map((_, i) => ({
      id: i,
      x: Math.random() * (w - PHOTO_SIZE),
      y: -PHOTO_SIZE - i * 120 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      rotation: (Math.random() - 0.5) * 20,
      phase: "dropping" as const,
    }));

    photosRef.current = initial;
    setPhotos(initial);

    const tick = () => {
      if (!pausedRef.current) {
        const { w, h } = dimsRef.current;

        photosRef.current = photosRef.current.map((p) => {
          let { x, y, vx, vy, rotation, phase } = p;

          if (phase === "dropping") {
            vy += GRAVITY;
            y += vy;
            x += vx;

            if (y + PHOTO_SIZE >= h) {
              y = h - PHOTO_SIZE;
              vx = (Math.random() - 0.5) * FLOAT_SPEED * 2;
              vy = -(Math.random() * FLOAT_SPEED + 0.5);
              phase = "floating";
            }
          } else {
            x += vx;
            y += vy;

            if (y + PHOTO_SIZE > h) { y = h - PHOTO_SIZE; vy = -Math.abs(vy); }
            if (y < 0) { y = 0; vy = Math.abs(vy); }
            if (x + PHOTO_SIZE > w) { x = w - PHOTO_SIZE; vx = -Math.abs(vx); }
            if (x < 0) { x = 0; vx = Math.abs(vx); }
          }

          rotation += vx * 0.3;
          return { ...p, x, y, vx, vy, rotation, phase };
        });

        setPhotos([...photosRef.current]);
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    const handleResize = () => {
      dimsRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDownload = useCallback(async (photoIndex: number) => {
    const src = PHOTO_FILES[photoIndex];
    const response = await fetch(src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CumpleCuki${photoIndex + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden">
      {/* Title */}
      <motion.div
        className="absolute top-8 left-0 right-0 z-30 text-center pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="text-2xl font-bold text-cookie-dark">
          🍪 ¡Felices 18, Cuki! 🍪
        </h1>
        <p className="text-sm text-cookie-dark/60 mt-1">
          Te quiero mucho, hermanita 💖
        </p>
      </motion.div>

      {/* Floating photos */}
      {photos.map((photo) => (
        <button
          key={photo.id}
          className="absolute rounded-2xl overflow-hidden shadow-xl border-3 border-white cursor-pointer"
          style={{
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg)`,
            willChange: "transform",
          }}
          onClick={() => setOpenPhoto(photo.id)}
        >
          <Image
            src={PHOTO_FILES[photo.id]}
            alt={`Foto ${photo.id + 1}`}
            fill
            className="object-cover"
            sizes={`${PHOTO_SIZE}px`}
          />
        </button>
      ))}

      {/* Lightbox */}
      <AnimatePresence>
        {openPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPhoto(null)}
          >
            {/* Photo */}
            <motion.div
              className="relative w-[85vw] h-[85vw] max-w-md max-h-md rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PHOTO_FILES[openPhoto]}
                alt={`Foto ${openPhoto + 1}`}
                fill
                className="object-cover"
                sizes="85vw"
                priority
              />
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex gap-3 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="px-5 h-11 rounded-full bg-white text-cookie-dark font-medium text-sm shadow-lg active:bg-gray-100"
                onClick={() => handleDownload(openPhoto)}
              >
                📥 Guardar foto
              </button>
              <button
                className="px-5 h-11 rounded-full bg-white/20 text-white font-medium text-sm shadow-lg active:bg-white/30 backdrop-blur-sm"
                onClick={() => setOpenPhoto(null)}
              >
                ✕ Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay button */}
      <motion.button
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 h-11 rounded-full bg-cookie-brown/90 text-white text-sm font-medium shadow-lg active:bg-cookie-dark backdrop-blur-sm"
        onClick={reset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        whileTap={{ scale: 0.95 }}
      >
        🕯️ Soplar de nuevo
      </motion.button>
    </div>
  );
}
