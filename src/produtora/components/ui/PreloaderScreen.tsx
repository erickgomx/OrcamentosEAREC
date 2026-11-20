import { useEffect, useRef, useState } from 'react';
import { startAssetPreload, usePreloaderStore } from '../../utils/assetPreloader';
import { BrandLogo } from './BrandLogo';

const MANIFESTO_PHRASES = [
  { lead: 'Cada frame conta uma', accent: 'história' },
  { lead: 'Luz, ritmo e', accent: 'precisão' },
  { lead: 'O olhar que eleva sua', accent: 'marca' },
  { lead: 'Prepare-se para ver em', accent: 'outro nível' },
] as const;

const MIN_OPENING_MS = 7500;
const PHRASE_INTERVAL_MS = 2500;
const PHRASE_EXIT_DURATION_MS = 300;

/**
 * Full-screen pure-black editorial cinema opening displaying a minimum 3-phrase
 * manifesto cadence (2.5s each) synchronized with a precision bottom progress bar,
 * lifting like a clean theater curtain when ready.
 */
export function PreloaderScreen() {
  const { progress, isReady } = usePreloaderStore();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [prevPhraseIndex, setPrevPhraseIndex] = useState<number | null>(null);
  const [seenFourthPhrase, setSeenFourthPhrase] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  const mountTimeRef = useRef<number>(
    typeof performance !== 'undefined' ? performance.now() : Date.now()
  );
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

  // Guaranteed 3-phrase cadence (0ms -> 2500ms -> 5000ms), then 4th phrase only if still loading past 7800ms
  useEffect(() => {
    if (isReady) return;

    const timers: number[] = [];
    let overflowInterval = 0;

    const advanceTo = (nextIdx: number) => {
      const prevIdx = currentPhraseRef.current;
      if (prevIdx === nextIdx) return;
      currentPhraseRef.current = nextIdx;
      setPrevPhraseIndex(prevIdx);
      setPhraseIndex(nextIdx);
      if (nextIdx >= 3) {
        setSeenFourthPhrase(true);
      }
    };

    timers.push(window.setTimeout(() => advanceTo(1), PHRASE_INTERVAL_MS));
    timers.push(window.setTimeout(() => advanceTo(2), PHRASE_INTERVAL_MS * 2));
    timers.push(
      window.setTimeout(() => {
        advanceTo(3);
        overflowInterval = window.setInterval(() => {
          advanceTo((currentPhraseRef.current + 1) % MANIFESTO_PHRASES.length);
        }, PHRASE_INTERVAL_MS);
      }, MIN_OPENING_MS + 300)
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(overflowInterval);
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

  // 60fps interpolated bar synchronized cleanly to the 7.5s 3-phrase opening cadence
  useEffect(() => {
    if (unmounted) return;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const elapsedMs = now - mountTimeRef.current;
      const timeCapPct = (elapsedMs / MIN_OPENING_MS) * 99;
      const target = isReady
        ? 100
        : Math.min(99, targetPctRef.current, timeCapPct);

      const speed = isReady ? 18 : 8.5;
      const next =
        smoothedPctRef.current +
        (target - smoothedPctRef.current) * (1 - Math.exp(-speed * dt));
      smoothedPctRef.current =
        Math.abs(target - next) < 0.2 ? target : next;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0.01, smoothedPctRef.current / 100)})`;
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

  // Lock page scroll until assets & 3-phrase cadence finish, then glide to 100% and raise curtain
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

    const exitTimer = window.setTimeout(() => setIsExiting(true), 140);
    const unmountTimer = window.setTimeout(() => setUnmounted(true), 920);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [isReady]);

  if (unmounted) return null;

  const activePhrase = MANIFESTO_PHRASES[phraseIndex];
  const exitingPhrase =
    prevPhraseIndex !== null ? MANIFESTO_PHRASES[prevPhraseIndex] : null;
  const totalSteps = seenFourthPhrase ? 4 : 3;

  return (
    <div
      aria-live="polite"
      aria-busy={!isReady}
      className={`fixed inset-0 z-[100] preloader-curtain bg-[#030303] flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 sm:py-10 overflow-hidden ${
        isExiting ? 'is-exiting' : 'pointer-events-auto'
      }`}
    >
      {/* Ultra-subtle cinema viewfinder corner L-brackets */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 sm:inset-6 z-0">
        <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-white/15" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-white/15" />
        <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-white/15" />
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-white/15" />
      </div>

      {/* Subtle neutral bottom hairline along the rising curtain edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-white/15 pointer-events-none"
      />

      {/* Top Editorial Bar: Centered BrandLogo */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-center">
        <BrandLogo className="h-6 sm:h-7 w-auto" />
      </div>

      {/* Center Stage: Luxury Editorial Contrast Typography */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="mb-3 sm:mb-4 font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase tabular-nums">
          {String(phraseIndex + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </div>

        <div className="relative w-full min-h-[7rem] sm:min-h-[9rem] flex items-center justify-center overflow-hidden px-2">
          {exitingPhrase && prevPhraseIndex !== null && (
            <p
              key={`exit-${prevPhraseIndex}`}
              aria-hidden="true"
              className="preloader-phrase-exit absolute inset-x-2 font-display font-light text-center text-[clamp(1.65rem,1.05rem+3vw,3.5rem)] leading-[1.12] tracking-[-0.02em] text-white/60"
            >
              {exitingPhrase.lead}{' '}
              <span className="font-serif italic font-normal text-white">
                {exitingPhrase.accent}
              </span>
              <span className="text-[#FF0829]">.</span>
            </p>
          )}

          <p
            key={`enter-${phraseIndex}`}
            style={phraseIndex > 0 ? { animationDelay: '200ms' } : undefined}
            className="preloader-phrase-enter font-display font-light text-center text-[clamp(1.65rem,1.05rem+3vw,3.5rem)] leading-[1.12] tracking-[-0.02em] text-white/60"
          >
            {activePhrase.lead}{' '}
            <span className="font-serif italic font-normal text-white">
              {activePhrase.accent}
            </span>
            <span className="text-[#FF0829]">.</span>
          </p>
        </div>
      </div>

      {/* Bottom Precision Progress Bar + Step Dashes + Geometric Percentage */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div
            aria-label="Etapas da abertura"
            className="flex items-center gap-1.5"
          >
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const active = idx <= phraseIndex;
              const current = idx === phraseIndex;
              return (
                <span
                  key={idx}
                  className={`block h-[2px] rounded-full transition-all duration-300 ${
                    current
                      ? 'w-7 bg-[#F5F3F1]'
                      : active
                        ? 'w-4 bg-white/55'
                        : 'w-4 bg-white/15'
                  }`}
                />
              );
            })}
          </div>

          <span className="font-price text-lg sm:text-xl font-medium tracking-tight text-white/90 tabular-nums">
            {String(displayPct).padStart(3, '0')}%
          </span>
        </div>

        <div className="relative h-[2px] w-full rounded-full bg-white/10 overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full bg-[#F5F3F1] origin-left will-change-transform"
            style={{ transform: 'scaleX(0.01)' }}
          />
        </div>
      </div>
    </div>
  );
}
