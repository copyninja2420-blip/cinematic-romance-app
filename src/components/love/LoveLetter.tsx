import { useState } from "react";
import { letter } from "@/content/loveStory";
import { useReveal } from "@/hooks/useReveal";
import { SectionTitle } from "./SectionTitle";
import { Typewriter } from "./Typewriter";

export function LoveLetter() {
  const [open, setOpen] = useState(false);
  const { ref, shown } = useReveal(0.25);

  return (
    <section className="relative px-6 py-24">
      <SectionTitle kicker="A letter for you" title="Words I've kept for this day" />

      <div ref={ref} className={`mx-auto mt-14 max-w-sm reveal ${shown ? "reveal-in" : ""}`}>
        <div className={`envelope ${open ? "envelope-open" : ""}`}>
          <div className="envelope-flap" />
          <div className="envelope-body" />
          <div className="envelope-seal">❤</div>
        </div>

        {!open && (
          <button type="button" onClick={() => setOpen(true)} className="btn-love mx-auto mt-8 block">
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
