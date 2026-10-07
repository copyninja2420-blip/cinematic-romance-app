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
import { Opening } from "@/components/love/Opening";
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
      { title: "Our Love Story — From My Heart to Yours ❤️" },
      {
        name: "description",
        content:
          "A private, cinematic birthday love letter: our story, our memories, and every reason I would choose you again.",
      },
      { property: "og:title", content: "Our Love Story — From My Heart to Yours ❤️" },
      {
        property: "og:description",
        content:
          "A romantic interactive birthday surprise — our timeline, memory gallery, sealed love letter and one last surprise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoveStoryPage,
});

function LoveStoryPage() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-background">
      {!opened && <Opening onOpen={() => setOpened(true)} />}

      <MusicToggle autoplay />
      <HeartTap />

      {opened && (
        <>
          <Atmosphere particles={20} hearts={6} />
          <div className="relative z-10 animate-fade-slow">
            <div data-companion="hero"><Hero /></div>
            <div data-companion="timeline"><Timeline /></div>
            <div data-companion="gallery"><Gallery /></div>
            <div data-companion="letter"><LoveLetter /></div>
            <RomanticMilestones />
            <div data-companion="surprise"><Surprise /></div>
            <div data-companion="reasons"><Reasons /></div>
            <div data-companion="finale"><Finale /></div>
            <Companion />
            <SecretGateway />
            <div className="flex flex-col items-center gap-5 pb-6">
              <ShareButton />
              <WhatsAppReaction />
            </div>
            <footer className="pb-44 text-center">
              <p className="script text-lg text-gold-soft/80">
                For{" "}
                <span className="romantic name-shimmer text-3xl">
                  {couple.wifeName}
                </span>
                , with all my heart ❤
              </p>
            </footer>
          </div>
        </>
      )}
    </main>
  );
}
