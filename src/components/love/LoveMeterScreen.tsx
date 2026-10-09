import React, { useState, useRef } from 'react';

interface LoveMeterScreenProps {
  onContinue: () => void;
}

export const LoveMeterScreen: React.FC<LoveMeterScreenProps> = ({ onContinue }) => {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = () => {
    if (scanComplete) return;
    setIsScanning(true);

    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds hold

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(35);
      }

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsScanning(false);
        setScanComplete(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 80, 160]);
        }
      }
    }, 40);
  };

  const cancelScan = () => {
    if (scanComplete) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsScanning(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen w-full bg-[#14030a] text-white flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden select-none">
      {/* Soft warm ambient bloom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-900/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center z-10 mt-2">
        <p className="text-[10px] uppercase tracking-widest text-amber-200/80 font-medium mb-1.5">
          Soul Synchronization
        </p>
        <h2 className="text-3xl font-serif italic text-rose-100 mb-2">The Love Scanner</h2>
        <p className="text-xs text-rose-200/75 font-serif max-w-xs mx-auto leading-relaxed">
          {scanComplete
            ? 'Two souls harmonized into absolute eternity.'
            : 'Press and hold below to synchronize our heartbeats...'}
        </p>
      </div>

      {/* Centerpiece: Glowing Heart Visualizer / Scanned Affinity Card */}
      <div className="flex flex-col items-center justify-center my-auto z-10 w-full max-w-sm">
        {!scanComplete ? (
          <div className="flex flex-col items-center animate-fade-in">
            {/* Concentric heart pulse rings */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border border-rose-400/25 transition-all duration-700 ${
                  isScanning ? 'scale-125 opacity-100 animate-ping' : 'scale-100 opacity-40'
                }`}
              />
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-b from-[#2e071a] via-[#1a030f] to-[#12020a] border border-amber-300/35 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.3)] transition-transform duration-300 ${
                  isScanning ? 'scale-105 shadow-[0_0_55px_rgba(244,63,94,0.7)]' : ''
                }`}
              >
                <span
                  className={`text-4xl filter drop-shadow-[0_0_14px_rgba(244,63,94,0.8)] transition-all duration-300 ${
                    isScanning ? 'animate-pulse scale-110' : 'opacity-90'
                  }`}
                >
                  {isScanning ? '💓' : '🤍'}
                </span>
              </div>
            </div>

            <p className="text-xs font-serif text-amber-200/80 mt-6 tracking-wide italic">
              {isScanning
                ? `Synchronizing Resonance... ${Math.round(progress)}%`
                : 'Touch & hold the scanner capsule below'}
            </p>
          </div>
        ) : (
          /* Scanned Affinity Result */
          <div className="w-full p-6 rounded-3xl bg-[#240816]/95 border border-rose-400/40 text-center shadow-[0_0_35px_rgba(244,63,94,0.35)] animate-fade-in">
            <span className="text-3xl mb-2 inline-block animate-pulse">💖</span>
            <p className="text-[10px] uppercase tracking-widest text-amber-200 font-semibold mb-1">
              Affinity Rating
            </p>
            <div className="text-4xl font-serif text-rose-300 font-bold mb-2">∞ %</div>
            <p className="text-xs uppercase tracking-wider text-rose-200/90 font-medium mb-3">
              Infinite & Unbreakable
            </p>
            <p className="text-xs font-serif italic text-rose-100/80 leading-relaxed border-t border-rose-500/20 pt-3">
              "Two souls linked across time. No math or meter could ever measure how deeply my heart beats for you."
            </p>
          </div>
        )}
      </div>

      {/* Romantic Capsule Scanner Button */}
      <div className="w-full max-w-sm z-10 mb-4 px-2">
        {!scanComplete ? (
          <div
            onMouseDown={startScan}
            onMouseUp={cancelScan}
            onTouchStart={startScan}
            onTouchEnd={cancelScan}
            className={`relative group w-full py-3.5 px-5 rounded-full cursor-pointer overflow-hidden transition-all duration-300 border active:scale-[0.98] ${
              isScanning
                ? 'bg-gradient-to-r from-[#40081d] via-[#610d30] to-[#40081d] border-rose-300/60 shadow-[0_0_35px_rgba(244,63,94,0.55)]'
                : 'bg-gradient-to-r from-[#1c040e] via-[#2d0718] to-[#1c040e] border-amber-300/40 shadow-[0_0_25px_rgba(0,0,0,0.6)]'
            }`}
          >
            {/* Progress Sweep */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-800/85 via-rose-600/85 to-amber-600/85 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />

            {/* Glowing sweep beam */}
            {isScanning && (
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-white blur-[2px] shadow-[0_0_14px_#fff] transition-all duration-75"
                style={{ left: `${progress}%` }}
              />
            )}

            {/* Capsule Content */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Circular Fingerprint Emblem */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black/60 to-rose-950/60 border border-amber-300/30 flex items-center justify-center shrink-0 shadow-inner">
                <svg
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isScanning ? 'text-rose-300 animate-pulse' : 'text-amber-200/85'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.67-.2-.13-.24-.04-.55.2-.68C7.82 2.5 9.87 2 12.01 2c2.13 0 3.99.47 5.93 1.5.24.13.33.43.2.68-.08.18-.23.29-.33.29zm3.01 4.09c-.19 0-.37-.11-.45-.29C19.1 5.67 15.82 4 12 4c-3.8 0-7.06 1.66-8.34 4.24-.12.24-.41.35-.66.23-.25-.12-.35-.42-.23-.67C4.19 4.96 7.78 3.1 12 3.1c4.2 0 7.76 1.84 9.17 4.67.13.25.02.55-.23.68-.04.07-.08.11-.13.11zm-1.13 4.38c-.22 0-.41-.16-.44-.38-.41-2.8-2.61-4.9-5.4-5.06-2.91-.17-5.52 1.83-6.19 4.69-.06.27-.32.44-.59.38-.27-.06-.44-.33-.38-.6.78-3.37 3.86-5.72 7.29-5.52 3.28.19 5.86 2.66 6.35 5.95.04.28-.15.53-.43.57-.08.01-.15.02-.21-.03zM12 22c-.28 0-.5-.22-.5-.5v-4.14c0-2.07 1.68-3.75 3.75-3.75s3.75 1.68 3.75 3.75c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-1.52-1.23-2.75-2.75-2.75s-2.75 1.23-2.75 2.75v4.14c0 .28-.22.5-.5.5zm-3.5 0c-.28 0-.5-.22-.5-.5v-6c0-3.31 2.69-6 6-6s6 2.69 6 6c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.76-2.24-5-5-5s-5 2.24-5 5v6c0 .28-.22.5-.5.5z" />
                </svg>
              </div>

              {/* Romantic Typography */}
              <div className="flex-1 px-4 text-left">
                <p className="text-[10px] tracking-widest uppercase text-amber-200 font-medium">
                  {isScanning ? 'Synchronizing Souls' : 'Heart Resonance'}
                </p>
                <p className="text-xs font-serif italic text-rose-100">
                  {isScanning ? `${Math.round(progress)}% harmonized` : 'Hold thumb to unite our hearts'}
                </p>
              </div>

              {/* Gentle heartbeat beacon */}
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping mr-2" />
            </div>
          </div>
        ) : (
          /* Transition Button to Story */
          <button
            onClick={onContinue}
            className="relative group w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#881337] via-[#e11d48] to-[#9f1239] text-amber-100 font-serif text-xs tracking-widest uppercase border border-amber-300/40 shadow-[0_0_35px_rgba(225,29,72,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
              <span>Enter Our World</span>
              <span className="text-sm text-rose-200">❤️</span>
              <span className="text-amber-200 text-sm">→</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
              
