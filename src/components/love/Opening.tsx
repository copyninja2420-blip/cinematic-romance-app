import { useEffect, useState } from "react";
import { Atmosphere } from "./Atmosphere";
import { Fireworks } from "./Fireworks";
import { Typewriter } from "./Typewriter";
import { Lock, Heart, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { opening } from "@/content/loveStory";

export function Opening({ onOpen }: { onOpen: () => void }) {
  const [bursting, setBursting] = useState(false);
  const [stage, setStage] = useState(0);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const correctCode = "1914";

  const greeting = opening?.greeting || "Hey, My Love...";
  const whisper = opening?.whisper || "I made something special for you ❤️";
  const second = (opening as Record<string, any>)?.second || "Every moment with you is magic ✨";

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage(1), 400);
    return () => window.clearTimeout(t1);
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim() === correctCode) {
      setError(false);
      setUnlocked(true);
      setStage(2);
    } else {
      setError(true);
    }
  };

  const handleProceed = () => {
    setBursting(true);
    window.setTimeout(onOpen, 700);
  };

  return (
    <div
      className={`curtain ${
        bursting ? "curtain-burst" : ""
      } min-h-screen relative overflow-hidden bg-[#0d0107] text-[#fff0f5] flex items-center justify-center text-center p-4`}
    >
      <Atmosphere particles={24} hearts={12} />
      <Fireworks bursts={6} sparks={16} />

      <div className="relative z-10 flex min-h-[65vh] w-full max-w-md flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center animate-pulse">
          <Heart className="w-8 h-8 text-rose-400 fill-rose-500/40" />
        </div>

        <p className="script animate-fade-in text-sm text-rose-300/70 tracking-widest uppercase">
          A surprise for you
        </p>

        <h1 className="romantic name-shimmer text-3xl md:text-5xl font-serif text-rose-100">
          {greeting}
        </h1>

        <div className="min-h-[3rem] px-2 max-w-sm">
          {stage >= 1 && (
            <Typewriter
              text={whisper}
              speed={30}
              onDone={() => undefined}
            />
          )}
        </div>

        {!unlocked ? (
          <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-4 pt-2">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={passcode}
                  onChange={(e) => {
                    setError(false);
                    setPasscode(e.target.value);
                  }}
                  placeholder="Enter 4-digit code"
                  className={`w-full px-4 py-3 text-center tracking-[0.5em] text-lg rounded-2xl bg-white/5 border ${
                    error
                      ? "border-red-500/80 focus:ring-red-500"
                      : "border-rose-300/20 focus:border-rose-400"
                  } text-white placeholder:tracking-normal placeholder:text-xs placeholder:text-rose-200/40 focus:outline-none focus:ring-1 backdrop-blur-sm transition-all`}
                />
                <KeyRound className="absolute right-4 top-3.5 w-5 h-5 text-rose-300/40 pointer-events-none" />
              </div>

              {error && (
                <p className="text-xs text-red-400">
                  Incorrect code. Try again ❤️
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:scale-[1.02] active:scale-[0.98] text-white font-medium shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Unlock Our Story
            </Button>

            <p className="text-[0.7rem] text-rose-300/40">
              Hint: A special 4-digit date 🔐
            </p>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in w-full max-w-xs pt-2">
            <div className="min-h-[2.5rem] px-2">
              <Typewriter
                text={second}
                speed={26}
                onDone={() => setStage(3)}
              />
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="btn-love-glow w-full py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium shadow-xl shadow-rose-950/60 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Step Inside ❤️</span>
            </button>
          </div>
        )}

        <p className="text-[0.65rem] uppercase tracking-widest text-rose-300/30 pt-4">
          Made only for you
        </p>
      </div>
    </div>
  );
}

export default Opening;
