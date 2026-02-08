"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FloatingHearts from "@/components/ui/FloatingHearts";
import { signOut, reactToValentine, updateAvatar, updateUsername, checkUsernameAvailability, uploadFile } from "@/lib/actions";
import type { Profile, DashboardValentine } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  profile: Profile;
  valentines: DashboardValentine[];
}

const REACTION_EMOJIS = ["\u2764\ufe0f", "\ud83d\ude0d", "\ud83e\udd7a", "\ud83d\udc8b", "\ud83d\udd25"];

function DashboardValentineCard({ valentine, index }: { valentine: DashboardValentine; index: number }) {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [localReaction, setLocalReaction] = useState<string | null>(valentine.reaction);

  const handleReaction = async (emoji: string) => {
    setReacting(true);
    const prevReaction = localReaction;
    const newReaction = emoji === localReaction ? null : emoji;
    setLocalReaction(newReaction);
    setShowPicker(false);
    const result = await reactToValentine(valentine.id, newReaction);
    if (result.error) {
      // Revert on failure
      setLocalReaction(prevReaction);
      console.error("Reaction failed:", result.error);
    }
    setReacting(false);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="break-inside-avoid mb-6 relative group"
    >
      <div className={cn(
        "relative overflow-hidden rounded-3xl p-6 transition-all duration-300",
        "bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1",
        valentine.date === new Date().toISOString().split('T')[0] && "ring-2 ring-rose-400 ring-offset-2"
      )}>
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex gap-2">
          {valentine.show_on_wall ? (
            <span className="bg-green-100/80 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200 backdrop-blur-sm">
              PUBLIC
            </span>
          ) : (
            <span className="bg-rose-100/80 text-rose-700 text-xs font-bold px-2 py-1 rounded-full border border-rose-200 backdrop-blur-sm">
              PRIVATE
            </span>
          )}
        </div>

        {/* Sender Info */}
        <div className="flex items-center gap-4 mb-4 pr-16">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            {valentine.photo_url ? (
              <Image
                src={valentine.photo_url}
                alt={valentine.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-lg">
                💝
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-rose-900 truncate">
              {valentine.name}
            </h3>
            {valentine.instagram && (
              <p className="text-xs text-rose-700/60 truncate">
                @{valentine.instagram.replace(/^@/, "")}
              </p>
            )}
          </div>
        </div>

        {valentine.location && (
          <p className="text-xs text-rose-600/70 mb-3 flex items-center gap-1">
            <span>📍</span> {valentine.location}
          </p>
        )}

        {/* Message Content */}
        <div className="space-y-3">
          {valentine.photo_url && (
             <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/50 shadow-inner">
               <Image
                 src={valentine.photo_url}
                 alt="Valentine attachment"
                 fill
                 className="object-cover"
               />
             </div>
          )}

          {valentine.message && (
            <div className="relative bg-white/40 rounded-xl p-4 border border-rose-100/50">
              <span className="absolute -top-2 -left-1 text-3xl text-rose-300/40 font-serif leading-none">&ldquo;</span>
              <p className="text-rose-900/90 italic relative z-10 text-sm leading-relaxed">
                {valentine.message}
              </p>
              <span className="absolute -bottom-4 right-2 text-3xl text-rose-300/40 font-serif leading-none">&rdquo;</span>
            </div>
          )}

          {valentine.reason && (
            <div className="text-sm">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                Reason
              </span>
              <p className="text-rose-800/80">
                {valentine.reason}
              </p>
            </div>
          )}

          {valentine.song && (
            <div className="text-sm">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                🎵 Dedicated Song
              </span>
              <p className="text-rose-800/80">
                {valentine.song}
              </p>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-4 border-t border-rose-100/50 flex flex-wrap gap-y-2 justify-between items-center text-xs text-rose-400/80">
          <span>📅 {new Date(valentine.date).toLocaleDateString()}</span>
          {valentine.show_on_wall && (
            <span className="flex items-center gap-1">
              👁️ {valentine.wall_display_name}
            </span>
          )}
        </div>

        {/* Reaction Picker */}
        <div className="mt-3 relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            disabled={reacting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium transition-colors border border-rose-100 cursor-pointer"
          >
            {localReaction ? (
              <span className="text-base">{localReaction}</span>
            ) : (
              <>React 💭</>
            )}
          </button>

          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white rounded-full shadow-xl border border-rose-100 px-2 py-1.5 z-20"
              >
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className={cn(
                      "text-xl hover:scale-125 transition-transform p-1 rounded-full cursor-pointer",
                      localReaction === emoji && "bg-rose-100"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-rose-400 hover:text-rose-600 p-1 ml-1 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardView({
  profile,
  valentines,
}: DashboardViewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState(profile.avatar_url);

  // Username editing
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean;
    error: string | null;
    checking: boolean;
  }>({ available: false, error: null, checking: false });
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);

  const usernameChangesLeft = 3 - (profile.username_changes ?? 0);

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    setAvatarUploading(true);
    setLocalAvatarUrl(URL.createObjectURL(file));

    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadResult = await uploadFile(fd, "profile-avatars");
      if (uploadResult.error) throw new Error(uploadResult.error);

      await updateAvatar(uploadResult.url!);
      router.refresh();
    } catch {
      setLocalAvatarUrl(profile.avatar_url);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Debounced username availability check
  const checkUsername = useCallback(async (value: string) => {
    if (value === profile.username) {
      setUsernameStatus({ available: false, error: null, checking: false });
      return;
    }
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
  }, [profile.username]);

  useEffect(() => {
    if (!editingUsername || !newUsername) return;
    const timer = setTimeout(() => checkUsername(newUsername), 400);
    return () => clearTimeout(timer);
  }, [newUsername, editingUsername, checkUsername]);

  const handleUsernameSave = async () => {
    if (!usernameStatus.available) return;
    setUsernameSaving(true);
    setUsernameMessage(null);
    const result = await updateUsername(newUsername);
    setUsernameSaving(false);
    if (result.error) {
      setUsernameMessage(result.error);
    } else {
      setUsernameMessage("Username updated!");
      setEditingUsername(false);
      router.refresh();
    }
  };

  return (
    <main className="relative min-h-dvh bg-[#fff0f3]">
      <FloatingHearts />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
             <span className="text-3xl">💝</span>
             <span className="font-heading text-xl font-bold text-rose-900 hidden sm:inline">Valentine&apos;s Day</span>
          </div>
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white text-rose-700 text-sm font-medium transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <span>Sign out</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Clickable Avatar */}
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <div className={cn(
                  "relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl transition-opacity",
                  avatarUploading && "opacity-60"
                )}>
                  {localAvatarUrl ? (
                    <Image
                      src={localAvatarUrl}
                      alt={profile.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-4xl">
                      💝
                    </div>
                  )}
                </div>
                {avatarUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg text-rose-600 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex-1 space-y-2 pt-2">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold">
                  Hello, {profile.display_name}!
                </h1>
                <p className="text-pink-100 text-lg">
                  Ready to feel the love?
                </p>
                <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                  <a
                    href={`/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-rose-600 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
                  >
                    <span>View Public Page</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <a
                    href={`/${profile.username}/wall`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-950 text-white font-bold border-2 border-white/20 hover:bg-rose-900 hover:scale-105 shadow-lg transition-all text-sm sm:text-base"
                  >
                    View Public Wall
                  </a>
                </div>
              </div>
            </div>

            {/* Username Edit — inside hero with frosted glass inner box */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/20">
              <div className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-4">
                {!editingUsername ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-pink-200 text-[11px] font-semibold uppercase tracking-widest mb-1">Your Link</p>
                      <p className="text-white font-mono text-lg font-bold truncate drop-shadow-sm">/{profile.username}</p>
                    </div>
                    {usernameChangesLeft > 0 ? (
                      <button
                        onClick={() => {
                          setEditingUsername(true);
                          setNewUsername(profile.username);
                          setUsernameMessage(null);
                        }}
                        className="shrink-0 px-4 py-2 rounded-full bg-white/25 hover:bg-white/35 text-white text-xs font-bold transition-colors border border-white/30 cursor-pointer"
                      >
                        Change ({usernameChangesLeft} left)
                      </button>
                    ) : (
                      <span className="shrink-0 text-pink-200/60 text-xs font-medium">No changes left</span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-pink-200 text-[11px] font-semibold uppercase tracking-widest">Change Username</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-mono text-sm">/</span>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) =>
                            setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                          }
                          className="w-full pl-7 pr-10 py-2.5 rounded-xl bg-white/90 border border-white/50 text-rose-900 font-mono text-sm placeholder:text-rose-300 focus:bg-white focus:border-white outline-none transition-all shadow-sm"
                          placeholder="new-username"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameStatus.checking ? (
                            <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                          ) : newUsername && newUsername !== profile.username && (
                            <span className={cn(
                              "text-base font-bold",
                              usernameStatus.available ? "text-green-500" : "text-red-500"
                            )}>
                              {usernameStatus.available ? "✓" : "×"}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleUsernameSave}
                        disabled={usernameSaving || !usernameStatus.available}
                        className="px-5 py-2.5 rounded-xl bg-white text-rose-600 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-colors shadow-sm cursor-pointer"
                      >
                        {usernameSaving ? "..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingUsername(false);
                          setNewUsername(profile.username);
                          setUsernameMessage(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/15 text-white text-xs font-bold hover:bg-white/25 transition-colors border border-white/20 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    {usernameStatus.error && newUsername !== profile.username && (
                      <p className="text-red-200 text-xs font-medium">{usernameStatus.error}</p>
                    )}
                    {usernameMessage && (
                      <p className={cn(
                        "text-xs font-medium",
                        usernameMessage.includes("updated") ? "text-green-200" : "text-red-200"
                      )}>{usernameMessage}</p>
                    )}
                    <p className="text-pink-200/50 text-xs">{usernameChangesLeft} change{usernameChangesLeft !== 1 ? "s" : ""} remaining</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Share Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/60 p-8 shadow-xl flex flex-col justify-center"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-rose-900">Share Your Link</h3>
                <p className="text-sm text-rose-700/70">Send this to your friends to get valentines!</p>
              </div>

              <div className="bg-white/80 rounded-2xl p-2 pl-4 border border-rose-100 flex items-center justify-between gap-2 shadow-inner group transition-colors hover:border-rose-300">
                <code className="text-xs sm:text-sm text-rose-600 truncate font-mono">
                  {shareUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 sm:px-4 sm:py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs sm:text-sm transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`https://wa.me/?text=Send me a valentine! 💝 ${shareUrl}`, '_blank')}
                  className="flex-1 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Send me a valentine! 💝 ${shareUrl}`);
                    window.open('https://www.instagram.com/', '_blank');
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-400/20 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Instagram
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Valentines Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold text-rose-900">
              Your Valentines
              <span className="ml-3 text-lg bg-white/50 text-rose-500 px-3 py-1 rounded-full">{valentines.length}</span>
            </h2>
          </div>

          {valentines.length === 0 ? (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/50 border-dashed"
             >
               <div className="text-6xl mb-6 animate-bounce">💌</div>
               <h3 className="text-2xl font-bold text-rose-900 mb-2">No valentines yet</h3>
               <p className="text-rose-700/60 max-w-md mx-auto">
                 Don&apos;t worry! Share your link with friends and the love will start pouring in soon.
               </p>
             </motion.div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
              {valentines.map((v, i) => (
                <DashboardValentineCard key={v.id} valentine={v} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
