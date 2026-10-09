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
import { Timeline } from "@/components/love/Timeline";
import { Gallery } from "@/components/love/Gallery";
import { RomanticMilestones } from "@/components/love/RomanticMilestones";
import { Reasons } from "@/components/love/Reasons";
import { LoveLetter } from "@/components/love/LoveLetter";
import { SecretGateway } from "@/components/love/SecretGateway";
import { Surprise } from "@/components/love/Surprise";
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

  // Stage 5: Full Romantic Love Story
  return (
    <div className="min-h-screen bg-[#0d0107] text-[#fff0f5] selection:bg-rose-500/30 selection:text-white pb-24">
      <Atmosphere />
      <div className="fixed top-4 right-4 z-50">
        <MusicToggle autoplay={true} />
      </div>

      <main className="relative z-10 flex flex-col space-y-16 max-w-4xl mx-auto px-4 pt-12">
        <Hero />
        <Timeline />
        <Gallery />
        <RomanticMilestones />
        <Reasons />
        <LoveLetter />
        <SecretGateway />
        <Surprise />
        <Finale />
      </main>
    </div>
  );
}

export default Index;
        
