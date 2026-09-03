import { useState } from "react";
import { extraSurprises } from "@/content/loveStory";
import { Typewriter } from "./Typewriter";

/** Three little hidden reveals that appear once the letter is opened. */
export function MoreSurprises() {
  const [open, setOpen] = useState<number[]>([]);
  const [rain, setRain] = useState(false);

  const reveal = (i: number) => {
    setOpen((o) => (o.includes(i) ? o : [...o, i]));
    if (extraSurprises[i]?.hearts) {
      setRain(true);
      window.setTimeout(() => setRain(false), 6000);
    }
  };

  return (
    <div className="mx-auto mt-12 grid max-w-sm gap-4">
      {rain && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <span
              key={i}
              className="float-heart"
              style={{
                left: `${(i * 17) % 100}%`,
                fontSize: 14 + (i % 6) * 5,
                animationDelay: `${(i % 10) * 0.22}s`,
                animationDuration: `${3 + (i % 5) * 0.7}s`,
              }}
            >
              {i % 3 === 0 ? "💖" : i % 3 === 1 ? "❤️" : "💗"}
            </span>
          ))}
        </div>
      )}

      {extraSurprises.map((s, i) => (
        <div key={s.title} className="glass rounded-3xl px-5 py-5 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-soft/70">
            {s.kicker}
          </p>
          <p className="script mt-2 text-xl text-warm">{s.title}</p>

          {open.includes(i) ? (
            <p className="mt-3 whitespace-pre-line font-serif text-[0.92rem] leading-relaxed text-warm/85">
              <Typewriter text={s.text} speed={30} />
            </p>
          ) : (
            <button
              type="button"
              onClick={() => reveal(i)}
              className="btn-love mt-4 scale-90"
            >
              <span className="btn-love-glow" />
              <span className="relative">{s.button}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
