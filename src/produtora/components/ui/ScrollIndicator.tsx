import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ACTS } from '../../data/portfolioData';
import {
  experienceState,
  navigateToSection,
  useExperienceStore,
} from '../../hooks/useExperienceStore';

function formatTimecode(progress: number): string {
  const totalFrames = Math.round(progress * 48 * 24);
  const frames = totalFrames % 24;
  const totalSeconds = Math.floor(totalFrames / 24);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}

export function ScrollIndicator() {
  const { activeSection } = useExperienceStore();
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const lastProgressRef = useRef<number>(-1);

  useEffect(() => {
    const updateHud = () => {
      const p = experienceState.scrollProgress;
      if (Math.abs(p - lastProgressRef.current) < 0.0002) return;
      lastProgressRef.current = p;

      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${Math.max(0.02, p)})`;
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`;
      }
      if (timecodeRef.current) {
        timecodeRef.current.textContent = formatTimecode(p);
      }
    };

    updateHud();
    gsap.ticker.add(updateHud);
    return () => {
      gsap.ticker.remove(updateHud);
    };
  }, []);

  return (
    <aside
      aria-label="Indicador de progresso cinematográfico"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-3 pointer-events-auto"
    >
      <div className="min-w-[82px] flex flex-col items-end bg-[#0E0D0C]/80 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1.5 font-mono">
        <span
          ref={timecodeRef}
          className="text-[11px] tracking-widest text-[#F5F3F1]"
        >
          00:00:00:00
        </span>
        <span
          ref={percentRef}
          className="text-[11px] font-bold text-[#FF3852] tracking-wider"
        >
          000%
        </span>
      </div>

      <div className="flex items-center gap-2.5 bg-[#0E0D0C]/75 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-3">
        <div className="hidden md:flex flex-col items-end gap-3 pr-1">
          {ACTS.map((act) => {
            const isActive = activeSection === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => navigateToSection(act.sectionId)}
                className={`text-[11px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#9E988E] hover:text-[#B3ADA3]'
                }`}
              >
                {act.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="relative w-1 h-36 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="w-full h-full bg-gradient-to-b from-[#FF0829] via-[#FF1E1E] to-white origin-top will-change-transform"
            style={{ transform: 'scaleY(0.02)' }}
          />
        </div>
      </div>
    </aside>
  );
}
