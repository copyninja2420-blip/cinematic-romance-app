import { useEffect, useRef, useState } from "react";
import { Music, SkipForward, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playlist } from "@/content/loveStory";

export function MusicToggle({ autoplay }: { autoplay: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const track = playlist[index];

  useEffect(() => {
    if (!autoplay || !audioRef.current) return;
    audioRef.current.volume = 0.4;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [autoplay]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.load();
    if (playing) {
      el.play().catch(() => setPlaying(false));
    }
  }, [index]);

  if (playlist.length === 0 || !track) return null;

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
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <div className="music-toggle flex items-center gap-2">
        <Button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          variant="ghost"
          className="h-auto flex-1 justify-start px-1 py-1 text-inherit hover:bg-transparent hover:text-inherit"
        >
          {playing ? (
            <Music className="size-4 animate-pulse-soft" />
          ) : (
            <VolumeX className="size-4" />
          )}
          <span className="max-w-[9rem] truncate text-[0.7rem] tracking-wide">
            {track.title}
          </span>
        </Button>
        <Button
          type="button"
          onClick={next}
          aria-label="Next song"
          variant="ghost"
          size="icon"
          className="size-7 text-inherit opacity-70 hover:bg-transparent hover:text-inherit hover:opacity-100"
        >
          <SkipForward className="size-4" />
        </Button>
      </div>
    </>
  );
}
