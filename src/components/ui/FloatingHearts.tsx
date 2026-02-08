"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const count = window.innerWidth < 640 ? 8 : 15;
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 16 + Math.random() * 20,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.4,
      }))
    );
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-up"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            "--duration": `${h.duration}s`,
            "--delay": `${h.delay}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          } as React.CSSProperties}
        >
          {["❤️", "💖", "💕", "💗"][h.id % 4]}
        </span>
      ))}
    </div>
  );
}
