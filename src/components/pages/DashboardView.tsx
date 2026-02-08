"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FloatingHearts from "@/components/ui/FloatingHearts";
import { signOut } from "@/lib/actions";
import type { Profile, DashboardValentine } from "@/lib/types";

interface DashboardViewProps {
  profile: Profile;
  valentines: DashboardValentine[];
}

export default function DashboardView({
  profile,
  valentines,
}: DashboardViewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `/${profile.username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-light">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-rose-light/30 flex items-center justify-center text-lg">
                  💝
                </div>
              )}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-rose-dark">
                {profile.display_name}
              </h1>
              <p className="text-sm text-rose-dark/50">/{profile.username}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-sm text-rose-dark/50 hover:text-rose-dark transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </motion.div>

        {/* Share Link */}
        <motion.div
          className="rounded-xl border-2 border-rose-light bg-white/80 p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-semibold text-rose-dark mb-2">
            Share your valentine page
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-rose-light bg-blush px-3 py-2 text-sm text-rose-dark select-all"
            />
            <motion.button
              onClick={handleCopy}
              className="rounded-lg bg-rose px-4 py-2 text-sm font-semibold text-white cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </div>
          <a
            href={`/${profile.username}/wall`}
            className="inline-block mt-2 text-xs text-rose/80 hover:text-rose transition-colors"
          >
            View your public wall →
          </a>
        </motion.div>

        {/* Valentines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading text-3xl font-bold text-rose-dark mb-4">
            Your Valentines ({valentines.length})
          </h2>

          {valentines.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💌</div>
              <p className="text-rose-dark/60">
                No valentines yet. Share your link to start collecting!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {valentines.map((v, i) => (
                <motion.div
                  key={v.id}
                  className="rounded-xl border-2 border-rose-light bg-white/80 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {v.photo_url ? (
                        <Image
                          src={v.photo_url}
                          alt=""
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-rose-light/30 flex items-center justify-center text-sm">
                          💕
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-rose-dark">
                          {v.name}
                        </p>
                        <p className="text-xs text-rose-dark/40">{v.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {v.show_on_wall ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Public
                        </span>
                      ) : (
                        <span className="text-xs bg-rose-light/30 text-rose-dark/60 px-2 py-0.5 rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                  </div>

                  {v.reason && (
                    <p className="text-sm text-rose-dark/70 mb-1">
                      <span className="font-medium">Why: </span>
                      {v.reason}
                    </p>
                  )}

                  {v.message && (
                    <p className="text-sm text-rose-dark/70 italic">
                      &ldquo;{v.message}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-xs text-rose-dark/40">
                    {v.date && <span>Date: {v.date}</span>}
                    {v.show_on_wall && (
                      <span>
                        Wall name: {v.wall_display_name}
                        {v.photo_public ? " (photo shown)" : " (photo hidden)"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
