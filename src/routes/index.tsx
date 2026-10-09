import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PasscodeScreen } from "@/components/love/PasscodeScreen";
import { BirthdayCake } from "@/components/love/BirthdayCake";
import { LoveMeterScreen } from "@/components/love/LoveMeterScreen";
import { FlamesScreen } from "@/components/love/FlamesScreen";
import { LoveStoryPage } from "@/components/love/LoveStoryPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [unlocked, setUnlocked] = useState(false);
  const [stage, setStage] = useState<"cake" | "lovemeter" | "flames" | "story">("cake");

  // Step 1: Passcode Screen
  if (!unlocked) {
    return <PasscodeScreen onUnlock={() => setUnlocked(true)} />;
  }

  // Step 2: Birthday Cake
  if (stage === "cake") {
    return <BirthdayCake onContinue={() => setStage("lovemeter")} />;
  }

  // Step 3: Biometric Love Scanner
  if (stage === "lovemeter") {
    return <LoveMeterScreen onContinue={() => setStage("flames")} />;
  }

  // Step 4: Full-Screen FLAMES Oracle
  if (stage === "flames") {
    return <FlamesScreen onContinue={() => setStage("story")} />;
  }

  // Step 5: Full Cinematic Love Story Experience
  return <LoveStoryPage />;
}

export default Index;
  
