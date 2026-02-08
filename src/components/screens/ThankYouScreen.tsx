"use client";

import { motion } from "motion/react";

export default function ThankYouScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4 relative z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-7xl animate-pulse-heart">💖</div>

      <motion.h1
        className="font-heading text-4xl sm:text-6xl font-bold text-rose-dark text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Thank You!
      </motion.h1>

      <motion.p
        className="text-xl text-rose-dark/70 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Wait for my cute message!
        <br />
        I promise it&apos;ll be worth it 💌
      </motion.p>

      <motion.div
        className="mt-8 text-rose-dark/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Check your email soon...
      </motion.div>
    </motion.div>
  );
}
