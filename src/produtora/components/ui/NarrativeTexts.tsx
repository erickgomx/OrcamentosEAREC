import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, Camera, ChevronDown } from 'lucide-react';
import { HARDWARE_RIGS } from '../../data/portfolioData';
import { navigateToSection } from '../../hooks/useExperienceStore';
import { usePreloaderStore } from '../../utils/assetPreloader';

/**
 * Acts 1 & 2 in natural downward scroll flow:
 * - Act 1 (#act-portal): Full-screen Portal REC opening hero
 * - Act 2 (#act-hardware): 3 sequential stations (#rig-sony, #rig-canon, #rig-dji)
 *   alternating sides on desktop so each preloaded 3D model has unobstructed screen space.
 */
export function NarrativeTexts() {
  const { isReady } = usePreloaderStore();
  const wasReadyOnMountRef = useRef(isReady);
  const [heroRevealed, setHeroRevealed] = useState(false);

  useEffect(() => {
    if (!isReady) {
      setHeroRevealed(false);
      return;
    }

    // Returning via SPA route (no preloader curtain): yield 2 frames so CSS enter transition plays cleanly
    if (wasReadyOnMountRef.current) {
      let raf1 = 0;
      let raf2 = 0;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setHeroRevealed(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    // Fresh load: wait until the rising curtain clears the upper hero band (~440ms) before triggering entrance
    const timer = window.setTimeout(() => setHeroRevealed(true), 440);
    return () => window.clearTimeout(timer);
  }, [isReady]);

  const heroRevealClass = heroRevealed ? 'is-revealed' : '';

  return (
    <div className="relative z-10">
      {/* ACT 1: PORTAL REC HERO
          Top area is reserved for the WebGL particle EA•REC logo. */}
      <section
        id="act-portal"
        aria-label="Abertura EA REC"
        className="relative min-h-[100svh] flex flex-col items-center justify-start px-5 sm:px-6 text-center pt-[30vh] md:pt-[35vh] pb-16"
      >
        <h1 className="type-hero text-white max-w-[15ch] sm:max-w-5xl">
          <span
            data-reveal="mask"
            style={{ '--reveal-delay': '60ms' } as CSSProperties}
            className={`block ${heroRevealClass}`}
          >
            IMAGEM DE CINEMA
          </span>
          <span
            data-reveal="mask"
            style={{ '--reveal-delay': '200ms' } as CSSProperties}
            className={`block text-[#FF0829] drop-shadow-[0_0_28px_rgba(255,8,41,0.4)] ${heroRevealClass}`}
          >
            PARA MARCAS E HISTÓRIAS
          </span>
        </h1>

        <p
          data-reveal
          style={{ '--reveal-delay': '360ms' } as CSSProperties}
          className={`type-lead mt-6 max-w-[38rem] ${heroRevealClass}`}
        >
          Filmes comerciais, fotografia editorial e imagens aéreas com drone. Elevamos o nível
          visual da sua empresa e eternizamos seus maiores momentos com acabamento de alto padrão.
        </p>

        <div
          data-reveal
          style={{ '--reveal-delay': '500ms' } as CSSProperties}
          className={`mt-10 sm:mt-12 flex flex-col items-center gap-3 ${heroRevealClass}`}
        >
          <div className="type-eyebrow inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0E0D0C]/90 border border-[#FF0829]/45 backdrop-blur-md shadow-[0_0_28px_rgba(255,8,41,0.22)] text-[0.72rem] sm:text-[0.8rem] font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-[#FF0829] animate-rec-pulse" />
            <span>Role para ver como trabalhamos</span>
          </div>
          <ChevronDown className="w-5 h-5 text-[#FF0829] animate-scroll-cue drop-shadow-[0_0_10px_rgba(255,8,41,0.65)]" />
        </div>
      </section>

      {/* ACT 2: 3 SEQUENTIAL HARDWARE STATIONS */}
      <section id="act-hardware" aria-label="Arsenal e Equipamentos 3D">
        {HARDWARE_RIGS.map((rig, idx) => {
          const isLeftModel = idx % 2 === 0;
          const nextAnchorId =
            HARDWARE_RIGS[idx + 1]?.sectionAnchorId ?? 'act-post';
          const nextLabel =
            HARDWARE_RIGS[idx + 1]?.name ?? 'Pós-Produção';

          return (
            <div
              key={rig.id}
              id={rig.sectionAnchorId}
              className="min-h-[96svh] flex items-end md:items-center py-12 sm:py-20 px-4 sm:px-8 lg:px-16"
            >
              <div className="max-w-7xl mx-auto w-full flex">
                <div
                  data-reveal={isLeftModel ? 'slide-left' : 'slide-right'}
                  className={`pointer-events-auto w-full md:w-[46%] lg:w-[40%] bg-[#0E0D0C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl ${
                    isLeftModel ? 'md:ml-auto' : 'md:mr-auto'
                  }`}
                >
                  <div
                    data-stagger
                    style={{ '--stagger-delay': '80ms' } as CSSProperties}
                    className="type-eyebrow flex items-center justify-between gap-3 text-[#FF3852]"
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <Camera className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{rig.pillar}</span>
                    </span>
                    <span className="text-[#9E988E] shrink-0">0{idx + 1} / 03</span>
                  </div>

                  <h2
                    data-stagger
                    style={{ '--stagger-delay': '160ms' } as CSSProperties}
                    className="type-title mt-3 text-white"
                  >
                    {rig.name}
                  </h2>

                  <p
                    data-stagger
                    style={{ '--stagger-delay': '240ms' } as CSSProperties}
                    className="mt-3 text-sm sm:text-[0.95rem] text-[#B3ADA3] leading-relaxed"
                  >
                    {rig.description}
                  </p>

                  <ul
                    data-stagger
                    style={{ '--stagger-delay': '320ms' } as CSSProperties}
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label="Especificações"
                  >
                    {rig.specs.map((spec) => (
                      <li
                        key={spec}
                        className="px-2.5 py-1.5 rounded-md bg-white/[0.06] border border-white/10 font-mono text-[11px] leading-none text-[#F5F3F1]"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>

                  <div
                    data-stagger
                    style={{ '--stagger-delay': '400ms' } as CSSProperties}
                    className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3"
                  >
                    <span className="type-eyebrow text-[#9E988E]">Explore em 3D • Arraste para girar</span>
                    <button
                      type="button"
                      onClick={() => navigateToSection(nextAnchorId)}
                      className="type-eyebrow inline-flex items-center gap-1.5 py-2 text-white hover:text-[#FF0829] transition-colors"
                    >
                      <span>{nextLabel}</span>
                      <ArrowDown className="w-3.5 h-3.5 text-[#FF0829]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
