"use client";

import { motion } from "motion/react";
import type { PrivateMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  message: PrivateMessage;
  index: number;
}

export default function MessageCard({ message, index }: MessageCardProps) {
  const isAnonymous = !message.sender_name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="break-inside-avoid mb-6"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
          "bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
        )}
      >
        {/* Unread dot */}
        {!message.is_read && (
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
        )}

        {/* Sender */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-sm">
              {isAnonymous ? "🎭" : "💌"}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-rose-900 text-sm truncate">
              {isAnonymous ? "Anonymous" : message.sender_name}
            </h3>
            <p className="text-xs text-rose-500/60">Private message</p>
          </div>
        </div>

        <div className="space-y-3">
          {message.photo_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-rose-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.photo_url}
                alt="Message attachment"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50">
            <p className="text-rose-900/80 italic text-sm leading-relaxed whitespace-pre-wrap">
              &ldquo;{message.message}&rdquo;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-rose-100/50 flex items-center justify-between">
          <span className="text-[11px] text-rose-400/70">
            {new Date(message.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <span className="text-xs text-rose-400/50">🤫</span>
        </div>
      </div>
    </motion.div>
  );
}
