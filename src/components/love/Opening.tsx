import { useState } from "react";
import { Atmosphere } from "./Atmosphere";
import { Typewriter } from "./Typewriter";
import { opening } from "@/content/loveStory";

export function Opening({ onOpen }: { onOpen: () => void }) {
  const [bursting, setBursting] = useState(false);

  const handle = () => {
    setBursting(true);
    window.setTimeout(onOpen, 1500);
  };

  return (
    <div className={`curtain ${bursting ? "curtain-lift" : ""}`}>
      <Atmosphere particles={44} hearts={16} />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-7 text-center">
        <p className="script text-3xl text-gold-soft/90">❦</p>
        <h1 className="mt-5 max-w-sm font-display text-[1.7rem] leading-snug tracking-wide text-warm">
          <Typewriter text={opening.whisper} speed={55} />
        </h1>

        <div className={`mt-12 ${bursting ? "heart-burst" : ""}`}>
          <button type="button" onClick={handle} className="btn-love" disabled={bursting}>
            <span className="btn-love-glow" />
            <span className="relative">{opening.button}</span>
          </button>
        </div>

        <p className="mt-10 text-[0.7rem] uppercase tracking-[0.35em] text-warm/40">
          Made only for you
        </p>
      </div>
    </div>
  );
}
