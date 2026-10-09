import React, { useState } from 'react';

interface FlamesScreenProps {
  onContinue: () => void;
}

export const FlamesScreen: React.FC<FlamesScreenProps> = ({ onContinue }) => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<{ char: string; title: string; quote: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateFlames = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setIsCalculating(true);
    setResult(null);

    // FLAMES algorithm
    let str1 = name1.toLowerCase().replace(/\s+/g, '');
    let str2 = name2.toLowerCase().replace(/\s+/g, '');

    for (let i = 0; i < str1.length; i++) {
      const char = str1[i];
      if (str2.includes(char)) {
        str1 = str1.replace(char, '');
        str2 = str2.replace(char, '');
        i--;
      }
    }

    const count = str1.length + str2.length;
    const flames = [
      { char: 'F', title: 'Friends Forever', quote: 'A bond woven into the fabric of time.' },
      { char: 'L', title: 'True Love', quote: 'An unbreakable resonance destined by fate.' },
      { char: 'A', title: 'Pure Affection', quote: 'A gentle, eternal warmth that guides every heartbeat.' },
      { char: 'M', title: 'Marriage & Eternity', quote: 'Two souls forever united under one sky.' },
      { char: 'E', title: 'Endless Longing', quote: 'Constantly drawn together across every distance.' },
      { char: 'S', title: 'Sweethearts', quote: 'Bound by laughter, whispers, and endless devotion.' },
    ];

    setTimeout(() => {
      let index = 0;
      if (count > 0) {
        let tempFlames = [...flames];
        let currIndex = 0;
        while (tempFlames.length > 1) {
          currIndex = (currIndex + count - 1) % tempFlames.length;
          tempFlames.splice(currIndex, 1);
        }
        setResult(tempFlames[0]);
      } else {
        // Perfect match fallback
        setResult(flames[1]);
      }
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#14030a] text-white flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden select-none">
      {/* Ambient background bloom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-900/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center z-10 mt-2">
        <p className="text-[10px] uppercase tracking-widest text-amber-200/80 font-medium mb-1.5">
          Childhood Destiny
        </p>
        <h2 className="text-3xl font-serif italic text-rose-100 mb-2">The FLAMES Oracle</h2>
        <p className="text-xs text-rose-200/75 font-serif max-w-xs mx-auto leading-relaxed">
          {result
            ? 'The stars have spoken our written fate.'
            : 'Enter our names to test the ancient secret written in our stars...'}
        </p>
      </div>

      {/* Center Stage: Name Inputs or Result */}
      <div className="flex flex-col items-center justify-center my-auto z-10 w-full max-w-sm">
        {!result ? (
          <form onSubmit={calculateFlames} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] uppercase tracking-widest text-amber-200/70 font-medium pl-1">
                Your Name
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Enter your name..."
                required
                className="w-full py-3 px-4 rounded-xl bg-black/40 border border-amber-300/30 text-rose-100 placeholder-rose-200/30 font-serif text-sm focus:outline-none focus:border-rose-400 focus:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] uppercase tracking-widest text-amber-200/70 font-medium pl-1">
                Her Name
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Enter her name..."
                required
                className="w-full py-3 px-4 rounded-xl bg-black/40 border border-amber-300/30 text-rose-100 placeholder-rose-200/30 font-serif text-sm focus:outline-none focus:border-rose-400 focus:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isCalculating || !name1.trim() || !name2.trim()}
              className="mt-3 relative group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#40081d] via-[#610d30] to-[#40081d] border border-amber-300/40 text-amber-100 font-serif text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(244,63,94,0.3)] active:scale-95 transition-all duration-300 disabled:opacity-40 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>{isCalculating ? 'Reading the Stars...' : 'Reveal Our Destiny'}</span>
                <span className="text-rose-300 text-sm">{isCalculating ? '✨' : '🔥'}</span>
              </span>
            </button>
          </form>
        ) : (
          /* Result Card */
          <div className="w-full p-6 rounded-3xl bg-[#240816]/95 border border-rose-400/40 text-center shadow-[0_0_35px_rgba(244,63,94,0.35)] animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose-950 to-black border border-amber-300/40 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(244,63,94,0.4)]">
              <span className="text-2xl font-serif font-bold text-amber-200">{result.char}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-amber-200 font-semibold mb-1">
              Destiny Confirmed
            </p>
            <div className="text-2xl font-serif text-rose-200 font-bold mb-2">{result.title}</div>
            <p className="text-xs font-serif italic text-rose-100/80 leading-relaxed border-t border-rose-500/20 pt-3">
              "{result.quote}"
            </p>
          </div>
        )}
      </div>

      {/* Action Button: Moves into the Love Story */}
      <div className="w-full max-w-sm z-10 mb-4 px-2">
        {result && (
          <button
            onClick={onContinue}
            className="relative group w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#881337] via-[#e11d48] to-[#9f1239] text-amber-100 font-serif text-xs tracking-widest uppercase border border-amber-300/40 shadow-[0_0_35px_rgba(225,29,72,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
              <span>Step Into Our Story</span>
              <span className="text-sm text-rose-200">❤️</span>
              <span className="text-amber-200 text-sm">→</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
                            
