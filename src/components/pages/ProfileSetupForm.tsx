"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProfile, checkUsernameAvailability } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import FloatingHearts from "@/components/ui/FloatingHearts";

interface ProfileSetupFormProps {
  initialName: string;
  initialAvatar: string | null;
}

export default function ProfileSetupForm({
  initialName,
  initialAvatar,
}: ProfileSetupFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean;
    error: string | null;
    checking: boolean;
  }>({ available: false, error: null, checking: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced username check
  const checkUsername = useCallback(async (value: string) => {
    if (value.length < 3) {
      setUsernameStatus({
        available: false,
        error: value.length > 0 ? "At least 3 characters" : null,
        checking: false,
      });
      return;
    }
    setUsernameStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkUsernameAvailability(value);
    setUsernameStatus({
      available: result.available,
      error: result.error,
      checking: false,
    });
  }, []);

  useEffect(() => {
    if (!username) return;
    const timer = setTimeout(() => checkUsername(username), 400);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter a display name");
      return;
    }

    if (!usernameStatus.available) {
      setError("Please choose an available username");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAvatarUrl = initialAvatar;

      if (avatarFile) {
        const supabase = createClient();
        const fileName = `${Date.now()}-${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-avatars")
          .upload(fileName, avatarFile);

        if (uploadError) throw new Error("Avatar upload failed");

        const { data: urlData } = supabase.storage
          .from("profile-avatars")
          .getPublicUrl(fileName);

        finalAvatarUrl = urlData.publicUrl;
      }

      const result = await createProfile({
        displayName: displayName.trim(),
        username: username.toLowerCase(),
        avatarUrl: finalAvatarUrl,
      });

      if (result.error) throw new Error(result.error);

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <FloatingHearts />

      <div className="flex flex-col items-center justify-center min-h-dvh py-12 px-4 relative z-10">
        <motion.h1
          className="font-heading text-4xl sm:text-5xl font-bold text-rose-dark text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Set Up Your Profile
        </motion.h1>

        <motion.p
          className="text-rose-dark/60 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          This is how your valentine page will look
        </motion.p>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* Avatar */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-light shadow-lg bg-white">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    💝
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-semibold">Change</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            <p className="text-xs text-rose-dark/40">Click to change avatar</p>
          </motion.div>

          {/* Display Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-rose-dark mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border-2 border-rose-light bg-white/80 px-4 py-3 text-foreground placeholder:text-rose-dark/30 focus:border-rose focus:outline-none"
            />
          </motion.div>

          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-rose-dark mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-dark/40">
                /
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                }
                placeholder="your-unique-link"
                className="w-full rounded-xl border-2 border-rose-light bg-white/80 pl-8 pr-4 py-3 text-foreground placeholder:text-rose-dark/30 focus:border-rose focus:outline-none"
              />
            </div>
            {username && (
              <p
                className={`text-xs mt-1 ${
                  usernameStatus.checking
                    ? "text-rose-dark/40"
                    : usernameStatus.available
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {usernameStatus.checking
                  ? "Checking..."
                  : usernameStatus.available
                  ? `${window.location.origin}/${username} is available!`
                  : usernameStatus.error}
              </p>
            )}
          </motion.div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting || !usernameStatus.available}
            className="w-full rounded-full bg-rose py-4 text-lg font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer"
            whileHover={{
              scale: isSubmitting || !usernameStatus.available ? 1 : 1.02,
            }}
            whileTap={{
              scale: isSubmitting || !usernameStatus.available ? 1 : 0.98,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isSubmitting ? "Creating..." : "Create My Valentine Page 💝"}
          </motion.button>
        </form>
      </div>
    </main>
  );
}
