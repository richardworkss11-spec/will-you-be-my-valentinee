"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface MessageSentScreenProps {
  profileName: string;
  username: string;
}

export default function MessageSentScreen({
  profileName,
  username,
}: MessageSentScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8 px-4 relative z-10 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-rose-50 to-white opacity-60 pointer-events-none" />

      <motion.div
        className="relative z-10 text-center w-full max-w-lg mx-auto"
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
          🤫
        </motion.div>

        <motion.h1
          className="font-heading text-6xl sm:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600 drop-shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Message Sent!
        </motion.h1>

        <motion.div
          className="text-xl sm:text-2xl text-rose-800/80 font-medium max-w-lg mx-auto space-y-2 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>
            Your private message has been delivered to {profileName}
          </p>
          <p className="font-heading text-3xl text-rose-600">
            It&apos;ll be their little secret
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10"
        >
          <Link
            href={`/${username}/wall`}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl">💝</span>
            <span>View Their Wall</span>
            <span className="group-hover:translate-x-1 transition-transform text-xl">&rarr;</span>
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 text-rose-400 font-medium tracking-wide text-sm opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          Spread the love this Valentine&apos;s Day!
        </motion.div>
      </motion.div>
    </div>
  );
}
