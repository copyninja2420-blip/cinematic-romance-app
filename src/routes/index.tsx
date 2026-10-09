import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PasscodeScreen } from "@/components/love/PasscodeScreen";
import { BirthdayCake } from "@/components/love/BirthdayCake";
import { LoveMeterScreen } from "@/components/love/LoveMeterScreen";
import { FlamesScreen } from "@/components/love/FlamesScreen";
import { Hero } from "@/components/love/Hero";
import { ChapterNav } from "@/components/love/ChapterNav";
import { StoryTimeline } from "@/components/love/StoryTimeline";
import { PhotoGallery } from "@/components/love/PhotoGallery";
import { RomanticMilestones } from "@/components/love/RomanticMilestones";
import { LoveLetter } from "@/components/love/LoveLetter";
import { ReasonsWhy } from "@/components/love/ReasonsWhy";
import { FloatingHearts } from "@/components/love/FloatingHearts";
import { MusicPlayer } from "@/components/love/MusicPlayer";
import { Surprise } from "@/components/love/Surprise";
import { Footer } from "@/components/love/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [unlocked, setUnlocked] = useState(false);
  const [stage, setStage] = useState<"cake" | "lovemeter" | "flames" | "story">("cake");

  // Step 1: Initial Passcode Lock Screen
  if (!unlocked) {
    return <PasscodeScreen onUnlock={() => setUnlocked(true)} />;
  }

  // Step 2: Birthday Cake Interactive Stage
  if (stage === "cake") {
    return <BirthdayCake onContinue={() => setStage("lovemeter")} />;
  }

  // Step 3: Biometric Love Scanner Stage
  if (stage === "lovemeter") {
    return <LoveMeterScreen onContinue={() => setStage("flames")} />;
  }

  // Step 4: Nostalgic FLAMES Oracle Stage
  if (stage === "flames") {
    return <FlamesScreen onContinue={() => setStage("story")} />;
  }

  // Step 5: Full Love Story Experience
  return (
    <div className="min-h-screen bg-[#0d0107] text-[#fff1f2] relative selection:bg-rose-900 selection:text-amber-100 overflow-x-hidden">
      {/* Floating Interactive Hearts Background */}
      <FloatingHearts />

      {/* Persistent Audio Player */}
      <MusicPlayer />

      {/* Story Sections */}
      <main className="relative z-10 flex flex-col gap-16 md:gap-24">
        <Hero />
        <ChapterNav />
        <StoryTimeline />
        <PhotoGallery />
        <RomanticMilestones />
        <ReasonsWhy />
        <LoveLetter />
        <Surprise />
        <Footer />
      </main>
    </div>
  );
}

export default Index;
