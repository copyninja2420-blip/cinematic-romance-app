import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Core components
import { Atmosphere } from "@/components/love/Atmosphere";
import { MusicToggle } from "@/components/love/MusicToggle";
import { Opening } from "@/components/love/Opening";
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

  // Screen 1: Passcode Gate & Opening
  if (!unlocked) {
    return <Opening onOpen={() => setUnlocked(true)} />;
  }

  // Screen 2: Original Single-Page Romantic Story
  return (
    <div className="relative min-h-screen bg-[#0d0107] text-[#fff0f5] selection:bg-rose-500/30 selection:text-white pb-32 overflow-x-hidden">
      {/* Floating Sparkles & Hearts */}
      <Atmosphere />

      {/* Floating Glassmorphism Music Capsule */}
      <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-xs">
          <MusicToggle autoplay={true} />
        </div>
      </div>

      {/* Main Stream with Lovable's Exact Spacing */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* 1. Hero */}
        <section className="w-full min-h-screen flex items-center justify-center">
          <Hero />
        </section>

        {/* 2. Timeline */}
        <section className="w-full max-w-md px-4 py-16">
          <Timeline />
        </section>

        {/* 3. Letter with Envelope */}
        <section className="w-full max-w-md px-4 py-16">
          <LoveLetter />
        </section>

        {/* 4. Three Secret Message Cards */}
        <section className="w-full max-w-md px-4 py-16">
          <SecretGateway />
        </section>

        {/* 5. "Wait... There's one more thing" */}
        <section className="w-full max-w-md px-4 py-16">
          <Surprise />
        </section>

        {/* 6. 15 Reasons 3x5 Grid */}
        <section className="w-full max-w-md px-4 py-16">
          <Reasons />
        </section>

        {/* 7. Finale */}
        <section className="w-full max-w-md px-4 py-20">
          <Finale />
        </section>
      </main>
    </div>
  );
}

export default Index;
