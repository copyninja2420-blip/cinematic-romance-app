import { useEffect, useRef, useState } from "react";
import { ArrowRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Atmosphere } from "./Atmosphere";
import { birthdayCake } from "@/content/loveStory";
import { canEnterStory, nextCakePhase, type CakePhase } from "@/lib/birthdayCake";
import cakeImage from "@/assets/birthday-cake.png";

export function BirthdayCake({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<CakePhase>("lit");
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setMounted(true);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const blow = () => setPhase((current) => nextCakePhase(current, "blow"));
  const enter = () => {
    if (!canEnterStory(phase) || leaving) return;
    setLeaving(true);
    timer.current = setTimeout(onEnter, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500);
  };

  return (
    <section aria-labelledby="cake-title" className={`birthday-welcome ${leaving ? "birthday-leaving" : ""}`}>
      {mounted && <Atmosphere particles={14} hearts={3} />}
      {phase !== "lit" && <div className="cake-celebration" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => <span key={i} className={i % 3 === 0 ? "cake-heart" : "cake-confetti"} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 7) * 0.13}s`, "--confetti-drift": `${(i % 2 ? 1 : -1) * (20 + i * 2)}px` } as React.CSSProperties}>{i % 3 === 0 ? "♥" : ""}</span>)}
      </div>}
      <div className="cake-welcome-content">
        <header className="text-center">
          <p className="mb-3 font-display text-xs text-gold-soft/70">A little magic, before our story</p>
          <h1 id="cake-title" className="romantic text-5xl leading-[1.15] text-gold-soft sm:text-6xl">{birthdayCake.title}</h1>
          <p className="mx-auto mt-4 max-w-sm font-display text-lg leading-relaxed text-warm/85">{birthdayCake.subtitle}</p>
        </header>

        <div className={`birthday-cake-stage ${phase === "cut" ? "cake-is-cut" : ""}`}>
          <img src={cakeImage} alt="Two-tier cream birthday cake with berries, burgundy roses and gold leaf" width={1024} height={1024} fetchPriority="high" className="birthday-cake-image" />
          <div className="birthday-candle">
            <span className="birthday-candle-wick" />
            <span className="birthday-candle-body" />
            {phase === "lit" ? <Button variant="ghost" aria-label="Blow out candle flame" onClick={blow} className="birthday-flame-target"><span className="birthday-flame" /></Button> : <span className="birthday-smoke" aria-hidden="true"><i /><i /><i /></span>}
          </div>
          {phase === "cut" && <div className="birthday-cut-mark" aria-hidden="true" />}
        </div>

        <div className="birthday-cake-actions">
          <div aria-live="polite" className="cake-wish-message">
            {phase === "cut" ? <p className="font-display text-xl text-gold-soft">{birthdayCake.message}</p> : phase === "blown" ? <p className="script text-2xl text-gold-soft">{birthdayCake.wish}</p> : <span className="font-display text-sm italic text-warm/60">One candle. A thousand wishes. All for you.</span>}
          </div>
          {phase === "lit" ? <Button onClick={blow} className="btn-love h-auto w-auto whitespace-normal px-6 py-4">{birthdayCake.blow}</Button> : <>
            {phase === "blown" && <Button variant="ghost" onClick={() => setPhase((current) => nextCakePhase(current, "cut"))} className="h-11 text-gold-soft hover:bg-gold-soft/10 hover:text-gold-soft"><Utensils />{birthdayCake.cut}</Button>}
            <Button ref={enterRef} onClick={enter} disabled={leaving} className="btn-love h-auto w-auto whitespace-normal px-7 py-4">{birthdayCake.enter}<ArrowRight /></Button>
          </>}
        </div>
      </div>
    </section>
  );
}