import React, { useState, useEffect } from 'react';
import { CodesincBadge } from './CodesincBadge';

const OPERATIONAL_STEPS = [
  'Initiating central commissary batching telemetry...',
  'Calibrating thermal hot-holding units (>65°C FSSAI target)...',
  'Reconciling corporate client headcount & meal rosters...',
  'Synchronizing cold-chain inventory & buffer stock reserves...',
  'Dispatching automated daily prep sheets to kitchen stations...',
];

export const KitchenLoader = ({
  variant = 'fullscreen', // 'fullscreen', 'card', 'inline'
  label,
  progress,
  onComplete,
  showProgress = true,
  autoCompleteDuration = 1800, // ms for simulated completion
}) => {
  const [internalProgress, setInternalProgress] = useState(progress !== undefined ? progress : 0);
  const [stepIndex, setStepIndex] = useState(0);

  // If progress is not externally driven, simulate a natural progressive loading
  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress);
      return;
    }

    if (!autoCompleteDuration) return;

    const intervalTime = 40;
    const increment = 100 / (autoCompleteDuration / intervalTime);

    const timer = setInterval(() => {
      setInternalProgress((prev) => {
        const next = prev + increment + Math.random() * 2;
        if (next >= 100) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 200);
          }
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [progress, autoCompleteDuration, onComplete]);

  // Cycle operational text steps based on progress
  useEffect(() => {
    const idx = Math.min(
      OPERATIONAL_STEPS.length - 1,
      Math.floor((internalProgress / 100) * OPERATIONAL_STEPS.length)
    );
    setStepIndex(idx);
  }, [internalProgress]);

  // Cloche SVG Artwork
  const ClocheIllustration = ({ size = 96 }) => (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer Telemetry Timer Dial */}
      <svg
        className="absolute inset-0 w-full h-full animate-dial-rotate text-[#1b6c80]/20"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 6"
        />
        <circle cx="50" cy="4" r="1.8" fill="#1b6c80" />
        <circle cx="96" cy="50" r="1.8" fill="#1b6c80" />
        <circle cx="50" cy="96" r="1.8" fill="#1b6c80" />
        <circle cx="4" cy="50" r="1.8" fill="#1b6c80" />
      </svg>

      {/* Inner Counter-Rotating Precision Ring */}
      <svg
        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-dial-rotate-reverse text-[#1b6c80]/30"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 12"
        />
      </svg>

      {/* Simmer Glow Ambient Ring */}
      <div className="absolute inset-4 rounded-full bg-[#1b6c80]/10 filter blur-sm animate-simmer-glow" />

      {/* Rising Steam Vapor Trails */}
      <div className="absolute -top-3 w-14 h-8 pointer-events-none flex justify-center">
        {/* Steam curve Left */}
        <svg
          className="absolute left-2 w-3.5 h-6 text-[#1b6c80]/70 animate-steam-left"
          viewBox="0 0 16 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 30 C 4 24, 12 18, 6 12 C 2 8, 10 4, 8 1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        {/* Steam curve Center */}
        <svg
          className="absolute left-5 w-3.5 h-7 text-[#1b6c80]/85 animate-steam-center"
          viewBox="0 0 16 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 31 C 12 25, 4 19, 9 13 C 13 8, 5 3, 8 1"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        {/* Steam curve Right */}
        <svg
          className="absolute right-2 w-3.5 h-6 text-[#1b6c80]/70 animate-steam-right"
          viewBox="0 0 16 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 30 C 4 24, 12 18, 7 12 C 3 8, 11 4, 8 1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Culinary Cloche (Serving Dome) */}
      <div className="relative z-10 animate-cloche-float">
        <svg
          width="48"
          height="36"
          viewBox="0 0 48 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Knob Handle */}
          <path
            d="M24 3 C 22.5 3 22 4.5 22 5.5 C 22 6.5 23 7 24 7 C 25 7 26 6.5 26 5.5 C 26 4.5 25.5 3 24 3 Z"
            fill="#1b6c80"
          />
          <path d="M23.2 7 L24.8 7 L24.8 9 L23.2 9 Z" fill="#1b6c80" />

          {/* Domed Cloche Body */}
          <path
            d="M6 25 C 6 15 14 9 24 9 C 34 9 42 15 42 25 Z"
            fill="#ffffff"
            stroke="#1b6c80"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Metallic Lustre Highlight Curve */}
          <path
            d="M12 23 C 12 17.5 17 12.5 23 11.5"
            stroke="#1b6c80"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />

          {/* Cloche Base Tray Lip */}
          <rect
            x="4"
            y="25"
            width="40"
            height="3.5"
            rx="1.75"
            fill="#131416"
          />

          {/* Under-platter Rim Footing */}
          <line
            x1="8"
            y1="30.5"
            x2="40"
            y2="30.5"
            stroke="#1b6c80"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );

  // Compact Inline / Button Variant
  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 text-[12px] text-[#5d5f60]">
        <div className="relative w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 animate-spin text-[#1b6c80]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="14 14" />
          </svg>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1b6c80]" />
        </div>
        <span>{label || 'Processing batch...'}</span>
      </div>
    );
  }

  // Card / Embedded Container Variant
  if (variant === 'card') {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <ClocheIllustration size={80} />
        <div className="mt-4">
          <span className="font-semibold text-[#131416] text-[14px]">
            {label || 'Calculating Kitchen Projections'}
          </span>
          <p className="text-[12px] text-[#5d5f60] mt-1 font-mono">
            {OPERATIONAL_STEPS[stepIndex]}
          </p>
        </div>

        {showProgress && (
          <div className="w-48 mt-3">
            <div className="w-full bg-[#ebedee] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1b6c80] h-full transition-[width] duration-150 ease-out"
                style={{ width: `${Math.min(100, Math.round(internalProgress))}%` }}
              />
            </div>
            <div className="text-right text-[11px] font-mono text-[#737678] mt-1">
              {Math.min(100, Math.round(internalProgress))}%
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fullscreen / Splash Overlay Variant
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9fbfc] px-4 select-none"
    >
      <div className="flex flex-col items-center max-w-sm w-full text-center">
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded bg-[#1b6c80] text-white flex items-center justify-center font-bold text-[12px] tracking-wider">
            AF
          </div>
          <span className="text-[14px] font-bold text-[#131416] tracking-tight">
            ARAMYA FOODS
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ebedee] text-[#5d5f60]">
            ERP v2.6
          </span>
        </div>

        {/* Central Animated Illustration */}
        <div className="my-2">
          <ClocheIllustration size={108} />
        </div>

        {/* Status Headings */}
        <div className="mt-5 space-y-1">
          <h2 className="text-[15px] font-semibold text-[#131416] tracking-tight">
            {label || 'Corporate Catering & Commissary System'}
          </h2>
          <div className="h-9 flex items-center justify-center">
            <p className="text-[12px] text-[#5d5f60] max-w-xs transition-opacity duration-300 font-mono leading-tight">
              {OPERATIONAL_STEPS[stepIndex]}
            </p>
          </div>
        </div>

        {/* Progress Track */}
        {showProgress && (
          <div className="w-64 mt-3">
            <div className="w-full bg-[#e8eaec] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1b6c80] h-full transition-[width] duration-100 ease-out"
                style={{ width: `${Math.min(100, Math.round(internalProgress))}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono text-[#737678] mt-1.5">
              <span>Shift: Active Commissary</span>
              <span className="font-semibold text-[#131416]">
                {Math.min(100, Math.round(internalProgress))}%
              </span>
            </div>
          </div>
        )}

        {/* Facility Nodes Active Footer */}
        <div className="mt-7 flex items-center gap-2 text-[11px] text-[#737678]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e7b4f]" />
          <span>Central Commissary · Okhla Base Kitchen · Finishing Pantries</span>
        </div>

        {/* Codesinc Branding Attribution */}
        <div className="mt-5 pt-3 border-t border-[#e8eaec] w-full flex justify-center">
          <CodesincBadge />
        </div>
      </div>
    </div>
  );
};
