"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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

const PHOTO_SIZE = 140;
const GRAVITY = 0.5;
const FLOAT_SPEED = 1.5;

export function FloatingPhotos() {
  const reset = useBirthdayStore((s) => s.reset);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const photosRef = useRef<PhotoState[]>([]);
  const animRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  // Init
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    dimsRef.current = { w, h };

    // WHY: Each photo starts above the screen at staggered heights
    // so they drop in one by one. Random horizontal velocity for spread.
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
      const { w, h } = dimsRef.current;

      photosRef.current = photosRef.current.map((p) => {
        let { x, y, vx, vy, rotation, phase } = p;

        if (phase === "dropping") {
          // Gravity drop
          vy += GRAVITY;
          y += vy;
          x += vx;

          // Hit the floor → bounce once then switch to floating
          if (y + PHOTO_SIZE >= h) {
            y = h - PHOTO_SIZE;
            // Assign a random floating velocity
            vx = (Math.random() - 0.5) * FLOAT_SPEED * 2;
            vy = -(Math.random() * FLOAT_SPEED + 0.5);
            phase = "floating";
          }
        } else {
          // Floating mode — constant velocity, bounce off all walls like a screensaver
          x += vx;
          y += vy;

          // Bounce off floor
          if (y + PHOTO_SIZE > h) {
            y = h - PHOTO_SIZE;
            vy = -Math.abs(vy);
          }
          // Bounce off ceiling
          if (y < 0) {
            y = 0;
            vy = Math.abs(vy);
          }
          // Bounce off right wall
          if (x + PHOTO_SIZE > w) {
            x = w - PHOTO_SIZE;
            vx = -Math.abs(vx);
          }
          // Bounce off left wall
          if (x < 0) {
            x = 0;
            vx = Math.abs(vx);
          }
        }

        // Gentle rotation from horizontal movement
        rotation += vx * 0.3;

        return { ...p, x, y, vx, vy, rotation, phase };
      });

      setPhotos([...photosRef.current]);
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

  return (
    <div className="fixed inset-0 z-20 overflow-hidden">
      {/* Title */}
      <motion.div
        className="absolute top-8 left-0 right-0 z-30 text-center"
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

      {/* Photos */}
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="absolute rounded-2xl overflow-hidden shadow-xl border-3 border-white"
          style={{
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg)`,
            willChange: "transform",
          }}
        >
          <Image
            src={PHOTO_FILES[photo.id]}
            alt={`Foto ${photo.id + 1}`}
            fill
            className="object-cover"
            sizes={`${PHOTO_SIZE}px`}
          />
        </div>
      ))}

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
