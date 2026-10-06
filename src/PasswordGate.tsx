import { useEffect, useRef, useState, type ReactNode } from "react";
import { Atmosphere } from "@/components/love/Atmosphere";

const CORRECT_PASSWORD = "1914"; // change this

const DIGIT_COUNT = 4;

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(""));
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const tryUnlock = (code: string) => {
    if (code === CORRECT_PASSWORD) {
      sessionStorage.setItem("gate-unlocked", "true");
      setUnlocking(true);
      setTimeout(() => setUnlocked(true), 950);
    } else {
      setError(true);
      if (errorTimer.current) clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => {
        setDigits(Array(DIGIT_COUNT).fill(""));
        setError(false);
        inputsRef.current[0]?.focus();
      }, 1400);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigitAt(index, "");
      return;
    }
    // Support paste of the full code into any box
    if (value.length > 1) {
      const next = Array(DIGIT_COUNT).fill("");
      value
        .slice(0, DIGIT_COUNT)
        .split("")
        .forEach((ch, i) => (next[i] = ch));
      setDigits(next);
      const filled = next.join("");
      if (filled.length === DIGIT_COUNT && !next.includes("")) {
        inputsRef.current[DIGIT_COUNT - 1]?.blur();
        tryUnlock(filled);
      } else {
        inputsRef.current[Math.min(value.length, DIGIT_COUNT - 1)]?.focus();
      }
      return;
    }
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (index < DIGIT_COUNT - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (!next.includes("")) {
      inputsRef.current[index]?.blur();
      tryUnlock(next.join(""));
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigitAt(index - 1, "");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div
      className={
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-burgundy-deep p-6 select-none transition-all duration-700 " +
        (unlocking ? "scale-110 opacity-0" : "opacity-100")
      }
    >
      {/* Ambient crimson glow + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, oklch(0.3 0.11 15 / 85%) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle, transparent 42%, oklch(0 0 0 / 45%) 100%)",
        }}
      />

      {/* Floating fireflies & hearts */}
      <Atmosphere particles={18} hearts={6} />

      {/* Ornate corner arcs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 m-5 h-32 w-32 rounded-tl-[110px] border-t border-l border-gold-soft/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 m-5 h-32 w-32 rounded-br-[110px] border-r border-b border-gold-soft/15"
      />

      {/* Invitation content */}
      <div className="relative z-10 flex w-full max-w-[300px] flex-col items-center text-center">
        {/* Script flourish */}
        <div className="mb-3 flex flex-col items-center">
          <div className="mb-2 h-px w-16 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />
          <span className="script text-3xl text-gold-soft drop-shadow-[0_2px_6px_oklch(0_0_0/60%)]">
            A Private Invitation
          </span>
          <div className="mt-2 h-px w-16 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />
        </div>

        <h1 className="mb-10 font-display text-sm font-light tracking-[0.3em] text-warm/80 uppercase">
          Enter the passcode
        </h1>

        {/* Gilded digit boxes */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex gap-3.5"
          autoComplete="one-time-code"
        >
          {digits.map((digit, i) => {
            const filled = digit !== "";
            const active = !filled && digits.slice(0, i).every((d) => d !== "");
            return (
              <div
                key={i}
                className={
                  "flex h-18 w-13 items-center justify-center rounded-[3px] transition-all duration-300 " +
                  (error
                    ? "border border-rose-glow/70 bg-rose-glow/10 shadow-[0_0_14px_oklch(0.76_0.14_12/45%)]"
                    : filled
                      ? "border border-gold-soft/80 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_0_10px_oklch(0.84_0.1_84/22%),0_4px_18px_oklch(0_0_0/55%)]"
                      : active
                        ? "border-2 border-warm/85 bg-white/5 shadow-[0_0_14px_oklch(0.96_0.014_70/30%)]"
                        : "border border-gold-soft/40 bg-white/5 shadow-[0_4px_10px_oklch(0_0_0/35%)]")
                }
              >
                <input
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={DIGIT_COUNT}
                  value={digit}
                  autoFocus={i === 0}
                  aria-label={"Passcode digit " + (i + 1)}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e.key)}
                  onFocus={(e) => e.currentTarget.select()}
                  className="h-full w-full bg-transparent text-center font-display text-3xl font-light text-warm caret-transparent outline-none"
                />
              </div>
            );
          })}
        </form>

        {/* Error whisper */}
        <p
          className={
            "mt-6 font-display text-sm text-rose-glow/90 italic transition-opacity duration-500 " +
            (error ? "opacity-100" : "opacity-0")
          }
          role="alert"
        >
          Not quite — try again, my love.
        </p>

        {/* Wax seal unlock */}
        <button
          type="button"
          aria-label="Unlock"
          onClick={() => {
            const code = digits.join("");
            if (code.length === DIGIT_COUNT) tryUnlock(code);
            else {
              setError(true);
              if (errorTimer.current) clearTimeout(errorTimer.current);
              errorTimer.current = setTimeout(() => {
                setDigits(Array(DIGIT_COUNT).fill(""));
                setError(false);
                inputsRef.current[0]?.focus();
              }, 1400);
            }
          }}
          className="group relative mt-8 flex items-center justify-center outline-none"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-gold-soft opacity-10 blur-xl transition-opacity duration-700 group-active:opacity-30" />

          {/* The seal */}
          <div
            className={
              "relative flex h-26 w-26 flex-col items-center justify-center rounded-full border-[3px] transition-transform duration-300 group-active:scale-95 " +
              (error
                ? "scale-105 border-rose-glow"
                : "border-gold-soft group-hover:scale-105")
            }
            style={{
              background:
                "radial-gradient(circle at 32% 28%, oklch(0.45 0.14 14), oklch(0.28 0.11 16) 70%)",
              boxShadow:
                "inset 0 4px 14px oklch(1 0 0 / 10%), 0 10px 32px oklch(0 0 0 / 65%)",
            }}
          >
            <span
              className={
                "script relative text-5xl leading-none transition-all duration-500 " +
                (error
                  ? "scale-110 text-rose-soft drop-shadow-[0_0_12px_oklch(0.76_0.14_12/60%)]"
                  : "text-gold-soft drop-shadow-[0_0_10px_oklch(0.84_0.1_84/40%)]")
              }
            >
              ❤
            </span>
            <div className="relative my-1 h-px w-10 bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" />
            <span className="relative font-display text-[11px] font-bold tracking-[0.28em] text-warm uppercase">
              Unlock
            </span>
          </div>
        </button>

        {/* Footer whisper */}
        <p className="mt-10 font-display text-[10px] tracking-[0.35em] text-warm/35 uppercase">
          For your eyes only
        </p>
      </div>
    </div>
  );
}
