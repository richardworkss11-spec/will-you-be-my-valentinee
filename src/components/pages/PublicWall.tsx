"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import FloatingHearts from "@/components/ui/FloatingHearts";
import ValentineCard from "@/components/ui/ValentineCard";
import type { Profile, WallValentine } from "@/lib/types";

interface PublicWallProps {
  profile: Profile;
  valentines: WallValentine[];
}

export default function PublicWall({ profile, valentines }: PublicWallProps) {
  const [shared, setShared] = useState(false);
  const count = valentines.length;

  const wallUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${profile.username}/wall`
    : `/${profile.username}/wall`;

  const shareText = `Check out ${profile.display_name}'s Wall of Love! 💝 ${count} valentine${count !== 1 ? "s" : ""} and counting!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.display_name}'s Wall of Love`,
          text: shareText,
          url: wallUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall through to copy
      }
    }
    await navigator.clipboard.writeText(`${shareText} ${wallUrl}`);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <main className="relative min-h-dvh bg-gradient-to-b from-rose-50 to-rose-100 overflow-x-hidden">
      <FloatingHearts />

      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-12 px-4 text-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-rose-200 flex items-center justify-center text-5xl">
                  💝
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600 drop-shadow-sm">
              {profile.display_name}&apos;s Wall
            </h1>
            <p className="text-rose-800/70 text-lg font-medium flex items-center justify-center flex-wrap gap-2">
              <span>Collect all your valentine&apos;s love here! 💕</span>
              {count > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-base font-bold text-rose-700 shadow-sm border border-rose-100">
                    💌 {count} Received
                  </span>
                </>
              )}
            </p>
          </div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={`/${profile.username}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/80 hover:bg-white text-rose-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-rose-200 backdrop-blur-sm"
            >
              <span>💌</span>
              Send a Valentine
            </Link>

            <Link
              href={`/${profile.username}?msg=1`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/80 hover:bg-white text-rose-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-rose-200 backdrop-blur-sm"
            >
              <span>🤫</span>
              Private Message
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share Wall
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(wallUrl);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
              }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white text-rose-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-rose-200 backdrop-blur-sm group relative"
              title="Copy Link"
            >
              {shared ? (
                <span className="text-green-500 font-bold">✓</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Masonry Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {valentines.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center bg-white/30 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-8xl mb-6 animate-bounce">🥺</div>
            <h3 className="text-2xl font-bold text-rose-800 mb-2">No valentines yet!</h3>
            <p className="text-rose-600/80 text-lg mb-8 max-w-md">
              Be the first person to show some love to {profile.display_name}. It only takes a minute!
            </p>
            <Link
              href={`/${profile.username}`}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Send Love Now 💖
            </Link>
          </motion.div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {valentines.map((v, i) => (
              <ValentineCard key={v.id} valentine={v} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-rose-100 to-transparent pointer-events-none z-20" />
    </main>
  );
}
