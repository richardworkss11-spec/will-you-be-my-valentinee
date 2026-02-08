"use client";

import { motion } from "motion/react";
import Image from "next/image";
import DodgeButton from "@/components/ui/DodgeButton";

interface LandingScreenProps {
  onYes: () => void;
  profileName?: string;
  profileAvatar?: string | null;
}

export default function LandingScreen({
  onYes,
  profileName,
  profileAvatar,
}: LandingScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh gap-8 px-4 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {profileAvatar ? (
        <motion.div
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-light shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Image
            src={profileAvatar}
            alt={profileName || ""}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ) : (
        <motion.div
          className="text-6xl mb-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💝
        </motion.div>
      )}

      <h1 className="font-heading text-4xl sm:text-6xl font-bold text-rose-dark text-center leading-tight">
        Will you be {profileName ? `${profileName}'s` : "my"}
        <br />
        Valentine?
      </h1>

      <p className="text-rose-dark/60 text-lg text-center max-w-md">
        {profileName
          ? `${profileName} has a very important question for you...`
          : "I have a very important question for you..."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
        <motion.button
          onClick={onYes}
          className="rounded-full bg-rose px-10 py-4 text-xl font-bold text-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes! 💕
        </motion.button>

        <DodgeButton />
      </div>
    </motion.div>
  );
}
