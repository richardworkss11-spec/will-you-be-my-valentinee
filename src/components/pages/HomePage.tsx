"use client";

import { motion } from "motion/react";
import FloatingHearts from "@/components/ui/FloatingHearts";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <FloatingHearts />

      <div className="flex flex-col items-center justify-center min-h-dvh gap-8 px-4 relative z-10">
        <motion.div
          className="text-7xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💝
        </motion.div>

        <motion.h1
          className="font-heading text-5xl sm:text-7xl font-bold text-rose-dark text-center leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Valentine&apos;s Day
        </motion.h1>

        <motion.p
          className="text-xl text-rose-dark/70 text-center max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Create your personal valentine page, share your link, and collect
          valentines from the people who love you!
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={handleSignIn}
            className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-rose-dark shadow-lg border-2 border-rose-light cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </motion.button>

          <p className="text-sm text-rose-dark/40">
            Get your own valentine page in seconds
          </p>
        </motion.div>
      </div>
    </main>
  );
}
