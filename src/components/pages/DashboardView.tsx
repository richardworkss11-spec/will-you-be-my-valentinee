"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      setLocalReaction(prevReaction);
    }
    setReacting(false);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="break-inside-avoid mb-6"
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
        "bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5",
      )}>
        {/* Sender */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            {valentine.photo_url ? (
              <Image src={valentine.photo_url} alt={valentine.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-sm">
                💝
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-rose-900 text-sm truncate">{valentine.name}</h3>
            {valentine.instagram && (
              <p className="text-xs text-rose-500/60 truncate">@{valentine.instagram.replace(/^@/, "")}</p>
            )}
          </div>
        </div>

        {valentine.location && (
          <p className="text-xs text-rose-500/70 mb-3 flex items-center gap-1">
            <span>📍</span> {valentine.location}
          </p>
        )}

        <div className="space-y-3">
          {valentine.photo_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-rose-100">
              <Image src={valentine.photo_url} alt="Valentine attachment" fill className="object-cover" />
            </div>
          )}

          {valentine.message && (
            <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50">
              <p className="text-rose-900/80 italic text-sm leading-relaxed">&ldquo;{valentine.message}&rdquo;</p>
            </div>
          )}

          {valentine.reason && (
            <div className="text-sm">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Reason</span>
              <p className="text-rose-800/70 text-xs">{valentine.reason}</p>
            </div>
          )}

          {valentine.song && (
            <div className="text-sm">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">🎵 Song</span>
              <p className="text-rose-800/70 text-xs">{valentine.song}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-rose-100/50 flex items-center justify-between">
          <span className="text-[11px] text-rose-400/70">📅 {new Date(valentine.date).toLocaleDateString()}</span>

          {/* Reaction */}
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              disabled={reacting}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-medium transition-colors cursor-pointer"
            >
              {localReaction ? <span className="text-sm">{localReaction}</span> : <>React 💭</>}
            </button>

            <AnimatePresence>
              {showPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute bottom-full right-0 mb-2 flex items-center gap-1 bg-white rounded-full shadow-xl border border-rose-100 px-2 py-1.5 z-20"
                >
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={cn(
                        "text-lg hover:scale-125 transition-transform p-0.5 rounded-full cursor-pointer",
                        localReaction === emoji && "bg-rose-100"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                  <button onClick={() => setShowPicker(false)} className="text-rose-400 hover:text-rose-600 p-0.5 ml-1 text-xs cursor-pointer">
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DummyValentineCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="break-inside-avoid mb-6 relative"
    >
      <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-md">
        EXAMPLE
      </div>
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white/50 backdrop-blur-xl border-2 border-dashed border-rose-200 shadow-sm opacity-75">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-sm border-2 border-white shadow-sm">
            💝
          </div>
          <div>
            <h3 className="font-bold text-rose-900 text-sm">Secret Admirer</h3>
            <p className="text-xs text-rose-500/60">@someone_special</p>
          </div>
        </div>

        <p className="text-xs text-rose-500/70 mb-3 flex items-center gap-1">
          <span>📍</span> Somewhere close to your heart
        </p>

        <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50 mb-3">
          <p className="text-rose-900/80 italic text-sm leading-relaxed">&ldquo;You make my heart skip a beat every single day. Happy Valentine&apos;s Day!&rdquo;</p>
        </div>

        <div className="text-sm mb-2">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Reason</span>
          <p className="text-rose-800/70 text-xs">Because your smile lights up the room</p>
        </div>

        <div className="text-sm">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">🎵 Song</span>
          <p className="text-rose-800/70 text-xs">Perfect - Ed Sheeran</p>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-100/50 flex items-center justify-between">
          <span className="text-[11px] text-rose-400/70">📅 {new Date().toLocaleDateString()}</span>
          <span className="text-xs text-rose-400/50">💭</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardView({ profile, valentines }: DashboardViewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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

  const checkUsername = useCallback(async (value: string) => {
    if (value === profile.username) {
      setUsernameStatus({ available: false, error: null, checking: false });
      return;
    }
    if (value.length < 3) {
      setUsernameStatus({ available: false, error: value.length > 0 ? "At least 3 characters" : null, checking: false });
      return;
    }
    setUsernameStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkUsernameAvailability(value);
    setUsernameStatus({ available: result.available, error: result.error, checking: false });
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
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-12 sm:px-6">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <span className="font-heading text-lg font-bold text-rose-900 hidden sm:inline">Valentine&apos;s Day</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 hover:bg-white text-rose-700 text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-rose-200">
                {localAvatarUrl ? (
                  <Image src={localAvatarUrl} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-rose-100 flex items-center justify-center text-[10px]">💝</div>
                )}
              </div>
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-full bg-white/60 hover:bg-white text-rose-700 text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </nav>

        {/* Greeting + Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-rose-900 mb-2">
            Hello, {profile.display_name}!
          </h1>
          <p className="text-rose-600/60 text-base">
            Share your invite link and collect valentines
          </p>
        </motion.div>

        {/* Invite Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/80 backdrop-blur-xl border border-rose-100 p-5 shadow-sm mb-4"
        >
          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Your invite link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-rose-50/80 rounded-xl px-4 py-3 border border-rose-100">
              <code className="text-sm text-rose-700 font-mono break-all">{shareUrl}</code>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "shrink-0 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer",
                copied
                  ? "bg-green-500 text-white"
                  : "bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
              )}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => window.open(`https://wa.me/?text=Be my valentine! 💝 ${shareUrl}`, '_blank')}
              className="flex-1 py-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </button>
            <button
              onClick={async () => {
                const shareData = { title: 'Be my Valentine!', text: `Be my valentine! 💝`, url: shareUrl };
                if (navigator.share) {
                  try { await navigator.share(shareData); return; } catch {}
                }
                await navigator.clipboard.writeText(`Be my valentine! 💝 ${shareUrl}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
            <a
              href={`/${profile.username}/wall`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-bold text-sm transition-colors text-center flex items-center justify-center gap-1.5"
            >
              Public Wall
            </a>
          </div>
        </motion.div>

        {/* Valentines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6 mt-10">
            <h2 className="font-heading text-2xl font-bold text-rose-900">Your Valentines</h2>
            <span className="text-sm bg-rose-100 text-rose-500 px-2.5 py-0.5 rounded-full font-bold">{valentines.length}</span>
          </div>

          {valentines.length === 0 ? (
            <div>
              <p className="text-rose-500/60 text-sm mb-4 text-center">
                No valentines yet — share your link and this is what you&apos;ll get:
              </p>
              <div className="max-w-sm mx-auto">
                <DummyValentineCard />
              </div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 gap-6">
              {valentines.map((v, i) => (
                <DashboardValentineCard key={v.id} valentine={v} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => { setShowProfile(false); setEditingUsername(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50 bg-white rounded-3xl shadow-2xl border border-rose-100 p-6 overflow-y-auto max-h-[80vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-rose-900">Profile</h2>
                <button
                  onClick={() => { setShowProfile(false); setEditingUsername(false); }}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 text-sm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <div className={cn(
                    "relative w-24 h-24 rounded-full overflow-hidden border-4 border-rose-100 shadow-lg transition-opacity",
                    avatarUploading && "opacity-60"
                  )}>
                    {localAvatarUrl ? (
                      <Image src={localAvatarUrl} alt={profile.display_name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center text-3xl">💝</div>
                    )}
                  </div>
                  {avatarUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md text-rose-500 group-hover:scale-110 transition-transform border border-rose-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                  )}
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <p className="text-xs text-rose-400 mt-2">Tap to change photo</p>
              </div>

              {/* Username */}
              <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-4">
                {!editingUsername ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Username</p>
                      <p className="text-rose-900 font-mono font-bold truncate">/{profile.username}</p>
                    </div>
                    {usernameChangesLeft > 0 ? (
                      <button
                        onClick={() => { setEditingUsername(true); setNewUsername(profile.username); setUsernameMessage(null); }}
                        className="shrink-0 px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Change ({usernameChangesLeft} left)
                      </button>
                    ) : (
                      <span className="shrink-0 text-rose-400/60 text-xs">No changes left</span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Change Username</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400/50 font-mono text-sm">/</span>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        className="w-full pl-7 pr-10 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-900 font-mono text-sm placeholder:text-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                        placeholder="new-username"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus.checking ? (
                          <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                        ) : newUsername && newUsername !== profile.username && (
                          <span className={cn("text-sm font-bold", usernameStatus.available ? "text-green-500" : "text-red-500")}>
                            {usernameStatus.available ? "✓" : "×"}
                          </span>
                        )}
                      </div>
                    </div>
                    {usernameStatus.error && newUsername !== profile.username && (
                      <p className="text-red-500 text-xs">{usernameStatus.error}</p>
                    )}
                    {usernameMessage && (
                      <p className={cn("text-xs font-medium", usernameMessage.includes("updated") ? "text-green-600" : "text-red-500")}>
                        {usernameMessage}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleUsernameSave}
                        disabled={usernameSaving || !usernameStatus.available}
                        className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        {usernameSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => { setEditingUsername(false); setNewUsername(profile.username); setUsernameMessage(null); }}
                        className="flex-1 py-2 rounded-xl bg-white text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer border border-rose-100"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-rose-400/50 text-[11px]">{usernameChangesLeft} change{usernameChangesLeft !== 1 ? "s" : ""} remaining</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
