"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  type: "gold" | "pink" | "white";
}

export function Sparkles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const types: Particle["type"][] = ["gold", "pink", "white"];
    const generated: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 7 + Math.random() * 8,
      size: 2 + Math.random() * 4,
      type: types[i % 3],
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className={`sparkle-particle sparkle-${p.type}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            "--dur": `${p.duration}s`,
            width: p.size,
            height: p.size,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
