import { useMemo } from "react";

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/** Fireflies / glowing particles + softly floating hearts. Pure CSS motion. */
export function Atmosphere({
  particles = 34,
  hearts = 12,
}: {
  particles?: number;
  hearts?: number;
}) {
  const dust = useMemo(
    () =>
      Array.from({ length: particles }, (_, i) => ({
        left: rand(i + 1) * 100,
        top: rand(i + 21) * 100,
        size: 1.5 + rand(i + 41) * 3.5,
        dur: 6 + rand(i + 61) * 10,
        delay: rand(i + 81) * 8,
        drift: (rand(i + 101) - 0.5) * 60,
      })),
    [particles],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: hearts }, (_, i) => ({
        left: rand(i + 7) * 100,
        size: 10 + rand(i + 27) * 16,
        dur: 14 + rand(i + 47) * 16,
        delay: rand(i + 67) * 14,
        sway: (rand(i + 87) - 0.5) * 80,
      })),
    [hearts],
  );

  return (
    <div className="atmosphere" aria-hidden="true">
      {dust.map((d, i) => (
        <span
          key={`d${i}`}
          className="firefly"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
            ["--drift" as string]: `${d.drift}px`,
          }}
        />
      ))}
      {petals.map((p, i) => (
        <span
          key={`h${i}`}
          className="float-heart"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            ["--sway" as string]: `${p.sway}px`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}
