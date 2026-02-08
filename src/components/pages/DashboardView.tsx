"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FloatingHearts from "@/components/ui/FloatingHearts";
import { signOut } from "@/lib/actions";
import type { Profile, DashboardValentine } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  profile: Profile;
  valentines: DashboardValentine[];
}

function DashboardValentineCard({ valentine, index }: { valentine: DashboardValentine; index: number }) {
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
            <p className="text-xs text-rose-700/60 truncate">
              {valentine.email}
            </p>
          </div>
        </div>

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
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-4 border-t border-rose-100/50 flex flex-wrap gap-y-2 justify-between text-xs text-rose-400/80">
          <span>📅 {new Date(valentine.date).toLocaleDateString()}</span>
          {valentine.show_on_wall && (
            <span className="flex items-center gap-1">
              👁️ {valentine.wall_display_name}
            </span>
          )}
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
    <main className="relative min-h-dvh bg-[#fff0f3]">
      <FloatingHearts />
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
             <span className="text-3xl">💝</span>
             <span className="font-heading text-xl font-bold text-rose-900 hidden sm:inline">Valentine's Day</span>
          </div>
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white text-rose-700 text-sm font-medium transition-all shadow-sm hover:shadow"
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
              <div className="relative group">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
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
                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 sm:ring-4 sm:ring-white/10 animate-pulse" />
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
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-700/30 text-white font-bold border border-white/20 hover:bg-rose-700/40 transition-all text-sm sm:text-base"
                  >
                    View Public Wall
                  </a>
                </div>
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
                  className="p-2 sm:px-4 sm:py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs sm:text-sm transition-colors shrink-0"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => window.open(`https://wa.me/?text=Send me a valentine! 💝 ${shareUrl}`, '_blank')}
                  className="flex-1 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  WhatsApp
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=Send me a valentine! 💝&url=${shareUrl}`, '_blank')}
                  className="flex-1 py-2 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Twitter
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
                 Don't worry! Share your link with friends and the love will start pouring in soon.
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
