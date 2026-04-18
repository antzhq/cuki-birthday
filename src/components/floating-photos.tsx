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
  phase: "exploding" | "floating" | "dragging";
}

const PHOTO_SIZE = 100;
const FLOAT_SPEED = 1.5;
const EXPLODE_SPEED = 12;

export function FloatingPhotos() {
  const reset = useBirthdayStore((s) => s.reset);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [openPhoto, setOpenPhoto] = useState<number | null>(null);
  const photosRef = useRef<PhotoState[]>([]);
  const animRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const pausedRef = useRef(false);

  // Drag tracking
  const dragRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    prevX: number;
    prevY: number;
  } | null>(null);

  useEffect(() => {
    pausedRef.current = openPhoto !== null;
  }, [openPhoto]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    dimsRef.current = { w, h };

    // WHY: All photos start at the center of the screen (where the cake was)
    // and explode outward in random directions
    const centerX = w / 2 - PHOTO_SIZE / 2;
    const centerY = h / 2 - PHOTO_SIZE / 2;

    const initial: PhotoState[] = PHOTO_FILES.map((_, i) => {
      // Distribute angles evenly with some randomness
      const angle = (i / PHOTO_FILES.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = EXPLODE_SPEED * (0.7 + Math.random() * 0.6);

      return {
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: (Math.random() - 0.5) * 30,
        phase: "exploding" as const,
      };
    });

    photosRef.current = initial;
    setPhotos(initial);

    const tick = () => {
      if (!pausedRef.current) {
        const { w, h } = dimsRef.current;

        photosRef.current = photosRef.current.map((p) => {
          // Skip physics for dragged photo
          if (p.phase === "dragging") return p;

          let { x, y, vx, vy, rotation, phase } = p;

          if (phase === "exploding") {
            // Fly outward, decelerate
            x += vx;
            y += vy;
            vx *= 0.96;
            vy *= 0.96;

            // Bounce off walls during explosion
            if (y + PHOTO_SIZE > h) { y = h - PHOTO_SIZE; vy = -Math.abs(vy); }
            if (y < 0) { y = 0; vy = Math.abs(vy); }
            if (x + PHOTO_SIZE > w) { x = w - PHOTO_SIZE; vx = -Math.abs(vx); }
            if (x < 0) { x = 0; vx = Math.abs(vx); }

            // Once slow enough, switch to steady floating
            const speed = Math.sqrt(vx * vx + vy * vy);
            if (speed < FLOAT_SPEED) {
              const floatAngle = Math.atan2(vy, vx);
              vx = Math.cos(floatAngle) * FLOAT_SPEED;
              vy = Math.sin(floatAngle) * FLOAT_SPEED;
              phase = "floating";
            }
          } else {
            x += vx;
            y += vy;

            // Elastic bounces — no dampening, full speed preserved
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

  // Drag handlers
  const handleDragStart = useCallback((id: number, clientX: number, clientY: number) => {
    const photo = photosRef.current.find((p) => p.id === id);
    if (!photo) return;

    dragRef.current = {
      id,
      startX: clientX - photo.x,
      startY: clientY - photo.y,
      lastX: clientX,
      lastY: clientY,
      prevX: clientX,
      prevY: clientY,
    };

    // Set to dragging + bring to front by moving to end of array
    photosRef.current = [
      ...photosRef.current.filter((p) => p.id !== id),
      { ...photo, phase: "dragging", vx: 0, vy: 0 },
    ];
  }, []);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag) return;

    const { w, h } = dimsRef.current;
    const newX = Math.max(0, Math.min(clientX - drag.startX, w - PHOTO_SIZE));
    const newY = Math.max(0, Math.min(clientY - drag.startY, h - PHOTO_SIZE));

    drag.prevX = drag.lastX;
    drag.prevY = drag.lastY;
    drag.lastX = clientX;
    drag.lastY = clientY;

    photosRef.current = photosRef.current.map((p) =>
      p.id === drag.id ? { ...p, x: newX, y: newY } : p
    );
    setPhotos([...photosRef.current]);
  }, []);

  const handleDragEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;

    // WHY: Velocity from last two pointer positions gives a natural "throw" feel
    const vx = (drag.lastX - drag.prevX) * 0.5;
    const vy = (drag.lastY - drag.prevY) * 0.5;

    photosRef.current = photosRef.current.map((p) =>
      p.id === drag.id
        ? { ...p, phase: "floating" as const, vx: vx || (Math.random() - 0.5) * 2, vy: vy || -1 }
        : p
    );

    dragRef.current = null;
  }, []);

  // Global move/end listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (dragRef.current) e.preventDefault();
      const t = e.touches[0];
      handleDragMove(t.clientX, t.clientY);
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  // Distinguish drag vs tap: only open lightbox if no drag happened
  const handlePointerDown = useCallback((id: number, clientX: number, clientY: number) => {
    handleDragStart(id, clientX, clientY);
  }, [handleDragStart]);

  const handleClick = useCallback((id: number, e: React.MouseEvent | React.TouchEvent) => {
    // If a drag happened (moved more than 5px), don't open lightbox
    const drag = dragRef.current;
    if (drag) return;
    e.stopPropagation();
    setOpenPhoto(id);
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
        <div
          key={photo.id}
          className="absolute rounded-2xl overflow-hidden shadow-xl border-3 border-white cursor-grab active:cursor-grabbing touch-none"
          style={{
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg)`,
            willChange: "transform",
            zIndex: photo.phase === "dragging" ? 40 : 25,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handlePointerDown(photo.id, e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            handlePointerDown(photo.id, t.clientX, t.clientY);
          }}
          onClick={(e) => handleClick(photo.id, e)}
        >
          <Image
            src={PHOTO_FILES[photo.id]}
            alt={`Foto ${photo.id + 1}`}
            fill
            className="object-cover pointer-events-none"
            sizes={`${PHOTO_SIZE}px`}
            draggable={false}
          />
        </div>
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
