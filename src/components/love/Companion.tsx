import { lazy, Suspense, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCompanion,
  say,
  setMood,
  setPointer,
  tapCompanion,
  useCompanion,
  walkTo,
  type Mood,
} from "@/lib/companion";

const CompanionScene = lazy(() => import("./companion/CompanionScene"));

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Scripted beats for the sections he travels through. */
const SCENES: Record<string, { x: number; mood: Mood; line?: string }> = {
  hero: { x: 0.18, mood: "wave", line: "Happy Birthday, my love ❤️" },
  timeline: { x: 0.12, mood: "point", line: "Our story starts here…" },
  gallery: { x: 0.85, mood: "jump", line: "Look at us 💕" },
  letter: { x: 0.14, mood: "read", line: "Go on… open it 💌" },
  surprise: { x: 0.88, mood: "peek", line: "There is another surprise ahead 👀" },
  reasons: { x: 0.12, mood: "walk", line: "So many reasons…" },
  finale: { x: 0.5, mood: "present", line: "Happy Birthday, My Love ❤️" },
};


export function Companion() {
  const { x, message } = useCompanion();
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!webglOk()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setEnabled(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  /* look at the cursor / touch */
  useEffect(() => {
    const move = (e: PointerEvent) =>
      setPointer(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  /* react to the section on screen */
  useEffect(() => {
    if (!enabled) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-companion]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || e.intersectionRatio < 0.45) continue;
          const key = e.target.getAttribute("data-companion") ?? "";
          const scene = SCENES[key];
          if (!scene) continue;
          walkTo(scene.x, Math.abs(scene.x - getCompanion().x) > 0.4 ? "run" : "walk");
          window.setTimeout(() => setMood(scene.mood, scene.mood === "present" ? 0 : 5000), 1200);
          if (scene.line) say(scene.line, 4200);
          if (scene.mood === "present") {
            window.setTimeout(() => say("Forever with you.", 6000), 5200);
          }
          if (scene.mood === "peek") {
            window.setTimeout(() => setMood("heart", 3000), 3000);
          }
        }
      },
      { threshold: [0.45] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  /* little life of his own: wander, blow kisses, hold a heart */
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      const s = getCompanion();
      if (s.mood === "present" || s.mood === "read") return;
      const roll = Math.random();
      if (roll < 0.3) walkTo(0.12 + Math.random() * 0.76);
      else if (roll < 0.4) walkTo(0.12 + Math.random() * 0.76, "run");
      else if (roll < 0.56) setMood("kiss", 2400);
      else if (roll < 0.7) setMood("heart", 3200);
      else if (roll < 0.82) setMood("wave", 2200);
      else if (roll < 0.92) setMood("point", 2400);
      else setMood("jump", 1400);

    }, 7000);
    return () => window.clearInterval(id);
  }, [enabled]);

  if (!enabled || hidden) return null;

  return (
    <aside
      className="relative z-10 mx-auto mt-2 w-full max-w-2xl select-none overflow-hidden px-4 pb-10"
      aria-label="Your romantic companion"
    >
      <div className="relative min-h-[24rem] overflow-hidden rounded-2xl border border-gold-soft/15 bg-burgundy-deep/25">
      {message && (
        <div
          className="pointer-events-none absolute top-5 z-30 -translate-x-1/2 transition-[left] duration-700 ease-out"
          style={{ left: `${Math.min(88, Math.max(12, x * 100))}%` }}
        >
          <div className="glass max-w-[13rem] rounded-xl px-4 py-2 text-center font-serif text-[0.78rem] leading-snug text-warm shadow-lg animate-rise">
            {message}
          </div>
        </div>
      )}

      <div className="relative h-[24rem] w-full">
        <Suspense fallback={null}>
          <CompanionScene />
        </Suspense>

        {/* tap target that follows him */}
        <button
          type="button"
          aria-label="Say hello to him"
          onClick={tapCompanion}
          className="pointer-events-auto absolute bottom-2 size-24 -translate-x-1/2 rounded-full transition-[left] duration-700 ease-out focus-visible:outline-2 focus-visible:outline-gold-soft"
          style={{ left: `${Math.min(94, Math.max(6, x * 100))}%` }}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Hide companion"
        onClick={() => setHidden(true)}
        className="pointer-events-auto absolute right-3 top-3 z-40 size-8 rounded-full border border-gold-soft/25 bg-burgundy-deep/70 text-warm/70 backdrop-blur hover:bg-burgundy hover:text-warm"
      >
        <X className="size-3.5" />
      </Button>
      </div>
      <p className="mt-4 text-center font-serif text-xs tracking-[0.12em] text-warm/55">
        Here with you, all the way to forever.
      </p>
    </aside>
  );
}
