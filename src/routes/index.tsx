import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Gateway & Interactive Stages
import { Opening } from "@/components/love/Opening";
import { BirthdayCake } from "@/components/love/BirthdayCake";
import { LoveMeterScreen } from "@/components/love/LoveMeterScreen";
import { FlamesScreen } from "@/components/love/FlamesScreen";

// Romantic Story Sections
import { Atmosphere } from "@/components/love/Atmosphere";
import { MusicToggle } from "@/components/love/MusicToggle";
import { Hero } from "@/components/love/Hero";
import { LoveLetter } from "@/components/love/LoveLetter";
import { SecretGateway } from "@/components/love/SecretGateway";
import { Surprise } from "@/components/love/Surprise";
import { Reasons } from "@/components/love/Reasons";
import { RomanticMilestones } from "@/components/love/RomanticMilestones";
import { Timeline } from "@/components/love/Timeline";
import { Gallery } from "@/components/love/Gallery";
import { Finale } from "@/components/love/Finale";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [stage, setStage] = useState<"opening" | "cake" | "lovemeter" | "flames" | "story">("opening");

  // Stage 1: Opening Passcode / Letter
  if (stage === "opening") {
    return <Opening onOpen={() => setStage("cake")} />;
  }

  // Stage 2: Birthday Cake
  if (stage === "cake") {
    return <BirthdayCake onEnter={() => setStage("lovemeter")} />;
  }

  // Stage 3: Love Scanner
  if (stage === "lovemeter") {
    return <LoveMeterScreen onContinue={() => setStage("flames")} />;
  }

  // Stage 4: FLAMES Oracle
  if (stage === "flames") {
    return <FlamesScreen onContinue={() => setStage("story")} />;
  }

  // Stage 5: Full Romantic Love Story (Original Lovable Layout)
  return (
    <div className="relative min-h-screen bg-[#0d0107] text-[#fff0f5] selection:bg-rose-500/30 selection:text-white pb-32 overflow-x-hidden">
      {/* Floating particles & ambiance */}
      <Atmosphere />

      {/* Floating Music Pill Player (Top-Center) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto">
        <MusicToggle autoplay={true} />
      </div>

      {/* Main Single Column Story */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto px-4 pt-16 space-y-12">
        <Hero />
        <LoveLetter />
        <SecretGateway />
        <Surprise />
        <Reasons />
        <RomanticMilestones />
        <Timeline />
        <Gallery />
        <Finale />
      </main>
    </div>
  );
}

export default Index;
