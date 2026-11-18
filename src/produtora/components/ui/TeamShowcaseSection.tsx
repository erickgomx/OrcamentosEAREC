import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Users } from 'lucide-react';
import { TEAM_CHAPTERS } from '../../data/portfolioData';
import { experienceState } from '../../hooks/useExperienceStore';

interface ChapterWindow {
  enterStart: number;
  holdStart: number;
  holdEnd: number;
  exitEnd: number;
}

const CHAPTER_WINDOWS: ChapterWindow[] = [
  // 01 Ary: already visible as section pins, holds cleanly, exits around 0.20
  { enterStart: -0.05, holdStart: 0.03, holdEnd: 0.14, exitEnd: 0.21 },
  // 02 Erick: enters as Ary exits, holds in center, exits around 0.41
  { enterStart: 0.18, holdStart: 0.24, holdEnd: 0.35, exitEnd: 0.42 },
  // 03 Éricles: enters as Erick exits, holds in center, exits around 0.62
  { enterStart: 0.39, holdStart: 0.45, holdEnd: 0.56, exitEnd: 0.63 },
  // 04 Laiz: enters as Éricles exits, holds in center, exits around 0.83
  { enterStart: 0.60, holdStart: 0.66, holdEnd: 0.77, exitEnd: 0.84 },
  // 05 EA REC: enters as Laiz exits, stays visible to end of section
  { enterStart: 0.81, holdStart: 0.87, holdEnd: 1.05, exitEnd: 1.15 },
];

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

/**
 * Act 6: Scroll-choreographed Founders & Company Showcase.
 * 1. Ary (photo left, editorial photography copy right)
 * 2. Erick (exits Ary -> enters Erick on the opposite side: photo right, video copy left)
 * 3. Erick & Ary together (duo photo + EA REC Mídia company story)
 */
export function TeamShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const jumpToChapter = (idx: number) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const docTop = rect.top + window.scrollY;
    const scrollable = Math.max(1, sec.offsetHeight - window.innerHeight);
    const targetProgress = [0.08, 0.29, 0.50, 0.71, 0.92][idx] ?? 0.08;
    const targetY = docTop + targetProgress * scrollable;

    if (experienceState.scrollToY) {
      experienceState.scrollToY(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const updateChapters = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const rect = sec.getBoundingClientRect();
      const innerH = window.innerHeight || 900;
      if (rect.bottom < -200 || rect.top > innerH + 200) return;

      const scrollable = Math.max(1, rect.height - innerH);
      const p = clamp01(-rect.top / scrollable);

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(0.02, p)})`;
      }

      const nextIdx =
        p < 0.20 ? 0 : p < 0.41 ? 1 : p < 0.62 ? 2 : p < 0.83 ? 3 : 4;
      if (nextIdx !== activeIndexRef.current) {
        activeIndexRef.current = nextIdx;
        setActiveIndex(nextIdx);
      }

      const reduced = experienceState.reducedMotion;

      for (let i = 0; i < CHAPTER_WINDOWS.length; i++) {
        const el = chapterRefs.current[i];
        const photoEl = photoRefs.current[i];
        const textEl = textRefs.current[i];
        if (!el) continue;

        const w = CHAPTER_WINDOWS[i];
        const chapter = TEAM_CHAPTERS[i];
        const isCutout = chapter.id !== 'company';
        // Slide direction: Ary's photo slides from/to left (-1), Erick's from/to right (+1)
        const slideSign = chapter.imageSide === 'right' ? 1 : -1;

        let opacity = 0;
        let photoX = 0;
        let photoY = 0;
        let textX = 0;
        let textY = 0;
        let scale = 1;

        if (p >= w.enterStart && p <= w.exitEnd) {
          if (p < w.holdStart) {
            const t = easeOutCubic(
              clamp01((p - w.enterStart) / (w.holdStart - w.enterStart))
            );
            opacity = t;
            if (!reduced) {
              if (isCutout) {
                photoX = slideSign * (1 - t) * 72;
                textX = -slideSign * (1 - t) * 44;
              } else {
                photoY = (1 - t) * 32;
                textY = (1 - t) * 28;
              }
              scale = 0.96 + t * 0.04;
            }
          } else if (p <= w.holdEnd) {
            opacity = 1;
          } else {
            const t = easeInCubic(
              clamp01((p - w.holdEnd) / (w.exitEnd - w.holdEnd))
            );
            opacity = 1 - t;
            if (!reduced) {
              if (isCutout) {
                photoX = slideSign * t * 72;
                textX = -slideSign * t * 44;
              } else {
                photoY = -t * 32;
                textY = -t * 28;
              }
              scale = 1 - t * 0.04;
            }
          }
        }

        el.style.opacity = opacity.toFixed(3);
        el.style.pointerEvents = opacity > 0.45 ? 'auto' : 'none';
        el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';

        if (photoEl) {
          photoEl.style.transform = `translate3d(${photoX.toFixed(1)}px, ${photoY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        }
        if (textEl) {
          textEl.style.transform = `translate3d(${textX.toFixed(1)}px, ${textY.toFixed(1)}px, 0)`;
        }
      }
    };

    updateChapters();
    gsap.ticker.add(updateChapters);
    window.addEventListener('resize', updateChapters, { passive: true });

    return () => {
      gsap.ticker.remove(updateChapters);
      window.removeEventListener('resize', updateChapters);
    };
  }, []);

  return (
    <section
      id="act-team"
      ref={sectionRef}
      aria-label="Fundadores, equipe e a produtora EA REC"
      className="relative z-10 pointer-events-none min-h-[480vh] md:min-h-[540vh]"
    >
      <div className="sticky top-0 h-[100svh] flex flex-col justify-between pt-14 pb-3 sm:pt-14 sm:pb-5 px-4 sm:px-8 lg:px-16 overflow-hidden pointer-events-none">
        {/* Top Section Header (always visible inside sticky frame; no data-reveal rootMargin clipping) */}
        <div className="relative z-20 max-w-6xl mx-auto w-full flex items-end justify-between gap-2 sm:gap-4 shrink-0">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] text-[#FF3852] uppercase">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">ATO 06 // QUEM FAZ ACONTECER</span>
            </div>
            <h2 className="type-title mt-0.5 sm:mt-1.5 text-white text-xl sm:text-[clamp(1.6rem,1.1rem+2.2vw,2.75rem)]">
              Fundadores & Equipe
            </h2>
          </div>

          {/* Interactive Chapter Selector Pills */}
          <div className="pointer-events-auto inline-flex items-center gap-0.5 sm:gap-1 bg-[#0E0D0C]/85 backdrop-blur-md border border-white/10 rounded-xl p-1 font-mono text-[10px] sm:text-[11px]">
            {TEAM_CHAPTERS.map((ch, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg tracking-wider uppercase transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#D6001C] text-white font-bold shadow-[0_0_20px_rgba(255,8,41,0.35)]'
                      : 'text-[#B3ADA3] hover:text-white'
                  }`}
                >
                  {ch.indexLabel}{' '}
                  <span className="hidden md:inline">
                    {ch.id === 'company' ? 'EA REC' : ch.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Choreography Stage */}
        <div className="relative z-10 flex-1 min-h-0 w-full max-w-6xl mx-auto my-2 flex items-center justify-center">
          {TEAM_CHAPTERS.map((chapter, idx) => {
            const isRightPhoto = chapter.imageSide === 'right';
            const isCutout = chapter.id !== 'company';
            const isCenteredCompany = chapter.id === 'company';
            return (
              <div
                key={chapter.id}
                ref={(el) => {
                  chapterRefs.current[idx] = el;
                }}
                aria-hidden={activeIndex !== idx}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  visibility: idx === 0 ? 'visible' : 'hidden',
                }}
              >
                <div
                  className={
                    isCenteredCompany
                      ? 'w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-0 md:-mt-8 text-center'
                      : 'w-full grid grid-cols-1 md:grid-cols-12 items-center gap-0 sm:gap-6 md:gap-8 lg:gap-14'
                  }
                >
                  {/* Portrait Photo Column */}
                  <div
                    ref={(el) => {
                      photoRefs.current[idx] = el;
                    }}
                    className={
                      isCenteredCompany
                        ? 'flex justify-center will-change-transform'
                        : `md:col-span-5 flex justify-center will-change-transform ${
                            isRightPhoto ? 'md:order-2' : 'md:order-1'
                          }`
                    }
                  >
                    {isCutout ? (
                      <div className="relative -mt-6 sm:mt-0 flex items-end justify-center h-[42vh] min-h-[260px] sm:h-[48vh] md:h-[60vh] max-h-[560px] w-full max-w-[380px] mx-auto">
                        {/* Soft ambient cinema rim light behind frameless PNG cutout */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-8 inset-y-8 rounded-full bg-[#FF0829]/15 blur-3xl opacity-75 pointer-events-none"
                        />
                        <img
                          src={chapter.imageUrl}
                          alt={chapter.imageAlt}
                          width={853}
                          height={1280}
                          loading="eager"
                          decoding="async"
                          className="relative h-full w-auto max-w-none object-contain select-none drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)]"
                          style={{
                            transform: 'scale(1.08)',
                            transformOrigin: 'bottom center',
                            WebkitMaskImage:
                              'linear-gradient(to bottom, black 78%, transparent 100%)',
                            maskImage:
                              'linear-gradient(to bottom, black 78%, transparent 100%)',
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative group mx-auto flex justify-center">
                        {/* Subtle Red Rim Aura */}
                        <div
                          aria-hidden="true"
                          className="absolute -inset-3 rounded-3xl bg-[#FF0829]/15 blur-2xl opacity-75 pointer-events-none"
                        />

                        <div className="relative w-[215px] sm:w-[235px] md:w-[250px] h-[31vh] min-h-[205px] sm:h-[33vh] md:h-[34vh] max-h-[300px] mx-auto rounded-2xl overflow-hidden border border-white/15 bg-[#0E0D0C] shadow-[0_24px_70px_rgba(0,0,0,0.85)]">
                          <img
                            src={chapter.imageUrl}
                            alt={chapter.imageAlt}
                            width={853}
                            height={1280}
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-[#030303]/90 via-[#030303]/30 to-transparent"
                          />

                          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[9px] sm:text-[10px] tracking-[0.18em] text-[#F5F3F1] uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0829] animate-rec-pulse" />
                            <span>REC {chapter.indexLabel}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Editorial Text Column */}
                  <div
                    ref={(el) => {
                      textRefs.current[idx] = el;
                    }}
                    className={
                      isCenteredCompany
                        ? 'relative z-10 -mt-4 sm:-mt-5 flex flex-col items-center text-center will-change-transform w-full'
                        : `md:col-span-7 relative z-10 flex flex-col justify-center will-change-transform ${
                            isCutout ? '-mt-7 sm:mt-0' : ''
                          } ${
                            isRightPhoto
                              ? 'md:order-1 md:items-end md:text-right'
                              : 'md:order-2 md:items-start md:text-left'
                          }`
                    }
                  >
                    <div
                      className={`bg-[#0E0D0C]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full ${
                        isCenteredCompany
                          ? 'max-w-2xl p-3 sm:p-4 lg:p-5'
                          : 'max-w-xl p-3 sm:p-5 lg:p-6'
                      }`}
                    >
                      <p className="type-eyebrow text-[9px] sm:text-[11px] text-[#FF3852]">
                        {chapter.eyebrow}
                      </p>

                      <h3 className="mt-0.5 sm:mt-1.5 font-display text-lg sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                        {chapter.name}
                      </h3>

                      <p className="mt-0.5 sm:mt-1 font-mono text-[9.5px] sm:text-xs tracking-[0.1em] sm:tracking-[0.14em] text-[#F5F3F1]/85 uppercase">
                        {chapter.role}
                      </p>

                      <p className="mt-1.5 sm:mt-3 text-[11.5px] leading-snug sm:text-sm md:text-[15px] sm:leading-relaxed text-[#B3ADA3]">
                        {chapter.description}
                      </p>

                      <div
                        className={`mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 flex flex-wrap gap-1.5 sm:gap-2 ${
                          isCenteredCompany
                            ? 'justify-center'
                            : isRightPhoto
                              ? 'md:justify-end'
                              : 'md:justify-start'
                        }`}
                      >
                        {chapter.highlights.map((item) => (
                          <span
                            key={item}
                            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[9px] sm:text-[11px] tracking-wider text-[#F5F3F1] uppercase"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Progress Bar */}
        <div className="relative z-20 max-w-6xl mx-auto w-full flex items-center gap-3 sm:gap-4 shrink-0 pt-1">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#9E988E] uppercase shrink-0">
            CAPÍTULO {TEAM_CHAPTERS[activeIndex]?.indexLabel ?? '01'} /{' '}
            {String(TEAM_CHAPTERS.length).padStart(2, '0')}
          </span>
          <div className="relative flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="w-full h-full bg-gradient-to-r from-[#FF0829] via-[#FF1E1E] to-white origin-left will-change-transform"
              style={{ transform: 'scaleX(0.02)' }}
            />
          </div>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] text-[#9E988E] uppercase shrink-0">
            ROLE PARA AVANÇAR
          </span>
        </div>
      </div>
    </section>
  );
}
