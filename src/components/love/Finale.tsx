import { useCallback, useEffect, useState } from "react";
import { couple, finale, secret } from "@/content/loveStory";
import { useReveal } from "@/hooks/useReveal";
import { say, setMood, walkTo } from "@/lib/companion";
import { Typewriter } from "./Typewriter";

export function Finale() {
  const { ref, shown } = useReveal(0.4);
  const [chosen, setChosen] = useState(false);
  const [forever, setForever] = useState(false);
  const [typed, setTyped] = useState(false);
  const [beat, setBeat] = useState(0); // how many of finale.beats are shown
  const [taps, setTaps] = useState(0);
  const handleDone = useCallback(() => setTyped(true), []);

  useEffect(() => {
    if (!typed || beat >= finale.beats.length) return;
    const t = window.setTimeout(() => setBeat((b) => b + 1), 1100);
    return () => window.clearTimeout(t);
  }, [typed, beat]);

  const secretFound = taps >= 3;

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-7 py-24 text-center">
      <div className="absolute inset-0 bg-halo" aria-hidden="true" />
      <div ref={ref} className={`relative max-w-sm reveal ${shown ? "reveal-in" : ""}`}>
        <p className="script text-2xl text-gold-soft">{finale.question}</p>

        {!chosen ? (
          <button
            type="button"
            onClick={() => {
              setChosen(true);
              walkTo(0.5, "walk");
              window.setTimeout(() => setMood("present"), 1300);
            }}
            className="btn-love mt-10"
          >
            <span className="btn-love-glow" />
            <span className="relative">Reveal my answer ❤️</span>
          </button>
        ) : (
          <>
            <p className="mt-8 font-display text-[1.55rem] leading-snug tracking-wide text-warm text-glow">
              <Typewriter text={finale.answer} speed={30} onDone={handleDone} />
            </p>

            <div className="mt-8 space-y-2">
              {finale.beats.slice(0, beat).map((b) => (
                <p
                  key={b}
                  className="animate-rise font-serif text-[1.05rem] tracking-[0.12em] text-warm/80"
                >
                  {b}
                </p>
              ))}
            </div>

            {beat >= finale.beats.length && (
              <>
                <button
                  type="button"
                  aria-label="Glowing heart"
                  onClick={() => setTaps((t) => t + 1)}
                  className="mx-auto mt-10 block"
                >
                  <span className="locked-heart is-unlocking text-6xl">❤</span>
                </button>

                <p className="animate-rise mt-8 whitespace-pre-line font-display text-[1.2rem] leading-relaxed tracking-[0.06em] text-gradient-love">
                  {finale.closing}
                </p>

                {secretFound && (
                  <div className="glass animate-scale-in mt-8 rounded-3xl px-5 py-6">
                    <p className="script text-xl text-gold-soft">{secret.found}</p>
                    <p className="mt-3 font-serif text-[0.95rem] leading-relaxed text-warm/85">
                      {secret.message}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setForever(true);
                    setMood("present");
                    say("Forever with you.", 6000);
                  }}
                  className={`btn-love mt-12 ${forever ? "btn-forever" : ""}`}
                >
                  <span className="btn-love-glow" />
                  <span className="relative">
                    {forever ? "Always, and always ❤️" : finale.button}
                  </span>
                </button>
              </>
            )}

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
