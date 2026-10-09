import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { story } from "@/content/loveStory";
import { SectionTitle } from "@/components/love/SectionTitle";

interface ChapterProps {
  index: number;
}

function Chapter({ index }: ChapterProps) {
  const [open, setOpen] = useState(index === 0);
  const chapter = story[index];

  if (!chapter) return null;

  return (
    <li className="relative pl-8 md:pl-10 pb-12 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left group"
        aria-expanded={open}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="inline-flex rounded-full border border-warm/20 px-3 py-1 text-xs text-warm/70">
              {chapter.date}
            </p>
            <h3 className="mt-2 font-display text-xl leading-tight text-white group-hover:text-rose-glow transition-colors">
              {chapter.label}
            </h3>
            <p className="script mt-1 text-base text-rose-glow/90">
              {chapter.caption}
            </p>
          </div>
          <ChevronDown
            className={`mt-1 size-4 shrink-0 text-warm/50 transition-transform duration-300 ${
              open ? "rotate-180 text-rose-glow" : ""
            }`}
          />
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ${
            open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-4 overflow-hidden rounded-2xl border border-warm/20 bg-black/40 shadow-inner">
              {chapter.image ? (
                <img
                  src={chapter.image}
                  alt={chapter.label}
                  loading="lazy"
                  className="w-full h-auto max-h-[420px] object-contain mx-auto rounded-xl"
                />
              ) : (
                <div className="py-12 text-center text-warm/40 text-sm">
                  [ photo of this moment ]
                </div>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-warm/80 whitespace-pre-line">
              {chapter.body}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
}

export function Timeline() {
  return (
    <section className="relative px-6 py-24">
      <SectionTitle kicker="Our Love Story" title="From the first moment..." />
      <ol className="relative mx-auto mt-12 max-w-md">
        <span className="timeline-spine" aria-hidden="true" />
        {story.map((c, i) => (
          <Chapter key={c.label} index={i} />
        ))}
      </ol>
    </section>
  );
}

export default Timeline;
