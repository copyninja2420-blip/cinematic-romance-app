import { useEffect, useRef, useState } from "react";
import { Music, SkipForward, VolumeX } from "lucide-react";
import { playlist } from "@/content/loveStory";

export function MusicToggle({ autoplay }: { autoplay: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<number[]>([]);

  const available = playlist.filter((_, i) => !failed.includes(i));
  const track = playlist[index];

  useEffect(() => {
    if (!autoplay || !audioRef.current) return;
    audioRef.current.volume = 0.4;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [autoplay]);

  if (playlist.length === 0 || available.length === 0 || !track) return null;

  const advance = () => setIndex((i) => (i + 1) % playlist.length);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = 0.4;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const next = () => {
    advance();
    const el = audioRef.current;
    if (el && playing) {
      window.setTimeout(() => {
        el.volume = 0.4;
        el.play().catch(() => setPlaying(false));
      }, 0);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        onEnded={next}
        onError={() => {
          setFailed((f) => (f.includes(index) ? f : [...f, index]));
          advance();
        }}
      />
      <div className="music-toggle flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="flex items-center gap-2"
        >
          {playing ? (
            <Music className="size-4 animate-pulse-soft" />
          ) : (
            <VolumeX className="size-4" />
          )}
          <span className="max-w-[9rem] truncate text-[0.7rem] tracking-wide">
            {track.title}
          </span>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next song"
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          <SkipForward className="size-4" />
        </button>
      </div>
    </>
  );
}
