"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  width: number;
  height: number;
  dropped: boolean;
}

const PHOTO_SIZE = 100;
const GRAVITY = 0.4;
const BOUNCE_DAMPING = 0.7;
const FRICTION = 0.995;

export function FloatingPhotos() {
  const reset = useBirthdayStore((s) => s.reset);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const animRef = useRef<number>(0);
  const photosRef = useRef<PhotoState[]>([]);

  // Initialize dimensions
  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drop photos one by one from top
  useEffect(() => {
    if (dimensions.w === 0) return;

    const newPhotos: PhotoState[] = PHOTO_FILES.map((_, i) => ({
      id: i,
      x: Math.random() * (dimensions.w - PHOTO_SIZE),
      y: -PHOTO_SIZE - Math.random() * 400 - i * 80,
      vx: (Math.random() - 0.5) * 3,
      vy: 0,
      rotation: (Math.random() - 0.5) * 30,
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
      dropped: false,
    }));

    setPhotos(newPhotos);
    photosRef.current = newPhotos;
  }, [dimensions.w]);

  // Physics loop
  const animate = useCallback(() => {
    const { w, h } = dimensions;
    if (w === 0) return;

    photosRef.current = photosRef.current.map((p) => {
      let { x, y, vx, vy, rotation } = p;

      // Gravity
      vy += GRAVITY;

      // Apply velocity
      x += vx;
      y += vy;

      // Floor bounce
      if (y + PHOTO_SIZE > h) {
        y = h - PHOTO_SIZE;
        vy = -vy * BOUNCE_DAMPING;
        vx *= 0.9;
        if (Math.abs(vy) < 1) vy = 0;
      }

      // Wall bounces
      if (x < 0) {
        x = 0;
        vx = -vx * BOUNCE_DAMPING;
      }
      if (x + PHOTO_SIZE > w) {
        x = w - PHOTO_SIZE;
        vx = -vx * BOUNCE_DAMPING;
      }

      // Friction
      vx *= FRICTION;

      // Rotation based on velocity
      rotation += vx * 0.5;

      return { ...p, x, y, vx, vy, rotation, dropped: y >= 0 };
    });

    setPhotos([...photosRef.current]);
    animRef.current = requestAnimationFrame(animate);
  }, [dimensions]);

  useEffect(() => {
    if (dimensions.w === 0) return;
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate, dimensions]);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden">
      {/* Title overlay */}
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

      {/* Floating photos */}
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="absolute rounded-xl overflow-hidden shadow-lg border-2 border-white"
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

      {/* Relight button */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-6 h-10 rounded-full bg-cookie-brown/80 text-white text-sm font-medium shadow-md active:bg-cookie-dark backdrop-blur-sm"
        onClick={reset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        🕯️ Soplar de nuevo
      </motion.button>
    </div>
  );
}
