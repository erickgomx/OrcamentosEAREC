import { useEffect, useRef, useState } from 'react';
import { startAssetPreload, usePreloaderStore } from '../../utils/assetPreloader';
import { BrandLogo } from './BrandLogo';

const MANIFESTO_PHRASES = [
  { lead: 'Cada frame conta uma', accent: 'história.' },
  { lead: 'Luz, ritmo e', accent: 'precisão.' },
  { lead: 'O olhar que eleva sua', accent: 'marca.' },
  { lead: 'Prepare-se para ver em', accent: 'outro nível.' },
] as const;

const PHRASE_INTERVAL_MS = 1550;
const PHRASE_EXIT_DURATION_MS = 420;

/**
 * Full-screen editorial cinema opening that displays animated manifesto phrases
 * and a smoothly interpolated progress bar while assets prepare, then slides up
 * like a theater curtain when ready.
 */
export function PreloaderScreen() {
  const { progress, isReady } = usePreloaderStore();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [prevPhraseIndex, setPrevPhraseIndex] = useState<number | null>(null);
  const [displayPct, setDisplayPct] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  const currentPhraseRef = useRef(0);
  const targetPctRef = useRef(0);
  const smoothedPctRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void startAssetPreload();
  }, []);

  useEffect(() => {
    targetPctRef.current = Math.max(targetPctRef.current, isReady ? 100 : progress);
  }, [progress, isReady]);

  // Cycle editorial manifesto phrases smoothly while loading
  useEffect(() => {
    if (isReady) return;

    const intervalId = window.setInterval(() => {
      const prevIdx = currentPhraseRef.current;
      const nextIdx = (prevIdx + 1) % MANIFESTO_PHRASES.length;
      currentPhraseRef.current = nextIdx;
      setPrevPhraseIndex(prevIdx);
      setPhraseIndex(nextIdx);
    }, PHRASE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isReady]);

  // Always clear exiting phrase after its exit animation even if isReady flips mid-transition
  useEffect(() => {
    if (prevPhraseIndex === null) return;
    const timer = window.setTimeout(
      () => setPrevPhraseIndex(null),
      PHRASE_EXIT_DURATION_MS
    );
    return () => window.clearTimeout(timer);
  }, [prevPhraseIndex]);

  // 60fps interpolated bar + tabular counter so progress never jumps or stalls visually
  useEffect(() => {
    if (unmounted) return;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const target = isReady ? 100 : Math.min(99, targetPctRef.current);
      const speed = isReady ? 16 : 6.5;
      const next =
        smoothedPctRef.current +
        (target - smoothedPctRef.current) * (1 - Math.exp(-speed * dt));
      smoothedPctRef.current =
        Math.abs(target - next) < 0.25 ? target : next;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0.015, smoothedPctRef.current / 100)})`;
      }

      const rounded = Math.min(100, Math.round(smoothedPctRef.current));
      setDisplayPct((prev) => (prev === rounded ? prev : rounded));

      if (!(isReady && smoothedPctRef.current >= 99.9)) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isReady, unmounted]);

  // Lock page scroll until assets are ready, then glide to 100% and raise curtain
  useEffect(() => {
    if (!isReady) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      };
    }

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    const exitTimer = window.setTimeout(() => setIsExiting(true), 160);
    const unmountTimer = window.setTimeout(() => setUnmounted(true), 940);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [isReady]);

  if (unmounted) return null;

  const activePhrase = MANIFESTO_PHRASES[phraseIndex];
  const exitingPhrase =
    prevPhraseIndex !== null ? MANIFESTO_PHRASES[prevPhraseIndex] : null;

  return (
    <div
      aria-live="polite"
      aria-busy={!isReady}
      className={`fixed inset-0 z-[100] preloader-curtain bg-[#030303] flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 sm:py-10 overflow-hidden ${
        isExiting ? 'is-exiting' : 'pointer-events-auto'
      }`}
    >
      {/* Subtle studio crimson backlight (radial gradient, zero GPU blur cost) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(255, 8, 41, 0.13) 0%, rgba(255, 8, 41, 0.03) 38%, transparent 68%)',
        }}
      />

      {/* Subtle crimson bottom hairline visible as the curtain rises */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF0829]/70 to-transparent pointer-events-none"
      />

      {/* Top Editorial Bar: BrandLogo + Studio Indicator */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
        <BrandLogo className="h-6 sm:h-8 w-auto" />
        <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#B3ADA3] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#FF0829] animate-rec-pulse" />
          <span>EA REC MÍDIA</span>
        </div>
      </div>

      {/* Center Stage: Manifesto Phrases with Simultaneous Exit & Entrance */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-4xl mx-auto w-full">
        <div className="relative w-full min-h-[9rem] sm:min-h-[11rem] flex items-center justify-center overflow-hidden px-2">
          {exitingPhrase && prevPhraseIndex !== null && (
            <p
              key={`exit-${prevPhraseIndex}`}
              aria-hidden="true"
              className="preloader-phrase-exit absolute inset-x-0 font-display font-bold text-center text-[clamp(1.75rem,1.05rem+3.2vw,3.75rem)] leading-[1.08] tracking-[-0.03em] text-white"
            >
              {exitingPhrase.lead}{' '}
              <span className="text-[#FF0829] drop-shadow-[0_0_24px_rgba(255,8,41,0.38)]">
                {exitingPhrase.accent}
              </span>
            </p>
          )}

          <p
            key={`enter-${phraseIndex}`}
            className="preloader-phrase-enter font-display font-bold text-center text-[clamp(1.75rem,1.05rem+3.2vw,3.75rem)] leading-[1.08] tracking-[-0.03em] text-white"
          >
            {activePhrase.lead}{' '}
            <span className="text-[#FF0829] drop-shadow-[0_0_24px_rgba(255,8,41,0.38)]">
              {activePhrase.accent}
            </span>
          </p>
        </div>
      </div>

      {/* Bottom Editorial Progress Bar + Tabular Percentage */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#9E988E] uppercase">
            {isReady ? 'TUDO PRONTO' : 'PREPARANDO EXPERIÊNCIA'}
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {String(displayPct).padStart(3, '0')}
            <span className="text-[#FF0829]">%</span>
          </span>
        </div>

        <div className="relative h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full bg-gradient-to-r from-[#B80018] via-[#FF0829] to-white origin-left will-change-transform"
            style={{ transform: 'scaleX(0.015)' }}
          />
        </div>
      </div>
    </div>
  );
}
