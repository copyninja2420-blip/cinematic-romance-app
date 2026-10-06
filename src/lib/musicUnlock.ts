import { playlist } from "@/content/loveStory";

/** Called inside the unlock tap so mobile browsers allow playback. */
export function startMusicFromGesture() {
  if (typeof window === "undefined") return;
  try {
    const src = playlist[0]?.src;
    if (!src) return;
    const a = new Audio(src);
    a.volume = 0.35;
    a.muted = true;
    a.play().then(() => a.pause()).catch(() => {});
  } catch {
    /* ignore */
  }
}
