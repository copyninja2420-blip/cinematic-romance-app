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

  // Stage 1: Opening Letter ("Hey, My Love...")
  if (stage === "opening") {
    return <Opening onOpen={() => setStage("cake")} />;
  }

  // Stage 2: Birthday Cake
  if (stage === "cake") {
    return <BirthdayCake onContinue={() => setStage("lovemeter")} />;
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
    <div className="min-h-screen bg-[#0d0107] text-[#fff1f2] relative selection:bg-rose-900 selection:text-amber-100 overflow-x-hidden">
      <Atmosphere />
      <MusicToggle />

      <main className="relative z-10 flex flex-col gap-16 md:gap-24">
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
