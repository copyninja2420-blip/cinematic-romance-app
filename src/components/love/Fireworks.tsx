import { useMemo } from "react";

const rnd = (seed: number) => {
  const x = Math.sin(seed * 3571 + 1013) * 43758.5453;
  return x - Math.floor(x);
};

const HUES = ["#ffd79a", "#ff8fb1", "#ff5f8f", "#ffe7c2", "#ff9ce0"];

/** Pure-CSS fireworks bursts. Light-weight: only transform/opacity animate. */
export function Fireworks({ bursts = 6, sparks = 14 }: { bursts?: number; sparks?: number }) {
  const shows = useMemo(
    () =>
      Array.from({ length: bursts }, (_, b) => ({
        left: 8 + rnd(b + 3) * 84,
        top: 8 + rnd(b + 31) * 46,
        delay: rnd(b + 61) * 5.5,
        dur: 2.2 + rnd(b + 91) * 1.4,
        color: HUES[b % HUES.length],
        sparks: Array.from({ length: sparks }, (_, s) => {
          const angle = (s / sparks) * Math.PI * 2 + rnd(b * 31 + s) * 0.4;
          const dist = 52 + rnd(b * 17 + s + 5) * 58;
          return {
            tx: Math.cos(angle) * dist,
            ty: Math.sin(angle) * dist,
          };
        }),
      })),
    [bursts, sparks],
  );

  return (
    <div className="fireworks" aria-hidden="true">
      {shows.map((f, i) => (
        <span
          key={i}
          className="firework"
          style={{ left: `${f.left}%`, top: `${f.top}%` }}
        >
          {f.sparks.map((s, j) => (
            <span
              key={j}
              className="spark"
              style={{
                background: f.color,
                boxShadow: `0 0 10px 2px ${f.color}`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.dur}s`,
                ["--tx" as string]: `${s.tx}px`,
                ["--ty" as string]: `${s.ty}px`,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
