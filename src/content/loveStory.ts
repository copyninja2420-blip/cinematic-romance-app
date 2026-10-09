/**
 * ────────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING HERE  ❤
 *  Names, dates, photos, memories, letter, reasons, music.
 *  To add a photo: drop the file into `src/assets/` and import it
 *  at the top of this file, then use it as the `image` value.
 *  e.g.  import ourFirstDate from "@/assets/our-first-date.jpg";
 * ────────────────────────────────────────────────────────────────
 */
import memoryAway from "@/assets/music/a-memory-away.mp3";
import deserveLoved from "@/assets/music/deserve-to-be-loved.mp3";
import faithLove from "@/assets/music/faith-love-remix.mp3";
export const couple = {
  wifeName: "My Love",
  husbandName: "Yours Forever",
  birthday: "Happy Birthday",
};

/** Romantic background music */
export type Track = { src: string; url: string; title: string };

export const playlist: Track[] = [
  {
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    title: "A Gentle Love",
  },
  {
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    title: "Sweet Memories",
  },
  {
    src: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77c30.mp3",
    url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77c30.mp3",
    title: "Forever With You",
  },
];

/** kept for backwards compatibility */
export const music = playlist[0];

export const opening = {
  greeting: "Hey, My Love...",
  whisper: "I made something special for you ❤️",
};

export const birthdayCake = {
  title: "A Birthday Wish Just For You",
  subtitle: "Close your eyes, make your deepest wish...",
  blow: "Blow Out the Candle 🎂✨",
  cut: "Tap to cut the cake 🍰",
  wish: "Your wish is on its way to the stars...",
  message: "Happy Birthday, My Love! May every prayer of yours come true.",
  enter: "Enter Our World ❤️",
};

export const hero = {
  title: "Happy Birthday, My Love ❤️",
  line: "Today isn't just your birthday...\nIt's the day my favorite story began.",
};

export type StoryChapter = {
  label: string;
  date: string;
  caption: string;
  body: string;
  image?: string;
};

export const story: StoryChapter[] = [
  {
    label: "THE DAY WE MET",
    date: "[ ADD THE DATE ]",
    caption: "Where everything quietly began",
    body: "[ Write about the first time you saw each other ]",
    image: "/IMG-20260320-WA0015.jpg",
  },
  {
    label: "THE MOMENT I FELL FOR YOU",
    date: "[ ADD THE DATE ]",
    caption: "The second my heart decided",
    body: "[ Describe the small ordinary moment you realized she was the one ]",
    image: "/IMG-20251207-WA0004.jpg",
  },
  {
    label: "OUR FIRST SPECIAL MEMORY",
    date: "[ ADD THE DATE ]",
    caption: "The first day that became ours",
    body: "[ Write about your first date, first call, or first quiet laugh together ]",
    image: "/Snapchat-1616713582.jpg",
  },
  {
    label: "THE MOMENTS THAT MADE US",
    date: "[ ADD THE DATE ]",
    caption: "The days we keep replaying",
    body: "[ Our trips, our late-night talks, the songs we share ]",
    image: "/Snapchat-1872108738.jpg",
  },
  {
    label: "THE MEMORIES I WILL ALWAYS KEEP",
    date: "[ ADD THE DATE ]",
    caption: "Held safely in my heart",
    body: "[ The moments that made a home out of us ]",
    image: "/Snapchat-1625205945.jpg",
  },
  {
    label: "OUR FUTURE",
    date: "Today & always",
    caption: "Every chapter after this one",
    body: "[ Write about the life you dream of building together ]",
    image: "/IMG-20251207-WA0004.jpg",
  },
];

export type Memory = { caption: string; note: string; image?: string };

export const gallery: Memory[] = [
  { caption: "Your Smile ❤️", note: "My favorite sight", image: "/Snapchat-1872108738.jpg" },
  { caption: "My Favorite Memory", note: "Unforgettable", image: "/Snapchat-1625205945.jpg" },
  { caption: "Just Us", note: "Pure joy", image: "/IMG-20260320-WA0015.jpg" },
  { caption: "The Moment I Knew", note: "Right here", image: "/IMG-20251207-WA0004.jpg" },
  { caption: "One Of My Happiest Days", note: "With you", image: "/Snapchat-1616713582.jpg" },
  {
    caption: "Forever Doesn't Sound Long Enough.",
    note: "[ add photo ]",
    image: "/Snapchat-1872108738.jpg",
  },
];

export const letter = {
  button: "Open My Letter 💌",
  greeting: "Dear My Love,",
  body: `Finally the time came 💫💖✨

🎉 Wish you a many more happy returns of the day di thangamey...

Na iniki varaikum unna epudi pathukutean la ennaku thonala, but future la en kan kalanga varaikum unna pathupen... 🫂❤️

Be brave 🔥 Be strong 💪 You're a lucky chalm too me thangam 🍀🧿

Ok once again - happy birthday dii azhagu puzha... 🎂🧸`,
  signature: "Forever yours, SRIHARANNANTHINI ❤️",
};

export type ExtraSurprise = {
  kicker: string;
  title: string;
  button: string;
  text: string;
  hearts?: boolean;
};

export const extraSurprises: ExtraSurprise[] = [
  {
    kicker: "Hidden message",
    title: "One more thing I never said",
    button: "Unlock it 🔐",
    text: "Every single day I thank the universe that our paths crossed.",
  },
  {
    kicker: "Our little moment",
    title: "Press play in your heart",
    button: "Play the moment ▶️",
    text: "Close your eyes for five seconds... that feeling is my love for you.",
  },
  {
    kicker: "Heart shower",
    button: "Let it rain 💖",
    text: "Every heart falling on this screen is a wish I hold for your happiness.",
    hearts: true,
  },
];

export const surprise = {
  title: "WAIT...\nTHERE'S ONE MORE THING.",
  button: "UNLOCK THE SURPRISE ❤️",
  reveal: "You are my favorite person, my safest place, and my greatest blessing.",
};

export const proposalMilestone = {
  date: "2024-06-06T00:00:00",
  title: "Since That Special 'Yes' – June 6, 2024",
  subtitle: "The day my whole world found its meaning",
  caption: "Every single second with you is my favorite memory",
};

export const birthdayWish = {
  title: "Make A Birthday Wish",
  revealed: "May every single wish of yours come true, and may I get to stand by your side while they do.",
};

export const handHold = {
  title: "Hold My Hand",
  instruction: "Press and hold until our hearts sync...",
  revealed: "No matter what comes, you will never walk alone.",
};

export const openWhenLetters = [
  {
    title: "Open when you miss me",
    message: "Close your eyes and remember my arms around you. I am always closer than you think.",
  },
  {
    title: "Open when you feel stressed",
    message: "Breathe slowly, my love. You do not have to carry everything alone. I've got you.",
  },
  {
    title: "Open when you need a smile",
    message: "That beautiful smile is my favorite thing in the entire world. Wear it proudly today.",
  },
];

export const starMap = {
  title: "Written In The Stars",
  quote: "Out of billions of galaxies and infinite universes, we found each other.",
};

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
  question: "If I could choose again...",
  answer: "I would still choose you.",
  beats: ["Today.", "Tomorrow.", "And every lifetime."],
  closing: "HAPPY BIRTHDAY, MY LOVE ❤️\nI LOVE YOU ENDLESSLY.",
  button: "Forever & Always",
};

export const secret = {
  found: "Okay... you found my secret. ❤️",
  message: "I loved you yesterday, I love you today, and I will love you till the end of time.",
};

export const whatsappReaction = {
  phoneNumber: "919342073364",
  label: "Tell me your reaction 💬❤️",
  subtext: "Sends a direct message straight to my WhatsApp",
  message: "I just finished reading your surprise... and I love you so much ❤️🥺",
};
