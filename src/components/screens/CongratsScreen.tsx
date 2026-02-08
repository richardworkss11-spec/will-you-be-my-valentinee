"use client";

import { motion } from "motion/react";
import HeartExplosion from "@/components/ui/HeartExplosion";

interface CongratsScreenProps {
  onContinue: () => void;
}

export default function CongratsScreen({ onContinue }: CongratsScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8 px-4 relative z-10 overflow-hidden">
      {/* Background Burst */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-rose-200/50 to-transparent opacity-0 pointer-events-none"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1 }}
      />

      <HeartExplosion />

      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="text-8xl mb-4"
        >
          🥳
        </motion.div>

        <motion.h1
          className="font-heading text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 drop-shadow-sm p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          You said Yes!
        </motion.h1>

        <motion.p
          className="text-2xl sm:text-3xl text-rose-800/80 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Now make it special — one last step! ✨
        </motion.p>
      </motion.div>

      <motion.button
        onClick={onContinue}
        className="mt-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-10 py-4 text-xl font-bold text-white shadow-xl cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          className="flex items-center gap-2"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Fill in your valentine 💌
        </motion.span>
      </motion.button>
    </div>
  );
}
