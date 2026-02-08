"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import FloatingHearts from "@/components/ui/FloatingHearts";
import type { Profile, WallValentine } from "@/lib/types";

interface PublicWallProps {
  profile: Profile;
  valentines: WallValentine[];
}

export default function PublicWall({ profile, valentines }: PublicWallProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-rose-light shadow-lg">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-rose-light/30 flex items-center justify-center text-3xl">
                💝
              </div>
            )}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-rose-dark text-center">
            {profile.display_name}&apos;s Wall of Love
          </h1>
          <Link
            href={`/${profile.username}`}
            className="text-sm text-rose hover:text-rose-dark transition-colors"
          >
            Send {profile.display_name} a valentine →
          </Link>
        </motion.div>

        {/* Wall Grid */}
        {valentines.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">💌</div>
            <p className="text-rose-dark/60 text-lg">
              No public valentines yet. Be the first!
            </p>
            <Link
              href={`/${profile.username}`}
              className="inline-block mt-4 rounded-full bg-rose px-6 py-3 text-white font-semibold hover:bg-rose-dark transition-colors"
            >
              Send a Valentine
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {valentines.map((v, i) => (
              <motion.div
                key={v.id}
                className="rounded-xl border-2 border-rose-light bg-white/80 p-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {v.photo_url ? (
                    <Image
                      src={v.photo_url}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-light/30 flex items-center justify-center text-lg">
                      💕
                    </div>
                  )}
                  <p className="font-semibold text-rose-dark">
                    {v.wall_display_name}
                  </p>
                </div>

                {v.message && (
                  <p className="text-sm text-rose-dark/70 italic mb-2">
                    &ldquo;{v.message}&rdquo;
                  </p>
                )}

                {v.reason && (
                  <p className="text-xs text-rose-dark/50">
                    {v.reason}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
