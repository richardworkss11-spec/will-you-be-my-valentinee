"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useScreenState } from "@/hooks/useScreenState";
import FloatingHearts from "@/components/ui/FloatingHearts";
import LandingScreen from "@/components/screens/LandingScreen";
import CongratsScreen from "@/components/screens/CongratsScreen";
import FormScreen from "@/components/screens/FormScreen";
import ThankYouScreen from "@/components/screens/ThankYouScreen";
import MessageFormScreen from "@/components/screens/MessageFormScreen";
import MessageSentScreen from "@/components/screens/MessageSentScreen";

interface ValentineExperienceProps {
  profileId: string;
  profileName: string;
  profileAvatar: string | null;
  username: string;
}

export default function ValentineExperience({
  profileId,
  profileName,
  profileAvatar,
  username,
}: ValentineExperienceProps) {
  const searchParams = useSearchParams();
  const startWithMessage = searchParams.get("msg") === "1";
  const { screen, goTo, formData, updateField } = useScreenState(startWithMessage ? "message" : "landing");

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <LandingScreen
            key="landing"
            onYes={() => goTo("congrats")}
            onSendMessage={() => goTo("message")}
            profileName={profileName}
            profileAvatar={profileAvatar}
          />
        )}
        {screen === "congrats" && (
          <CongratsScreen
            key="congrats"
            onContinue={() => goTo("form")}
            onSendMessage={() => goTo("message")}
            profileName={profileName}
          />
        )}
        {screen === "form" && (
          <FormScreen
            key="form"
            formData={formData}
            updateField={updateField}
            onSuccess={() => goTo("thankyou")}
            profileId={profileId}
            profileName={profileName}
          />
        )}
        {screen === "thankyou" && (
          <ThankYouScreen
            key="thankyou"
            profileName={profileName}
            username={username}
            senderName={formData.name}
            onSendMessage={() => goTo("message")}
          />
        )}
        {screen === "message" && (
          <MessageFormScreen
            key="message"
            profileId={profileId}
            profileName={profileName}
            onSuccess={() => goTo("messageSent")}
          />
        )}
        {screen === "messageSent" && (
          <MessageSentScreen
            key="messageSent"
            profileName={profileName}
            username={username}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
