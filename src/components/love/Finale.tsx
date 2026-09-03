import { useCallback, useState } from "react";
import { couple, finale } from "@/content/loveStory";
import { useReveal } from "@/hooks/useReveal";
import { Typewriter } from "./Typewriter";

export function Finale() {
  const { ref, shown } = useReveal(0.4);
  const [chosen, setChosen] = useState(false);
  const [forever, setForever] = useState(false);
  const [typed, setTyped] = useState(false);
  const handleDone = useCallback(() => setTyped(true), []);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-7 py-24 text-center">
      <div className="absolute inset-0 bg-halo" aria-hidden="true" />
      <div ref={ref} className={`relative max-w-sm reveal ${shown ? "reveal-in" : ""}`}>
        <p className="script text-2xl text-gold-soft">{finale.question}</p>

        {!chosen ? (
          <button type="button" onClick={() => setChosen(true)} className="btn-love mt-10">
            <span className="btn-love-glow" />
            <span className="relative">Reveal my answer ❤️</span>
          </button>
        ) : (
          <>
            <p className="mt-8 whitespace-pre-line font-display text-[1.55rem] leading-snug tracking-wide text-warm text-glow">
              <Typewriter text={finale.answer} speed={30} onDone={handleDone} />
            </p>

            <p className="mt-12 whitespace-pre-line font-serif text-[1.05rem] leading-relaxed text-gradient-love">
              {finale.closing}
            </p>

            <button
              type="button"
              onClick={() => setForever(true)}
              className={`btn-love mt-12 ${forever ? "btn-forever" : ""}`}
            >
              <span className="btn-love-glow" />
              <span className="relative">
                {forever ? "Always, and always ❤️" : finale.button}
              </span>
            </button>

            {forever && (
              <div className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
                {Array.from({ length: 22 }, (_, i) => (
                  <span
                    key={i}
                    className="confetti-heart"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      animationDelay: `${(i % 8) * 0.25}s`,
                      fontSize: 12 + (i % 5) * 5,
                    }}
                  >
                    ❤
                  </span>
                ))}
              </div>
            )}

            {typed && (
              <p className="romantic name-shimmer animate-rise mt-14 text-3xl">
                {couple.husbandName}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
