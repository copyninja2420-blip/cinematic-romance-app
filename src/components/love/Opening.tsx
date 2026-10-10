import { useState } from "react";
import { Atmosphere } from "./Atmosphere";
import { Fireworks } from "./Fireworks";

interface OpeningProps {
  onOpen: () => void;
}

export function Opening({ onOpen }: OpeningProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [stage, setStage] = useState<"passcode" | "invitation">("passcode");
  const [error, setError] = useState(false);
  const [bursting, setBursting] = useState(false);

  const correctCode = "1914";

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (!/^[0-9]?$/.test(char)) return;

    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(false);

    if (char && index < 3) {
      const nextInput = document.getElementById(`passcode-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`passcode-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleUnlock = () => {
    if (digits.join("") === correctCode) {
      setError(false);
      setStage("invitation");
    } else {
      setError(true);
    }
  };

  const handleEnterStory = () => {
    setBursting(true);
    window.setTimeout(onOpen, 700);
  };

  return (
    <div
      className={`relative min-h-screen bg-[#140209] text-[#fff0f5] flex flex-col items-center justify-center px-4 overflow-hidden select-none curtain ${
        bursting ? "curtain-burst" : ""
      }`}
    >
      {/* Floating Hearts & Sparks */}
      <Atmosphere particles={28} hearts={14} />
      <Fireworks bursts={6} sparks={14} />

      {/* Decorative Gold Circular Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full border border-amber-500/15 animate-pulse" />
        <div className="absolute w-[440px] h-[440px] md:w-[600px] md:h-[600px] rounded-full border border-amber-500/10" />
      </div>

      {stage === "passcode" ? (
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-amber-400/40" />
              <h1 className="font-serif italic text-2xl md:text-3xl tracking-wide text-amber-200/90 font-light">
                A Private Invitation
              </h1>
              <span className="w-8 h-[1px] bg-amber-400/40" />
            </div>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-rose-300/60">
              Enter the Passcode
            </p>
          </div>

          {/* 4 Gold-Bordered Digit Boxes */}
          <div className="flex items-center justify-center gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                id={`passcode-digit-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-18 text-center text-2xl font-serif rounded-lg bg-[#220410]/80 border ${
                  error
                    ? "border-red-500/80 text-red-200"
                    : "border-amber-400/30 text-amber-100 focus:border-amber-400"
                } shadow-inner focus:outline-none transition-all`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-400 animate-pulse">
              Incorrect passcode. Try again ❤️
            </p>
          )}

          {/* Monogram Seal Button */}
          <div className="pt-4 flex flex-col items-center">
            <button
              type="button"
              onClick={handleUnlock}
              className="group relative w-20 h-20 rounded-full border-2 border-amber-400/40 bg-gradient-to-b from-[#6b1531] to-[#3a0617] shadow-xl shadow-rose-950/60 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              <span className="font-serif italic text-2xl text-amber-200 group-hover:scale-110 transition-transform">
                S
              </span>
              <span className="text-[0.55rem] tracking-[0.2em] uppercase text-amber-300/80 mt-0.5">
                Unlock
              </span>
            </button>
          </div>

          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-rose-300/40 pt-4">
            For Your Eyes Only
          </p>
        </div>
      ) : (
        /* Invitation Step */
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-6 animate-fade-in">
          <div className="text-amber-300/80 text-xl font-serif">❦</div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-serif italic text-3xl md:text-4xl text-rose-100">
                Hey, My Love...
              </h1>
              <span className="text-rose-400 text-2xl">🤍</span>
            </div>
            <p className="font-serif italic text-lg text-rose-200/90">
              I made something special for you.
            </p>
            <p className="text-xs text-rose-300/60 italic">
              Because you deserve more than just a birthday wish.
            </p>
          </div>

          <div className="pt-6 w-full">
            <button
              type="button"
              onClick={handleEnterStory}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-white font-medium tracking-wide shadow-lg shadow-rose-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Enter Our Story ❤️
            </button>
          </div>

          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-rose-300/30 pt-4">
            Made Only For You
          </p>
        </div>
      )}
    </div>
  );
}

export default Opening;
              
