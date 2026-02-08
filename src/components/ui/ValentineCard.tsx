"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { WallValentine } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ValentineCardProps {
  valentine: WallValentine;
  index: number;
}

export default function ValentineCard({ valentine, index }: ValentineCardProps) {
  // Generate a random rotation between -2 and 2 degrees for a playful look
  // We use the index to make it deterministic (or could use id hash)
  const rotation = (index % 5) - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02, rotate: 0, zIndex: 10 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      className={cn(
        "relative mb-6 break-inside-avoid rounded-2xl p-4 sm:p-6",
        "bg-white/40 backdrop-blur-md shadow-lg border border-white/50",
        "hover:bg-white/60 hover:shadow-xl hover:border-white/80 transition-colors",
      )}
      style={{ rotate: `${rotation}deg` }}
    >
      <div className="flex items-start gap-3 mb-4">
        {valentine.photo_url ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <Image
              src={valentine.photo_url}
              alt={valentine.wall_display_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center text-xl shadow-sm border-2 border-white flex-shrink-0">
            💝
          </div>
        )}
        <div>
          <h3 className="font-bold text-rose-900 text-lg leading-tight">
            {valentine.wall_display_name}
          </h3>
          <p className="text-xs text-rose-700/60 font-medium">
            {new Date(valentine.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {valentine.message && (
        <div className="relative mb-4">
          <span className="absolute -top-2 -left-1 text-4xl text-rose-300/40 font-serif leading-none">
            &ldquo;
          </span>
          <p className="text-rose-900/90 leading-relaxed font-medium relative z-10 px-2 italic">
            {valentine.message}
          </p>
          <span className="absolute -bottom-4 right-0 text-4xl text-rose-300/40 font-serif leading-none">
            &rdquo;
          </span>
        </div>
      )}

      {valentine.reason && (
        <div className="bg-white/30 rounded-lg p-3 text-sm text-rose-800/80 border border-white/20">
          <span className="font-bold text-rose-800/60 text-xs uppercase tracking-wider block mb-1">
            Why you?
          </span>
          {valentine.reason}
        </div>
      )}
      
      <div className="absolute top-2 right-2 text-rose-300 opacity-20 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
    </motion.div>
  );
}
