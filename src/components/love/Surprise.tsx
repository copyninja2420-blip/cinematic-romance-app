import { useEffect, useState } from "react";
import { surprise } from "@/content/loveStory";
import { useReveal } from "@/hooks/useReveal";
import { Typewriter } from "./Typewriter";

export function Surprise() {
  const { ref, shown } = useReveal(0.35);
  const [count, setCount] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      const t = setTimeout(() => setRevealed(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => (c ?? 1) - 1), 900);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div className="absolute inset-0 bg-halo" aria-hidden="true" />
      <div
        ref={ref}
        className={`relative mx-auto max-w-sm text-center reveal ${shown ? "reveal-in" : ""}`}
      >
        <h2 className="font-display text-[1.7rem] leading-snug tracking-wide text-warm text-glow">
          {surprise.title}
        </h2>

        {count === null && !revealed && (
          <button type="button" onClick={() => setCount(3)} className="btn-love mt-10">
            <span className="btn-love-glow" />
            <span className="relative">Tap to find out ✨</span>
          </button>
        )}

        {count !== null && !revealed && (
          <p key={count} className="countdown mt-10">
            {count === 0 ? "❤" : count}
          </p>
        )}

        {revealed && (
          <div className="glass animate-scale-in mt-10 rounded-3xl px-6 py-8">
            <p className="font-serif text-[1.02rem] leading-relaxed text-warm/85">
              <Typewriter text={surprise.reveal} speed={34} />
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
