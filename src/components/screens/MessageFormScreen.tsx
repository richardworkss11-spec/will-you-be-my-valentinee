"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PhotoUpload from "@/components/ui/PhotoUpload";
import { submitPrivateMessage, uploadFile } from "@/lib/actions";

interface MessageFormScreenProps {
  profileId: string;
  profileName: string;
  onSuccess: () => void;
}

export default function MessageFormScreen({
  profileId,
  profileName,
  onSuccess,
}: MessageFormScreenProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please write a message");
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;

      if (photo) {
        const fd = new FormData();
        fd.append("file", photo);
        const uploadResult = await uploadFile(fd, "valentine-photos");
        if (uploadResult.error) throw new Error(`Photo upload failed: ${uploadResult.error}`);
        photoUrl = uploadResult.url;
      }

      const result = await submitPrivateMessage({
        profileId,
        senderName: isAnonymous ? null : senderName || null,
        message,
        photoUrl,
      });

      if (result.error) throw new Error(result.error);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 scroll-smooth">
          <div className="w-full max-w-2xl mx-auto py-12 pb-32">
            <motion.div
              className="text-center mb-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <span className="text-4xl mb-2 block">🤫</span>
              <h2 className="font-heading text-5xl sm:text-6xl font-bold text-rose-dark">
                Private Message
              </h2>
              <p className="text-rose-800/60 mt-2">
                Only {profileName} will see this
              </p>
            </motion.div>

            <motion.div
              className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 sm:p-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-6">
                {/* Anonymous Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-rose-200 bg-white/50 hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{isAnonymous ? "🎭" : "😊"}</span>
                      <div className="text-left">
                        <p className="font-bold text-rose-900 text-sm">Send Anonymously</p>
                        <p className="text-rose-500/60 text-xs">
                          {isAnonymous ? "Your identity will be hidden" : "Your name will be shown"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        isAnonymous ? "bg-rose-500" : "bg-rose-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                          isAnonymous ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                </motion.div>

                {/* Name Field (hidden when anonymous) */}
                {!isAnonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="What should they call you?"
                      className="w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-lg text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                    />
                  </motion.div>
                )}

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something heartfelt..."
                    rows={5}
                    className="w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-lg text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none resize-none"
                  />
                </motion.div>

                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-rose-100"
                >
                  <label className="block text-sm font-bold text-rose-900/80 mb-3 uppercase tracking-wide">
                    Attach a Photo (optional)
                  </label>
                  <PhotoUpload onFileSelect={(file) => setPhoto(file)} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-none bg-white/90 backdrop-blur-xl border-t border-rose-100 p-4 pb-6 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-md mx-auto space-y-3">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 font-medium text-center text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-pink-600 py-4 text-xl font-bold text-white shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Private Message 🤫
                  </>
                )}
              </span>
              {!isSubmitting && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
