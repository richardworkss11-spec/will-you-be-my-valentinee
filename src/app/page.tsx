"use client";

import { AnimatePresence } from "motion/react";
import { useScreenState } from "@/hooks/useScreenState";
import FloatingHearts from "@/components/ui/FloatingHearts";
import LandingScreen from "@/components/screens/LandingScreen";
import CongratsScreen from "@/components/screens/CongratsScreen";
import FormScreen from "@/components/screens/FormScreen";
import ThankYouScreen from "@/components/screens/ThankYouScreen";

export default function Home() {
  const { screen, goTo, formData, updateField } = useScreenState();

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <LandingScreen key="landing" onYes={() => goTo("congrats")} />
        )}
        {screen === "congrats" && (
          <CongratsScreen key="congrats" onContinue={() => goTo("form")} />
        )}
        {screen === "form" && (
          <FormScreen
            key="form"
            formData={formData}
            updateField={updateField}
            onSuccess={() => goTo("thankyou")}
          />
        )}
        {screen === "thankyou" && (
          <ThankYouScreen key="thankyou" />
        )}
      </AnimatePresence>
    </main>
  );
}
