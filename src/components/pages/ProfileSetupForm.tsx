"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProfile, checkUsernameAvailability, uploadFile } from "@/lib/actions";
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
        const fd = new FormData();
        fd.append("file", avatarFile);
        const uploadResult = await uploadFile(fd, "profile-avatars");
        if (uploadResult.error) throw new Error(uploadResult.error);
        finalAvatarUrl = uploadResult.url;
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
    <main className="relative min-h-dvh overflow-hidden flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-rose-100/50 to-transparent pointer-events-none" />
      <FloatingHearts />

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-5xl mb-4 block filter drop-shadow-md">✨</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600 drop-shadow-sm pb-2">
            Set Up Your Profile
          </h1>
          <p className="text-xl text-rose-800/70 font-medium">
            Let&apos;s make it perfect.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-rose-100 transition-all group-hover:ring-rose-200 group-hover:scale-105">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center text-4xl">
                      💝
                    </div>
                  )}
                </div>
                
                {/* Floating Edit Badge */}
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow-lg border border-rose-100 text-rose-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                
                {/* Click Overlay */}
                <label className="absolute inset-0 z-10 cursor-pointer" onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  input.click();
                }}/>
              </div>
              <p className="text-sm font-medium text-rose-500 uppercase tracking-wider text-xs">Tap to upload photo</p>
            </motion.div>

            <div className="space-y-6">
              {/* Display Name */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Cupid"
                  className="w-full rounded-2xl border border-rose-200 bg-white/50 px-5 py-4 text-xl text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none shadow-sm"
                />
              </motion.div>

              {/* Username */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-bold text-rose-900/80 mb-2 uppercase tracking-wide">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-rose-400 font-medium">/</span>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                    }
                    placeholder="your-name"
                    className="w-full rounded-2xl border border-rose-200 bg-white/50 pl-8 pr-5 py-4 text-xl text-rose-950 placeholder:text-rose-900/20 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none shadow-sm"
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {usernameStatus.checking ? (
                      <div className="w-5 h-5 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                    ) : username && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-xl ${usernameStatus.available ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameStatus.available ? "✓" : "×"}
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <AnimatePresence>
                  {username && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p
                        className={`text-sm mt-2 font-medium px-1 ${
                          usernameStatus.available
                            ? "text-green-600"
                            : usernameStatus.error ? "text-red-500" : "text-rose-400"
                        }`}
                      >
                        {usernameStatus.checking
                          ? "Checking availability..."
                          : usernameStatus.available
                          ? `Your page: ${window.location.host}/${username}`
                          : usernameStatus.error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting || (username.length > 0 && !usernameStatus.available)}
              className="w-full relative overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-pink-600 py-4 text-xl font-bold text-white shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed group transition-all transform hover:-translate-y-1"
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Page 🚀
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
