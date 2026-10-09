import { useState } from "react";
import { Lock, Heart, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { opening } from "@/content/loveStory";

interface OpeningProps {
  onOpen: () => void;
}

export function Opening({ onOpen }: OpeningProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const correctCode = "1914";

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim() === correctCode) {
      setError(false);
      onOpen();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0107] text-[#fff0f5] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-rose-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center animate-pulse">
          <Heart className="w-8 h-8 text-rose-400 fill-rose-500/40" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif tracking-wide text-rose-100">
            {opening?.greeting || "Hey, My Love..."}
          </h1>
          <p className="text-sm text-rose-200/70">
            {opening?.whisper || "I made something special for you ❤️"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 pt-4">
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
                className={`w-full px-4 py-3 text-center tracking-[0.5em] text-lg rounded-xl bg-white/5 border ${
                  error ? "border-red-500/80 focus:ring-red-500" : "border-rose-300/20 focus:border-rose-400"
                } text-white placeholder:tracking-normal placeholder:text-sm placeholder:text-rose-200/30 focus:outline-none focus:ring-1 transition-all`}
              />
              <KeyRound className="absolute right-4 top-3.5 w-5 h-5 text-rose-300/40 pointer-events-none" />
            </div>

            {error && (
              <p className="text-xs text-red-400 animate-shake">
                Incorrect code. Try again ❤️
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Unlock Our Story
          </Button>
        </form>

        <p className="text-[0.75rem] text-rose-300/40 pt-4">
          Hint: A special 4-digit date 🔐
        </p>
      </div>
    </div>
  );
}

export default Opening;
