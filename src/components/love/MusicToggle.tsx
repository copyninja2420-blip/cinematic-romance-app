import { useEffect, useMemo, useRef, useState } from "react";
import { Music, Plus, SkipForward, Trash2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playlist as bundledPlaylist, type Track } from "@/content/loveStory";
import {
  addStoredTracks,
  listStoredTracks,
  removeStoredTrack,
  type StoredTrack,
} from "@/lib/musicLibrary";

type UserTrack = Track & { id: string };

export function MusicToggle({ autoplay = false }: { autoplay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [userTracks, setUserTracks] = useState<UserTrack[]>([]);
  const [manage, setManage] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const toUserTrack = (t: StoredTrack): UserTrack => ({
    id: t.id,
    title: t.title,
    src: URL.createObjectURL(t.blob),
    url: URL.createObjectURL(t.blob),
  });

  useEffect(() => {
    let revoked: string[] = [];
    listStoredTracks()
      .then((stored) => {
        if (!stored) return;
        const mapped = stored.map(toUserTrack);
        revoked = mapped.map((m) => m.src);
        setUserTracks(mapped);
      })
      .catch(() => undefined);

    return () => {
      revoked.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
  }, []);

  const playlist = useMemo<Track[]>(() => {
    return userTracks.length > 0 ? userTracks : bundledPlaylist;
  }, [userTracks]);

  const activeIndex = playlist.length > 0 ? Math.min(index, playlist.length - 1) : 0;
  const track = playlist[activeIndex];

  useEffect(() => {
    if (!audioRef.current || !autoplay) return;
    audioRef.current.volume = volume;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [autoplay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track?.src) return;
    el.load();
    if (playing) {
      el.play().catch(() => setPlaying(false));
    }
  }, [activeIndex, track?.src]);

  const advance = () => {
    if (playlist.length === 0) return;
    setIndex((i) => (i + 1) % playlist.length);
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = volume;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const next = () => {
    advance();
    const el = audioRef.current;
    if (el && playing) {
      setTimeout(() => {
        el.volume = volume;
        el.play().catch(() => setPlaying(false));
      }, 50);
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const audioFiles = Array.from(files).filter(
      (f) => f.type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a)$/i.test(f.name)
    );
    if (audioFiles.length === 0) return;
    try {
      const added = await addStoredTracks(audioFiles);
      setUserTracks((prev) => {
        const list = [...prev, ...added.map(toUserTrack)];
        if (prev.length === 0) setIndex(0);
        return list;
      });
    } catch {}
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = async (id: string) => {
    try {
      await removeStoredTrack(id);
      setUserTracks((prev) => {
        const list = prev.filter((t) => t.id !== id);
        setIndex(0);
        return list;
      });
    } catch {}
  };

  if (!track) return null;

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
      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />
      <div className="music-toggle flex flex-col gap-2 rounded-2xl border border-warm/20 bg-black/60 p-2.5 backdrop-blur-md shadow-xl text-warm">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause music" : "Play music"}
            variant="ghost"
            className="h-auto flex-1 justify-start gap-2 px-2 py-1 text-xs text-inherit hover:text-white"
          >
            {playing ? (
              <Music className="size-4 animate-pulse text-rose-glow" />
            ) : (
              <VolumeX className="size-4 opacity-70" />
            )}
            <span className="max-w-[7.5rem] truncate font-medium">
              {track.title || "Background Music"}
            </span>
          </Button>

          <Button
            type="button"
            onClick={next}
            aria-label="Next song"
            variant="ghost"
            size="icon"
            className="size-7 text-inherit opacity-70 hover:opacity-100"
          >
            <SkipForward className="size-4" />
          </Button>

          <Button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Add your own songs"
            variant="ghost"
            size="icon"
            className="size-7 text-inherit opacity-70 hover:opacity-100"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          aria-label="Music volume"
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-rose-500 opacity-60 hover:opacity-100"
        />

        {userTracks.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setManage((m) => !m)}
              className="px-1 text-left text-[0.65rem] opacity-60 underline hover:opacity-100"
            >
              {userTracks.length} custom song{userTracks.length > 1 ? "s" : ""}
            </button>
            {manage && (
              <ul className="max-h-40 overflow-y-auto text-xs space-y-1">
                {userTracks.map((t, i) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 px-1">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      className="flex-1 truncate text-left hover:text-rose-glow"
                    >
                      {t.title}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${t.title}`}
                      onClick={() => void remove(t.id)}
                      className="opacity-60 hover:opacity-100 hover:text-red-400"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default MusicToggle;
    
