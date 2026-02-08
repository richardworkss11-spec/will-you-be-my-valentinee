"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
// import confetti from "canvas-confetti"; // If we had it, but we'll use our HeartExplosion for consistency if needed, or just CSS

interface ThankYouScreenProps {
  profileName?: string;
  username?: string;
}

export default function ThankYouScreen({ profileName, username }: ThankYouScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8 px-4 relative z-10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-rose-50 to-white opacity-60 pointer-events-none" />

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-8xl mb-6 inline-block filter drop-shadow-md"
          animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          💖
        </motion.div>

        <motion.h1
          className="font-heading text-6xl sm:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600 drop-shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Thank You!
        </motion.h1>

        <motion.div
          className="text-xl sm:text-2xl text-rose-800/80 font-medium max-w-lg mx-auto space-y-2 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>
            {profileName
              ? `Your valentine has been sent to ${profileName}!`
              : "Your valentine has been sent!"}
          </p>
          <p className="font-heading text-3xl text-rose-600">
            {profileName
              ? `${profileName} is going to love it`
              : "I promise it'll be worth it"}
          </p>
        </motion.div>

        {username && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-10"
          >
            <Link
              href={`/${username}/wall`}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-rose-600 shadow-xl transition-all hover:scale-105 hover:bg-rose-50 hover:shadow-2xl border-2 border-rose-100"
            >
              <span>View Wall of Love</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        )}

        <motion.div
          className="mt-12 text-rose-400 font-medium tracking-wide text-sm opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Spread the love this Valentine&apos;s Day! 💕
        </motion.div>
      </motion.div>
    </div>
  );
}
