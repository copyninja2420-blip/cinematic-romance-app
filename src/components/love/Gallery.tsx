import { useState } from "react";
import { X } from "lucide-react";
import { gallery } from "@/content/loveStory";
import { useReveal } from "@/hooks/useReveal";
import { SectionTitle } from "./SectionTitle";

function Polaroid({ index, onOpen }: { index: number; onOpen: () => void }) {
  const item = gallery[index]!;
  const { ref, shown } = useReveal(0.2);
  const tilt = index % 2 === 0 ? -3 : 2.5;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onOpen}
      className={`polaroid reveal ${shown ? "reveal-in" : ""}`}
      style={{
        transitionDelay: `${index * 80}ms`,
        ["--tilt" as string]: `${tilt}deg`,
      }}
    >
      <div className="polaroid-photo">
        {item.image ? (
          <img
            src={item.image}
            alt={item.caption}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span className="text-[0.7rem] tracking-widest text-warm/40">{item.note}</span>
        )}
      </div>
      <p className="script mt-3 text-center text-lg text-ink">{item.caption}</p>
    </button>
  );
}

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const item = active === null ? null : gallery[active]!;

  return (
    <section className="relative px-6 py-24">
      <SectionTitle kicker="Memory Gallery" title="Little pieces of us" />

      <div className="mx-auto mt-14 grid max-w-md grid-cols-2 gap-5 [perspective:1100px]">
        {gallery.map((g, i) => (
          <Polaroid key={g.caption} index={i} onOpen={() => setActive(i)} />
        ))}
      </div>

      {item && (
        <div
          className="lightbox px-4 pb-6 pt-24"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute left-5 top-5 rounded-full border border-warm/20 p-2 text-warm/80"
            onClick={() => setActive(null)}
          >
            <X className="size-5" />
          </button>
          <div className="animate-scale-in px-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-frame">
              {item.image ? (
                <img src={item.image} alt={item.caption} className="size-full object-contain" />
              ) : (
                <span className="text-xs tracking-widest text-warm/40">{item.note}</span>
              )}
            </div>
            <p className="script mt-6 text-2xl text-gold-soft">{item.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
