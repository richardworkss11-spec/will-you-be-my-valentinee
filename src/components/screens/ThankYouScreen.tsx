"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface ThankYouScreenProps {
  profileName?: string;
  username?: string;
}

export default function ThankYouScreen({ profileName, username }: ThankYouScreenProps) {
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
        {profileName
          ? `Your valentine has been sent to ${profileName}!`
          : "Your valentine has been sent!"}
        <br />
        {profileName
          ? `${profileName} is going to love it 💌`
          : "I promise it'll be worth it 💌"}
      </motion.p>

      {username && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link
            href={`/${username}/wall`}
            className="inline-block rounded-full border-2 border-rose-light px-6 py-3 text-rose-dark font-semibold hover:bg-rose-light/20 transition-colors"
          >
            View {profileName}&apos;s Wall of Love
          </Link>
        </motion.div>
      )}

      <motion.div
        className="mt-4 text-rose-dark/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Spread the love this Valentine&apos;s Day!
      </motion.div>
    </motion.div>
  );
}
