import { useState } from "react";
import { letter } from "@/content/loveStory";
import { useReveal } from "@/hooks/useReveal";
import { SectionTitle } from "./SectionTitle";
import { Typewriter } from "./Typewriter";

type BurstHeart = { left: number; size: number; delay: number; duration: number };

export function LoveLetter() {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState<BurstHeart[]>([]);
  const { ref, shown } = useReveal(0.25);

  const openLetter = () => {
    setOpen(true);
    setBurst(
      Array.from({ length: 26 }, () => ({
        left: Math.random() * 100,
        size: 14 + Math.random() * 22,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.8,
      })),
    );
    window.setTimeout(() => setBurst([]), 4800);
  };

  return (
    <section className="relative px-6 py-24">
      {burst.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
          {burst.map((h, i) => (
            <span
              key={i}
              className="float-heart"
              style={{
                left: `${h.left}%`,
                fontSize: h.size,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
                animationIterationCount: 1,
              }}
            >
              {i % 3 === 0 ? "💖" : i % 3 === 1 ? "❤️" : "💕"}
            </span>
          ))}
        </div>
      )}
      <SectionTitle kicker="A letter for you" title="Words I've kept for this day" />

      <div ref={ref} className={`mx-auto mt-14 max-w-sm reveal ${shown ? "reveal-in" : ""}`}>
        <div className={`envelope ${open ? "envelope-open" : ""}`}>
          <div className="envelope-flap" />
          <div className="envelope-body" />
          <div className="envelope-seal">❤</div>
        </div>

        {!open && (
          <button type="button" onClick={openLetter} className="btn-love mx-auto mt-8 block">
            <span className="btn-love-glow" />
            <span className="relative">{letter.button}</span>
          </button>
        )}

        {open && (
          <div className="letter-paper animate-rise mt-6">
            <p className="script text-2xl text-ink">{letter.greeting}</p>
            <p className="mt-4 min-h-24 whitespace-pre-line font-serif text-[0.95rem] leading-relaxed text-ink/80">
              <Typewriter text={letter.body} speed={38} />
            </p>
            <p className="script mt-6 text-right text-xl text-burgundy">{letter.signature}</p>
          </div>
        )}
      </div>
    </section>
  );
}
