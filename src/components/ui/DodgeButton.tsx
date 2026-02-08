"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";

export default function DodgeButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dodge = useCallback(() => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 60;

    const offsetX = (Math.random() - 0.5) * 300;
    const offsetY = (Math.random() - 0.5) * 300;

    setPosition((prev) => ({
      x: Math.max(-maxX / 2, Math.min(maxX / 2, prev.x + offsetX)),
      y: Math.max(-maxY / 2, Math.min(maxY / 2, prev.y + offsetY)),
    }));

    setDodgeCount((c) => c + 1);
  }, []);

  const messages = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Please?",
    "Pretty please?",
    "Just say Yes!",
    "Don't be like that!",
    "I'll cry...",
    "You're breaking my heart!",
  ];

  return (
    <motion.button
      ref={buttonRef}
      tabIndex={-1}
      className="rounded-full bg-gray-300 px-8 py-3 text-lg font-semibold text-gray-700 shadow-md cursor-pointer select-none"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={dodge}
      onTouchStart={(e) => {
        e.preventDefault();
        dodge();
      }}
    >
      {messages[Math.min(dodgeCount, messages.length - 1)]}
    </motion.button>
  );
}
