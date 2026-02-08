"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import HeartExplosion from "@/components/ui/HeartExplosion";

interface CongratsScreenProps {
  onContinue: () => void;
}

export default function CongratsScreen({ onContinue }: CongratsScreenProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4 relative z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <HeartExplosion />

      <motion.h1
        className="font-heading text-5xl sm:text-7xl font-bold text-rose-dark text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
      >
        You said Yes!
      </motion.h1>

      <motion.p
        className="text-2xl text-rose-dark/70 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        I&apos;m the happiest person in the world! 🥰
      </motion.p>

      {showButton && (
        <motion.button
          onClick={onContinue}
          className="mt-6 rounded-full bg-rose px-8 py-3 text-lg font-semibold text-white shadow-lg cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tell me more about you 💌
        </motion.button>
      )}
    </motion.div>
  );
}
