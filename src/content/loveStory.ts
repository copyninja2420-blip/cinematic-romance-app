/**
 * ────────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING HERE  ❤
 *  Names, dates, photos, memories, letter, reasons, music.
 *  To add a photo: drop the file into `src/assets/` and import it
 *  at the top of this file, then use it as the `image` value.
 *  e.g.  import ourFirstDate from "@/assets/our-first-date.jpg";
 * ────────────────────────────────────────────────────────────────
 */

import memoryAway from "@/assets/music/a-memory-away.mp3.asset.json";
import deserveLoved from "@/assets/music/deserve-to-be-loved.mp3.asset.json";
import faithLove from "@/assets/music/faith-love-remix.mp3.asset.json";
import photo1 from "@/assets/photos/photo-1.json";
import photo2 from "@/assets/photos/photo-2.json";
import photo3 from "@/assets/photos/photo-3.json";
import photo4 from "@/assets/photos/photo-4.json";
import photo5 from "@/assets/photos/photo-5.json";
import photo6 from "@/assets/photos/photo-6.json";

export const couple = {
  wifeName: "My Love", // ← her name
  husbandName: "Yours Forever", // ← your name
  birthday: "Happy Birthday", // ← e.g. "24 August"
};

/** Romantic background music 🎶
 *  These bundled instrumentals work immediately. Replace their `src` values with
 *  licensed Tamil song files whenever you are ready to personalize the playlist. */
export type Track = { src: string; title: string };

export const playlist: Track[] = [
  { src: deserveLoved.url, title: "Deserve to Be Loved" },
  { src: faithLove.url, title: "Faith — Love Remix" },
  { src: memoryAway.url, title: "A Memory Away" },
];

/** kept for backwards compatibility */
export const music = playlist[0] ?? { src: "", title: "" };


export const opening = {
  whisper: "I made something special for you…",
  button: "Open Your Surprise ❤️",
};

export const hero = {
  title: "Happy Birthday, My Love ❤️",
  line: "Today isn't just your birthday… it's the day the world became more beautiful because you were born.",
};

export type StoryChapter = {
  label: string;
  date: string;
  caption: string;
  body: string;
  image?: string; // optional imported photo
};

export const story: StoryChapter[] = [
  {
    label: "The Day We Met",
    date: "[ ADD THE DATE ]",
    caption: "Where everything quietly began",
    body: "[ Write about the first time you saw her — the place, what she wore, what you thought in that very first second. ]",
  },
  {
    label: "The Moment I Fell For You",
    date: "[ ADD THE DATE ]",
    caption: "The second my heart decided",
    body: "[ Describe the small ordinary moment when you knew she was the one. ]",
  },
  {
    label: "Our Favorite Memories",
    date: "[ ADD THE DATE ]",
    caption: "The days we keep replaying",
    body: "[ Our trips, our late-night talks, the songs, the rain, the silly fights and the sweeter making-ups. ]",
  },
  {
    label: "The Moments I Never Want To Forget",
    date: "[ ADD THE DATE ]",
    caption: "Held safely in my heart",
    body: "[ The moments that made a home out of us — write them here exactly as you remember them. ]",
  },
  {
    label: "Forever Starts With Us",
    date: "Today & always",
    caption: "Every chapter after this one",
    body: "[ Write about the life you dream of building with her. ]",
  },
];

export type Memory = { caption: string; note: string; image?: string };

export const gallery: Memory[] = [
  { caption: "Your Smile ❤️", note: "[ add photo ]" },
  { caption: "My Favorite Memory", note: "[ add photo ]" },
  { caption: "Us Together", note: "[ add photo ]" },
  { caption: "The Moment I Knew", note: "[ add photo ]" },
  { caption: "Forever With You", note: "[ add photo ]" },
];

export const letter = {
  button: "Open My Letter 💌",
  greeting: "Dear My Love,",
  body: "[PLACE MY PERSONAL LETTER HERE]",
  signature: "Forever yours ❤️",
};

export const surprise = {
  title: "I Have One More Surprise For You…",
  reveal:
    "You are my favorite person, my safest place, my happiest memory, and the person I want beside me for every chapter of my life. ❤️",
};

/** 10–20 reasons. Add, remove or rewrite freely. */
export const reasons: string[] = [
  "Your smile makes my day.",
  "You understand me without a word.",
  "You make ordinary moments special.",
  "I love the way you care.",
  "I simply love being with you.",
  "Your laugh is my favorite sound.",
  "You make our home feel like peace.",
  "You believe in me on the days I don't.",
  "The way you hold my hand.",
  "You are kind, even when it's hard.",
  "You remember the little things.",
  "Your eyes when you're happy.",
  "You make me want to be better.",
  "Every version of you.",
  "Forever still feels too short with you.",
];

export const finale = {
  question: "If I could choose again…",
  answer:
    "I would still choose you.\nToday. Tomorrow. And every lifetime after this. ❤️",
  closing: "Happy Birthday, My Wife.\nI Love You More Than Words Can Say. ❤️",
  button: "Forever & Always",
};
