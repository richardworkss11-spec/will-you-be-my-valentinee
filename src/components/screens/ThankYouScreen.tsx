"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import html2canvas from "html2canvas-pro";

interface ThankYouScreenProps {
  profileName?: string;
  username?: string;
  senderName?: string;
}

export default function ThankYouScreen({ profileName, username, senderName }: ThankYouScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 3,
    });
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 3,
    });
    const link = document.createElement("a");
    link.download = "valentine-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShareNative = async (platform: "whatsapp" | "instagram") => {
    setSharing(true);
    try {
      const blob = await generateCardImage();
      if (!blob) return;

      const file = new File([blob], "valentine-card.png", { type: "image/png" });

      // Try native share with file (works great on mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Valentine Card 💝",
          text: `I just sent a valentine to @${username || "someone special"}! 💝`,
        });
      } else {
        // Fallback: download the image + open the app
        handleDownload();

        if (platform === "whatsapp") {
          const shareText = `I just sent a valentine to @${username || "someone special"}! 💝`;
          const shareUrl = `${window.location.origin}/${username}`;
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
            "_blank"
          );
        }
        // For Instagram, just downloading is the best fallback — user adds to story manually
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8 px-4 relative z-10 overflow-hidden">
      {/* Background Decor */}
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

        {/* Shareable Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 space-y-5"
        >
          <h3 className="text-lg font-bold text-rose-700">Share the Love</h3>

          {/* The card that gets captured as an image */}
          <div
            ref={cardRef}
            className="mx-auto max-w-sm rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500 p-8 text-white shadow-2xl"
          >
            <div className="text-5xl mb-4">💌</div>
            <p className="text-lg font-medium opacity-90">I sent a valentine to</p>
            <p className="font-heading text-3xl font-bold mt-1">
              @{username || "someone"}
            </p>
            {senderName && (
              <p className="mt-4 text-sm opacity-80">
                From: {senderName}
              </p>
            )}
            <div className="mt-4 text-xs opacity-60">
              valentines.love 💝
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {/* Primary: Download for Stories */}
            <button
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-600 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm border border-rose-100"
            >
              📥 Save Card Image
            </button>

            <div className="flex gap-3">
              {/* WhatsApp: shares image directly on mobile */}
              <button
                onClick={() => handleShareNative("whatsapp")}
                disabled={sharing}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20bd5a] transition-colors disabled:opacity-60"
              >
                {sharing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>WhatsApp</>
                )}
              </button>

              {/* Instagram: shares image for story on mobile */}
              <button
                onClick={() => handleShareNative("instagram")}
                disabled={sharing}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {sharing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Instagram</>
                )}
              </button>
            </div>

            <p className="text-xs text-rose-400/70 text-center">
              On mobile, the card image will be shared directly. On desktop, save and share manually.
            </p>
          </div>
        </motion.div>

        {username && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-10"
          >
            <Link
              href={`/${username}/wall`}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-rose-600 shadow-xl transition-all hover:scale-105 hover:bg-rose-50 hover:shadow-2xl border-2 border-rose-100"
            >
              <span>View Wall of Love</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
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
