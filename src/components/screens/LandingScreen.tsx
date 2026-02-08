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
    <div className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-rose-50 via-white to-rose-100 opacity-60 pointer-events-none" />
      
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative">
          {profileAvatar ? (
            <motion.div
              className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-rose-400 to-pink-600 shadow-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={profileAvatar}
                  alt={profileName || ""}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {/* Floating Heart Badge */}
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md border border-rose-100"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="text-2xl">💝</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="text-8xl mb-4 drop-shadow-lg filter"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              💝
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600 drop-shadow-sm leading-tight pb-2">
            Will you be <br/>
            <span className="text-rose-800">
              {profileName ? `${profileName}'s` : "my"}
            </span>
            <br />
            Valentine?
          </h1>

          <p className="text-rose-800/70 text-lg sm:text-xl font-medium max-w-xs sm:max-w-md mx-auto">
            {profileName
              ? `${profileName} has a very important question for you...`
              : "I have a very important question for you..."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center mt-6 w-full justify-center">
          <motion.button
            onClick={onYes}
            className="relative overflow-hidden group rounded-full bg-rose-600 px-12 py-4 text-2xl font-bold text-white shadow-xl hover:shadow-2xl hover:bg-rose-500 transition-all cursor-pointer min-w-[200px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Yes! 
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
              >
                💕
              </motion.span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DodgeButton />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
