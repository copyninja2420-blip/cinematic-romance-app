import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Gateway & Stages
import { SecretGateway } from "@/components/love/SecretGateway";
import { BirthdayCake } from "@/components/love/BirthdayCake";
import { LoveMeterScreen } from "@/components/love/LoveMeterScreen";
import { FlamesScreen } from "@/components/love/FlamesScreen";

// Story Sections
import { Atmosphere } from "@/components/love/Atmosphere";
import { MusicToggle } from "@/components/love/MusicToggle";
import { Hero } from "@/components/love/Hero";
import { Opening } from "@/components/love/Opening";
import { Timeline } from "@/components/love/Timeline";
import { Gallery } from "@/components/love/Gallery";
import { RomanticMilestones } from "@/components/love/RomanticMilestones";
import { Reasons } from "@/components/love/Reasons";
import { LoveLetter } from "@/components/love/LoveLetter";
import { Surprise } from "@/components/love/Surprise";
import { Finale } from "@/components/love/Finale";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [unlocked, setUnlocked] = useState(false);
  const [stage, setStage] = useState<"cake" | "lovemeter" | "flames" | "story">("cake");

  // Step 1: Passcode Screen
  if (!unlocked) {
    return <SecretGateway onUnlock={() => setUnlocked(true)} />;
  }

  // Step 2: Birthday Cake
  if (stage === "cake") {
    return <BirthdayCake onContinue={() => setStage("lovemeter")} />;
  }

  // Step 3: Love Scanner
  if (stage === "lovemeter") {
    return <LoveMeterScreen onContinue={() => setStage("flames")} />;
  }

  // Step 4: FLAMES Oracle Stage
  if (stage === "flames") {
    return <FlamesScreen onContinue={() => setStage("story")} />;
  }

  // Step 5: The Full Romantic Story
  return (
    <div className="min-h-screen bg-[#0d0107] text-[#fff1f2] relative selection:bg-rose-900 selection:text-amber-100 overflow-x-hidden">
      <Atmosphere />
      <MusicToggle />

      <main className="relative z-10 flex flex-col gap-16 md:gap-24">
        <Hero />
        <Opening />
        <Timeline />
        <Gallery />
        <RomanticMilestones />
        <Reasons />
        <LoveLetter />
        <Surprise />
        <Finale />
      </main>
    </div>
  );
}

export default Index;
