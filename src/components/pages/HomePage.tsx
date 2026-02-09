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

      {/* Hero Section */}
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
          Will You Be My Valentine?
        </motion.h1>

        <motion.p
          className="text-xl text-rose-dark/70 text-center max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Create your free personalized valentine page, share your unique link,
          and collect heartfelt messages from the people who love you!
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
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
            Create Your Valentine Page
          </motion.button>

          <p className="text-sm text-rose-dark/40">
            Free forever. Get your own valentine page in seconds.
          </p>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section className="relative z-10 bg-white/60 backdrop-blur-sm py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="font-heading text-4xl sm:text-5xl font-bold text-rose-dark text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
            <motion.div
              className="flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl">✨</div>
              <h3 className="text-xl font-bold text-rose-dark">
                Create Your Page
              </h3>
              <p className="text-rose-dark/60">
                Sign up instantly with Google and pick a unique username. Your
                personalized valentine page is ready to share in seconds.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl">🔗</div>
              <h3 className="text-xl font-bold text-rose-dark">
                Share Your Link
              </h3>
              <p className="text-rose-dark/60">
                Share your unique valentine link on WhatsApp, Instagram, or
                anywhere. Anyone with the link can send you a valentine — no
                sign-up needed!
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl">💌</div>
              <h3 className="text-xl font-bold text-rose-dark">
                Collect Valentines
              </h3>
              <p className="text-rose-dark/60">
                Receive heartfelt messages, photos, song dedications, and more.
                View them all on your private dashboard or public wall of love.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="font-heading text-4xl sm:text-5xl font-bold text-rose-dark text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Our Valentine Page Creator?
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <motion.div
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-light/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-rose-dark mb-2">
                Beautiful Personalized Cards
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Each valentine is a rich, beautiful card with names, photos,
                messages, song dedications, and special dates — far more
                personal than a generic e-card.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-light/30"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-rose-dark mb-2">
                Public Wall of Love
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Show off your valentines on a beautiful public wall. Each sender
                controls their own privacy — they choose what appears publicly
                and what stays private.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-light/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-rose-dark mb-2">
                No Sign-Up to Send
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Your friends and loved ones don&apos;t need an account to send
                you a valentine. Just share your link and they can send their
                message instantly.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-light/30"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-rose-dark mb-2">
                Easy Social Sharing
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Share valentines directly to WhatsApp, Instagram Stories, and
                more. Save valentine cards as images to share anywhere. Built for
                the way you actually communicate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 bg-white/60 backdrop-blur-sm py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-heading text-4xl sm:text-5xl font-bold text-rose-dark text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-rose-light/20"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-rose-dark mb-2">
                How do I create a valentine page?
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Simply sign in with Google, choose a unique username, and your
                personal valentine page is ready! Share your link with friends
                and loved ones so they can send you heartfelt valentine messages.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-rose-light/20"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="font-bold text-rose-dark mb-2">
                Is it free to create a valentine page?
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Yes, completely free! Create your page, share it, and receive
                unlimited valentine messages at no cost. No hidden fees, no
                premium tiers — just pure valentine love.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-rose-light/20"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-rose-dark mb-2">
                Can I control who sees my valentines?
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Each sender controls whether their valentine appears on your
                public wall. You always see all valentines in your private
                dashboard. Senders can also choose their display name and whether
                their photo is visible.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-rose-light/20"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="font-bold text-rose-dark mb-2">
                How do I send a valentine to someone?
              </h3>
              <p className="text-rose-dark/60 text-sm">
                Visit their unique valentine page link, click
                &quot;Yes&quot; to be their valentine, and fill in your heartfelt
                message with optional photo, song, and more. No sign-up required
                to send a valentine!
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 rounded-2xl p-6 border border-rose-light/20"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-bold text-rose-dark mb-2">
                What can I include in a valentine message?
              </h3>
              <p className="text-rose-dark/60 text-sm">
                You can include your name, a personal love note, a photo, a
                dedicated song, a special date, your location, your Instagram
                handle, and the reason why they&apos;re special to you. Make it
                as personal as you want!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-20 px-4 text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-rose-dark mb-6">
            Ready to Create Your Valentine Page?
          </h2>
          <p className="text-lg text-rose-dark/60 mb-8">
            Join thousands of people sending and receiving digital valentines.
            Create your free valentine page and start collecting heartfelt
            messages today.
          </p>
          <motion.button
            onClick={handleSignIn}
            className="inline-flex items-center gap-3 rounded-full bg-rose-dark px-10 py-4 text-lg font-semibold text-white shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}
