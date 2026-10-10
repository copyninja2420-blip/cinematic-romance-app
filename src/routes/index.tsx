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

  // Stage 1: Opening Passcode Gate
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

  // Stage 5: Original Lovable Story Stream
  return (
    <div className="relative min-h-screen bg-[#0d0107] text-[#fff0f5] selection:bg-rose-500/30 selection:text-white pb-24 overflow-x-hidden">
      <Atmosphere />

      {/* Floating Audio Bar */}
      <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm">
          <MusicToggle autoplay={true} />
        </div>
      </div>

      {/* Unconstrained Main Stream */}
      <main className="relative z-10 w-full">
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
