import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Gateway
import { Opening } from "@/components/love/Opening";

// Romantic Story Sections
import { Atmosphere } from "@/components/love/Atmosphere";
import { MusicToggle } from "@/components/love/MusicToggle";
import { Hero } from "@/components/love/Hero";
import { Timeline } from "@/components/love/Timeline";
import { LoveLetter } from "@/components/love/LoveLetter";
import { SecretGateway } from "@/components/love/SecretGateway";
import { Surprise } from "@/components/love/Surprise";
import { Reasons } from "@/components/love/Reasons";
import { Finale } from "@/components/love/Finale";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [unlocked, setUnlocked] = useState(false);

  // Entrance Passcode Screen
  if (!unlocked) {
    return <Opening onOpen={() => setUnlocked(true)} />;
  }

  // Exact Lovable Story Stream
  return (
    <div className="relative min-h-screen bg-[#0d0107] text-[#fff0f5] selection:bg-rose-500/30 selection:text-white pb-32 overflow-x-hidden">
      {/* Background Ambience */}
      <Atmosphere />

      {/* Centered Top Music Capsule */}
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm">
          <MusicToggle autoplay={true} />
        </div>
      </div>

      {/* Exact Lovable Screen Order */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 flex flex-col items-center space-y-20 pt-4">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Timeline ("The moment I fell for you...") */}
        <Timeline />

        {/* 3. Red Wax Sealed Envelope & Letter */}
        <LoveLetter />

        {/* 4. Three Cards (Hidden Message, Our Little Moment, Heart Shower) */}
        <SecretGateway />

        {/* 5. "Wait... There's one more thing." */}
        <Surprise />

        {/* 6. 15 Reasons (No. 1 to No. 15 hearts grid) */}
        <Reasons />

        {/* 7. Finale ("If I could choose again...", "Share this surprise") */}
        <Finale />
      </main>
    </div>
  );
}

export default Index;
