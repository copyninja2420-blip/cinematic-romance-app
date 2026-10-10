import { useEffect, useState } from "react";
import { Atmosphere } from "./Atmosphere";
import { Fireworks } from "./Fireworks";
import { Typewriter } from "./Typewriter";
import { opening } from "@/content/loveStory";

export function Opening({ onOpen }: { onOpen: () => void }) {
  const [bursting, setBursting] = useState(false);
  const [stage, setStage] = useState(0);

  const greeting = opening?.greeting || "Hey, My Love...";
  const whisper = opening?.whisper || "I made something special for you ❤️";
  const second = (opening as Record<string, any>)?.second || "Every moment with you is magic ✨";
  const buttonText = (opening as Record<string, any>)?.button || "Open Surprise";

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage(1), 500);
    return () => window.clearTimeout(t1);
  }, []);

  const handle = () => {
    setBursting(true);
    window.setTimeout(onOpen, 700);
  };

  return (
    <div className={`curtain ${bursting ? "curtain-burst" : ""} min-h-screen relative overflow-hidden bg-[#0d0107] text-[#fff0f5] flex items-center justify-center text-center p-4`}>
      <Atmosphere particles={18} hearts={8} />
      <Fireworks bursts={5} sparks={12} />

      <div className="relative z-10 flex min-h-[60vh] max-w-lg flex-col items-center justify-center">
        <p className="script animate-fade-in text-sm text-rose-300/60 mb-2">
          A surprise for you
        </p>

        <h1 className="romantic name-shimmer text-3xl md:text-5xl font-serif text-rose-100">
          {greeting}
        </h1>

        <div className="mt-7 min-h-[3.4rem] max-w-sm px-2">
          {stage >= 1 && (
            <Typewriter
              text={whisper}
              speed={32}
              onDone={() => window.setTimeout(() => setStage(2), 600)}
            />
          )}
        </div>

        <div className="mt-5 min-h-[3rem] max-w-sm px-2">
          {stage >= 2 && (
            <Typewriter
              text={second}
              speed={26}
              onDone={() => setStage(3)}
            />
          )}
        </div>

        <div className={`mt-12 transition-all duration-700 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          <button
            type="button"
            onClick={handle}
            className="btn-love-glow relative px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium shadow-lg shadow-rose-950/50 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="relative z-10">{buttonText}</span>
          </button>
        </div>

        {stage < 3 && (
          <button
            type="button"
            onClick={() => setStage(3)}
            className="mt-8 text-[0.65rem] uppercase tracking-widest text-rose-300/40 hover:text-rose-200"
          >
            Skip
          </button>
        )}

        <p className="mt-6 text-[0.7rem] uppercase tracking-wider text-rose-300/30">
          Made only for you
        </p>
      </div>
    </div>
  );
}

export default Opening;
