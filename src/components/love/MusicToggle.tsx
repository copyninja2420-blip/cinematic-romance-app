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

export function MusicToggle({ autoplay }: { autoplay: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [userTracks, setUserTracks] = useState<UserTrack[]>([]);
  const [manage, setManage] = useState(false);

  const toUserTrack = (t: StoredTrack): UserTrack => ({
    id: t.id,
    title: t.title,
    src: URL.createObjectURL(t.blob),
  });

  useEffect(() => {
    let revoked: string[] = [];
    listStoredTracks()
      .then((stored) => {
        const mapped = stored.map(toUserTrack);
        revoked = mapped.map((m) => m.src);
        setUserTracks(mapped);
      })
      .catch(() => undefined);
    return () => revoked.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const playlist = useMemo<Track[]>(
    () => (userTracks.length > 0 ? userTracks : bundledPlaylist),
    [userTracks],
  );
  const track = playlist[Math.min(index, playlist.length - 1)];

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
    if (playing) el.play().catch(() => setPlaying(false));
  }, [index, track?.src]);

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

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const audioFiles = Array.from(files).filter(
      (f) => f.type.startsWith("audio/") || /\.(mp3|m4a|wav|ogg)$/i.test(f.name),
    );
    if (audioFiles.length === 0) return;
    const added = await addStoredTracks(audioFiles);
    setUserTracks((prev) => {
      const list = [...prev, ...added.map(toUserTrack)];
      if (prev.length === 0) setIndex(0);
      return list;
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = async (id: string) => {
    await removeStoredTrack(id);
    setUserTracks((prev) => {
      const list = prev.filter((t) => t.id !== id);
      setIndex(0);
      return list;
    });
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
      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />
      <div className="music-toggle flex flex-col gap-1">
        <div className="flex items-center gap-1">
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
            <span className="max-w-[7.5rem] truncate text-[0.7rem] tracking-wide">
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
          <Button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Add your own songs"
            variant="ghost"
            size="icon"
            className="size-7 text-inherit opacity-70 hover:bg-transparent hover:text-inherit hover:opacity-100"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {userTracks.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setManage((m) => !m)}
              className="px-1 text-left text-[0.6rem] uppercase tracking-[0.2em] opacity-60"
            >
              {userTracks.length} of your songs
            </button>
            {manage && (
              <ul className="max-h-40 overflow-y-auto pr-1">
                {userTracks.map((t, i) => (
                  <li key={t.id} className="flex items-center gap-1 py-0.5">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`flex-1 truncate text-left text-[0.65rem] ${i === index ? "opacity-100" : "opacity-60"}`}
                    >
                      {t.title}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${t.title}`}
                      onClick={() => void remove(t.id)}
                      className="opacity-60"
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
