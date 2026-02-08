"use client";

import { motion } from "motion/react";

const hearts = Array.from({ length: 25 }, (_, i) => {
  const angle = (i / 25) * Math.PI * 2;
  const distance = 80 + Math.random() * 120;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    scale: 0.5 + Math.random() * 1,
    rotate: Math.random() * 360,
  };
});

export default function HeartExplosion() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-2xl"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: h.x,
            y: h.y,
            scale: h.scale,
            opacity: 0,
            rotate: h.rotate,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        >
          {["❤️", "💖", "💕", "💗", "💘"][h.id % 5]}
        </motion.span>
      ))}
    </div>
  );
}
