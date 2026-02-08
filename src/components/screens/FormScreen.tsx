"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PhotoUpload from "@/components/ui/PhotoUpload";
import { supabase } from "@/lib/supabase";
import { submitValentine } from "@/lib/actions";
import type { FormData } from "@/lib/types";

interface FormScreenProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onSuccess: () => void;
}

const fields = [
  { key: "name" as const, label: "Your Name", type: "text", placeholder: "What should I call you?" },
  { key: "email" as const, label: "Your Email", type: "email", placeholder: "So I can write to you..." },
  { key: "date" as const, label: "Our Special Date", type: "date", placeholder: "" },
  { key: "reason" as const, label: "Why Me?", type: "textarea", placeholder: "What made you say yes?" },
];

export default function FormScreen({ formData, updateField, onSuccess }: FormScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.date) {
      setError("Please fill in your name, email, and date");
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;

      if (formData.photo) {
        const fileName = `${Date.now()}-${formData.photo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("valentine-photos")
          .upload(fileName, formData.photo);

        if (uploadError) throw new Error("Photo upload failed");

        const { data: urlData } = supabase.storage
          .from("valentine-photos")
          .getPublicUrl(fileName);

        photoUrl = urlData.publicUrl;
      }

      const result = await submitValentine({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        reason: formData.reason,
        photo_url: photoUrl,
        message: formData.message,
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
      className="flex flex-col items-center justify-center min-h-dvh py-12 px-4 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="font-heading text-4xl sm:text-5xl font-bold text-rose-dark text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Tell me about us 💕
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5"
      >
        {fields.map((field, i) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <label className="block text-sm font-semibold text-rose-dark mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={formData[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full rounded-xl border-2 border-rose-light bg-white/80 px-4 py-3 text-foreground placeholder:text-rose-dark/30 focus:border-rose focus:outline-none resize-none"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border-2 border-rose-light bg-white/80 px-4 py-3 text-foreground placeholder:text-rose-dark/30 focus:border-rose focus:outline-none"
              />
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-rose-dark mb-1">
            A Cute Photo of Us
          </label>
          <PhotoUpload onFileSelect={(file) => updateField("photo", file)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-semibold text-rose-dark mb-1">
            Love Note 💌
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Write me something sweet..."
            rows={3}
            className="w-full rounded-xl border-2 border-rose-light bg-white/80 px-4 py-3 text-foreground placeholder:text-rose-dark/30 focus:border-rose focus:outline-none resize-none"
          />
        </motion.div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-rose py-4 text-lg font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isSubmitting ? "Sending with love..." : "Send My Valentine 💝"}
        </motion.button>
      </form>
    </motion.div>
  );
}
