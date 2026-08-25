import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { music } from "@/content/loveStory";

export function MusicToggle({ autoplay }: { autoplay: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!autoplay || !audioRef.current) return;
    audioRef.current.volume = 0.45;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [autoplay]);

  if (!music.src || !available) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = 0.45;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setAvailable(false));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={music.src}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
        className="music-toggle"
      >
        {playing ? (
          <Music className="size-4 animate-pulse-soft" />
        ) : (
          <VolumeX className="size-4" />
        )}
        <span className="sr-only">{music.title}</span>
      </button>
    </>
  );
}
