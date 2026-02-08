"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PhotoUpload from "@/components/ui/PhotoUpload";
import { submitValentine, uploadFile } from "@/lib/actions";
import type { FormData } from "@/lib/types";

interface FormScreenProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onSuccess: () => void;
  profileId: string;
  profileName: string;
}

const fields = [
  {
    key: "name" as const,
    label: "Your Name",
    type: "text",
    placeholder: "What should I call you?",
  },
  {
    key: "instagram" as const,
    label: "Your Instagram",
    type: "text",
    placeholder: "@yourhandle",
  },
  {
    key: "date" as const,
    label: "Our Special Date",
    type: "date",
    placeholder: "",
  },
  {
    key: "location" as const,
    label: "Where Are You From? \ud83d\udccd",
    type: "text",
    placeholder: "City, Country",
  },
  {
    key: "reason" as const,
    label: "Why Me?",
    type: "textarea",
    placeholder: "What made you say yes?",
  },
];

export default function FormScreen({
  formData,
  updateField,
  onSuccess,
  profileId,
  profileName,
}: FormScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.date) {
      setError("Please fill in your name and date");
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;

      if (formData.photo) {
        const fd = new FormData();
        fd.append("file", formData.photo);
        const uploadResult = await uploadFile(fd, "valentine-photos");
        if (uploadResult.error) throw new Error(uploadResult.error);
        photoUrl = uploadResult.url;
      }

      const result = await submitValentine({
        name: formData.name,
        instagram: formData.instagram,
        date: formData.date,
        reason: formData.reason,
        photo_url: photoUrl,
        message: formData.message,
        location: formData.location,
        song: formData.song,
        profile_id: profileId,
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
              <span className="text-4xl mb-2 block">💌</span>
              <h2 className="font-heading text-5xl sm:text-6xl font-bold text-rose-dark">
                Tell me about us
              </h2>
              <p className="text-rose-800/60 mt-2">
                I want to know everything...
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 sm:p-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field, i) => (
                    <motion.div
                      key={field.key}
                      className={field.type === "textarea" ? "md:col-span-2" : ""}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.key]}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-lg text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none resize-none"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.key]}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-lg text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4 border-t border-rose-100"
                >
                  <label className="block text-sm font-bold text-rose-900/80 mb-3 uppercase tracking-wide">
                    A Cute Photo of Us
                  </label>
                  <PhotoUpload onFileSelect={(file) => updateField("photo", file)} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                    A Song Dedicated to Me 🎵
                  </label>
                  <input
                    type="text"
                    value={formData.song}
                    onChange={(e) => updateField("song", e.target.value)}
                    placeholder="Song name + artist (e.g., Perfect by Ed Sheeran)"
                    className="w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-lg text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                    Love Note 💌
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Write me something sweet..."
                    rows={4}
                    className="w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-lg text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none resize-none"
                  />
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
                    Send My Valentine 💝
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
