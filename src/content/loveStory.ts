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
import photoUs1 from "@/assets/photos/Snapchat-1625205945-2.jpg.asset.json";
import photoUs2 from "@/assets/photos/Snapchat-1634327033-2.jpg.asset.json";
import photoUs3 from "@/assets/photos/file_0000000014fc71fa8c9a1eacdf6b924f-2.png.asset.json";
import photoUs4 from "@/assets/photos/Snapchat-1267333793-2.jpg.asset.json";
import photoUs5 from "@/assets/photos/Snapchat-1001237552.jpg.asset.json";

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
    image: photoUs1.url,
  },
  {
    label: "The Moment I Fell For You",
    date: "[ ADD THE DATE ]",
    caption: "The second my heart decided",
    body: "[ Describe the small ordinary moment when you knew she was the one. ]",
    image: photoUs4.url,
  },
  {
    label: "Our Favorite Memories",
    date: "[ ADD THE DATE ]",
    caption: "The days we keep replaying",
    body: "[ Our trips, our late-night talks, the songs, the rain, the silly fights and the sweeter making-ups. ]",
    image: photoUs5.url,
  },
  {
    label: "The Moments I Never Want To Forget",
    date: "[ ADD THE DATE ]",
    caption: "Held safely in my heart",
    body: "[ The moments that made a home out of us — write them here exactly as you remember them. ]",
    image: photoUs2.url,
  },
  {
    label: "Forever Starts With Us",
    date: "Today & always",
    caption: "Every chapter after this one",
    body: "[ Write about the life you dream of building with her. ]",
    image: photoUs3.url,
  },
];

export type Memory = { caption: string; note: string; image?: string };

export const gallery: Memory[] = [
  { caption: "Your Smile ❤️", note: "[ add photo ]", image: photoUs1.url },
  { caption: "My Favorite Memory", note: "[ add photo ]", image: photoUs5.url },
  { caption: "Us Together", note: "[ add photo ]", image: photoUs3.url },
  { caption: "The Moment I Knew", note: "[ add photo ]", image: photoUs4.url },
  { caption: "Forever With You", note: "[ add photo ]", image: photoUs2.url },
];

export const letter = {
  button: "Open My Letter 💌",
  greeting: "Dear My Love,",
  body: `Finally the time came 🫴💖✨

🎊 Wish you a many more happy returns of the day dii pondatii 🫂 Don't worry about anything chlm 🥰 I am always with you chlm ❤️‍🩹 Thaniya irruka nu nenachukatha — na eppavum unkooda tha irrukean, irrupean 💕 Athanala chamathu pullaya olunga saptu, olunga thoonganum 🪄 Yaaru ethu sonnalum kandukatha chlm 👣 Kavala padatha — pesuruvanga vaiyellam onna sendhu oru odaikurom 👍

Na iniki varaikum unna epudi pathukutean la ennaku thrl, ana unna after mrg ennala mudinja varaikum na unna vechu pathupean dii thanga maiyulu 💯 Unnaku sila yoosana varum — enga mrg ku apram Ivan maariruvan oh — un mela sathiyam ah, mrg after nu illa, eppavum mara matean pattu 💯

Be brave ❤️‍🔥 Be strong 💪 You're a lucky chalm too me dii pondatiii 🫀 Nee ethayum nenachu kavala padatha chlm — atha intha mama oda aasa 😘 Always keep smiling 😊

Ok once again — happy birthday dii azhagu puzha... 🎉 Love you soo much vairam ahh ummmmmmmmmaaaaaaaaaaaaaahhhhhhhhh 😘💋😘💋😘💋😘💋😘💋😘💋😘💋😘💋😘💋😘💋😘💋😘💋😘💋`,
  signature: "Forever yours, SRIHARANNANTHINI ❤️",
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
