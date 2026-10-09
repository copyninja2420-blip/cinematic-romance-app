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
  greeting: "Hey, My Love... ❤️",
  whisper: "I made something special for you.",
  second: "Because you deserve more than just a birthday wish.",
  button: "ENTER OUR STORY ❤️",
};

export const birthdayCake = {
  title: "A Birthday Wish Just For You",
  subtitle: "Close your eyes, make your deepest wish, and blow out the candle...",
  blow: "Blow Out the Candle 🎂✨",
  cut: "Tap to cut the cake 🍰",
  wish: "Your wish is on its way to the stars… ✨",
  message: "Happy Birthday, My Love! May every prayer of yours come true ❤️",
  enter: "Enter Our World ❤️",
};


export const hero = {
  title: "Happy Birthday, My Love ❤️",
  line: "Today isn't just your birthday...\nIt's the day someone incredibly special came into this world.",
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
    label: "THE DAY WE MET",
    date: "[ ADD THE DATE ]",
    caption: "Where everything quietly began",
    body: "[ Write about the first time you saw her — the place, what she wore, what you thought in that very first second. ]",
    image: "/IMG-20260320-WA0015.jpg",
    
  },
  {
    label: "THE MOMENT I FELL FOR YOU",
    date: "[ ADD THE DATE ]",
    caption: "The second my heart decided",
    body: "[ Describe the small ordinary moment when you knew she was the one. ]",
    image: "/IMG-20251207-WA0004.jpg",
    
  },
  {
    label: "OUR FIRST SPECIAL MEMORY",
    date: "[ ADD THE DATE ]",
    caption: "The first day that became ours",
    body: "[ Write about your first date, first call, first everything. ]",
    image: "/Snapchat-1616713582.jpg",
    
  },
  {
    label: "THE MOMENTS THAT MADE US",
    date: "[ ADD THE DATE ]",
    caption: "The days we keep replaying",
    body: "[ Our trips, our late-night talks, the songs, the rain, the silly fights and the sweeter making-ups. ]",
    image: "/Snapchat-1872108738.jpg",
    
  },
  {
    label: "THE MEMORIES I WILL ALWAYS KEEP",
    date: "[ ADD THE DATE ]",
    caption: "Held safely in my heart",
    body: "[ The moments that made a home out of us — write them here exactly as you remember them. ]",
    image: "/Snapchat-1625205945.jpg",
    
  },
  {
    label: "OUR FUTURE",
    date: "Today & always",
    caption: "Every chapter after this one",
    body: "[ Write about the life you dream of building with her. ]",
    image: "/IMG-20251207-WA0004.jpg",
    
  },
];


export type Memory = { caption: string; note: string; image?: string };

export const gallery: Memory[] = [
  { caption: "Your Smile ❤️", note: "[ add photo ]", image: photoUs1.url },
  { caption: "My Favorite Memory", note: "[ add photo ]", image: photoUs5.url },
  { caption: "Just Us", note: "[ add photo ]", image: photoUs3.url },
  { caption: "The Moment I Knew", note: "[ add photo ]", image: photoUs4.url },
  { caption: "One Of My Happiest Days", note: "[ add photo ]", image: photoUs2.url },
  {
    caption: "Forever Doesn't Sound Long Enough.",
    note: "[ add photo ]",
    image: photoUs1.url,
  },
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

export type ExtraSurprise = {
  kicker: string;
  title: string;
  button: string;
  text: string;
  hearts?: boolean;
};

/** Little hidden reveals that unlock after the letter is opened. */
export const extraSurprises: ExtraSurprise[] = [
  {
    kicker: "Hidden message",
    title: "One more thing I never said",
    button: "Unlock it 🔐",
    text: "Every single day I thank the universe for you. You are my luck, my calm, my home. En vazhkaiyoda azhagu nee tha dii. ❤️",
  },
  {
    kicker: "Our little moment",
    title: "Press play in your heart",
    button: "Play the moment ▶️",
    text: "Close your eyes for five seconds… that song, that rain, that laugh of yours. That moment is playing right now, and I am there with you. 🎬💫",
  },
  {
    kicker: "Heart shower",
    title: "All my love, all at once",
    button: "Let it rain 💖",
    text: "Every heart falling on this screen is one thing I love about you — and I ran out of screen, not reasons. 💕",
    hearts: true,
  },
];

export const surprise = {
  title: "WAIT…\nTHERE'S ONE MORE THING.",
  button: "UNLOCK THE SURPRISE ❤️",
  reveal:
    "You are my favorite person, my safest place, my happiest memory, and the person I want beside me for every chapter of my life. ❤️",
};

/** Proposal and interactive milestone copy. Edit these messages freely. */
export const proposalMilestone = {
  date: "2024-06-06T00:00:00",
  title: "Since That Special ‘Yes’ — June 6, 2024",
  subtitle: "The day my whole world found its meaning",
  caption: "Every single second with you is my favorite memory.",
};

export const birthdayWish = {
  title: "Make A Birthday Wish",
  revealed: "May every single wish of yours come true ❤️",
};

export const handHold = {
  title: "Hold My Hand",
  instruction: "Press and hold until our hearts meet.",
  revealed: "No matter what comes, you will never face it alone. My hand is yours, always. ❤️",
};

export const openWhenLetters = [
  {
    title: "Open when you miss me",
    message: "Close your eyes and remember my arms around you. Distance can never make my heart feel far from yours.",
  },
  {
    title: "Open when you feel stressed",
    message: "Breathe slowly, my love. You do not have to carry everything at once. Rest here with me for a little while.",
  },
  {
    title: "Open when you need a smile",
    message: "That beautiful smile is my favorite sight in this world. Imagine me doing something silly just to see it again. ❤️",
  },
];

export const starMap = {
  title: "Written In The Stars",
  quote: "Out of billions of galaxies and infinite stars, I found you.",
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
  answer: "I would still choose you.",
  beats: ["Today.", "Tomorrow.", "And every lifetime after this."],
  closing: "HAPPY BIRTHDAY, MY LOVE ❤️\nI LOVE YOU MORE THAN WORDS CAN EVER SAY.",
  button: "Forever & Always",
};

/** Hidden reveal: tap the glowing heart three times. */
export const secret = {
  found: "Okay… you found my secret. ❤️",
  message:
    "[ WRITE MY SECRET MESSAGE HERE — the one thing only she should ever read. ]",
};


// WhatsApp reaction button — replace with your number: country code + number, digits only (e.g. "919876543210")
export const whatsappReaction = {
  phoneNumber: "919342073364",
  label: "Tell me your reaction 💬❤️",
  subtext: "Sends a direct message straight to my WhatsApp",
  message:
    "I just finished reading your surprise... and I don't even have words. I love you so much! ❤️🥹",
};
