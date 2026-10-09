import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Atmosphere } from "@/components/love/Atmosphere";
import { Companion } from "@/components/love/Companion";
import { Finale } from "@/components/love/Finale";
import { Gallery } from "@/components/love/Gallery";
import { HeartTap } from "@/components/love/HeartTap";
import { Hero } from "@/components/love/Hero";
import { LoveLetter } from "@/components/love/LoveLetter";
import { MusicToggle } from "@/components/love/MusicToggle";
import { BirthdayCake } from "@/components/love/BirthdayCake";
import { LoveMeterScreen } from "@/components/love/LoveMeterScreen";
import { Reasons } from "@/components/love/Reasons";
import { RomanticMilestones } from "@/components/love/RomanticMilestones";
import { ShareButton } from "@/components/love/ShareButton";
import { SecretGateway } from "@/components/love/SecretGateway";
import { WhatsAppReaction } from "@/components/love/WhatsAppReaction";
import { Surprise } from "@/components/love/Surprise";
import { Timeline } from "@/components/love/Timeline";
import { couple } from "@/content/loveStory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Our Love Story — From My Heart to Yours" },
      {
        name: "description",
        content: "A private, cinematic birthday love letter.",
      },
      { property: "og:title", content: "Our Love Story" },
      {
        property: "og:description",
        content: "A romantic interactive birthday surprise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoveStoryPage,
});

function LoveStoryPage() {
  const [stage, setStage] = useState<"cake" | "lovemeter" | "story">("cake");

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-[#14030a] text-white">
      {/* Stage 1: Birthday Cake */}
      {stage === "cake" && (
        <BirthdayCake onEnter={() => setStage("lovemeter")} />
      )}

      {/* Stage 2: Love Meter & Fingerprint Scan */}
      {stage === "lovemeter" && (
        <LoveMeterScreen onContinue={() => setStage("story")} />
      )}

      {/* Stage 3: The Full Love Story Experience */}
      {stage === "story" && (
        <>
          <MusicToggle autoplay />
          <HeartTap />
          <Atmosphere particles={20} hearts={6} />

          <div className="relative z-10 animate-fade-in">
            <div data-companion="hero">
              <Hero />
            </div>

            <div data-companion="timeline">
              <Timeline />
            </div>

            <div data-companion="gallery">
              <Gallery />
            </div>

            <div data-companion="letter">
              <LoveLetter />
            </div>

            <RomanticMilestones />

            <div data-companion="surprise">
              <Surprise />
            </div>

            <div data-companion="reasons">
              <Reasons />
            </div>

            <div data-companion="finale">
              <Finale />
            </div>

            <SecretGateway />
            <WhatsAppReaction />
            <ShareButton />
          </div>

          <Companion />
        </>
      )}
    </main>
  );
}
