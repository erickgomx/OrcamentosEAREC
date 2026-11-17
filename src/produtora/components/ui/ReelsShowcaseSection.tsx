import { useRef } from 'react';
import { Loader2, Maximize2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { PORTFOLIO_CASES } from '../../data/portfolioData';
import {
  scrollToReelIndex,
  setIsAudioMuted,
  setModalCase,
  useExperienceStore,
} from '../../hooks/useExperienceStore';

/**
 * Act 4: Scroll runway (460vh) driving the 3D Spiral Video Gallery in WebGL.
 * Uses a sticky HUD frame with open center space so each 3D video (16:9 or 9:16)
 * appears 1 by 1 front-and-center as the user scrolls down.
 */
export function ReelsShowcaseSection() {
  const {
    activeReelIndex,
    reelBuffering,
    isAudioMuted,
    hoveredCaseId,
  } = useExperienceStore();

  const currentCase =
    PORTFOLIO_CASES.find((c) => c.id === hoveredCaseId) ??
    PORTFOLIO_CASES[activeReelIndex] ??
    PORTFOLIO_CASES[0];

  const isCurrentLoading = Boolean(reelBuffering[currentCase.id]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleStageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768 || e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleStageTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768 || !touchStartRef.current || e.changedTouches.length === 0) {
      touchStartRef.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      scrollToReelIndex(dx < 0 ? activeReelIndex + 1 : activeReelIndex - 1);
    } else if (Math.hypot(dx, dy) < 10) {
      setModalCase(currentCase);
    }
  };

  return (
    <section
      id="act-gallery"
      aria-label="Galeria em Espiral 3D de Reels"
      className="relative z-10 pointer-events-none"
      style={{ minHeight: `${Math.max(220, PORTFOLIO_CASES.length * 92)}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-between py-20 sm:py-24 px-4 sm:px-8 lg:px-16 pointer-events-none">
        {/* Top Compact Section Header */}
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-[11px] tracking-[0.22em] text-[#FF3852] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATO 04 // PORTFÓLIO EM MOVIMENTO</span>
            </div>
            <h2 className="type-title mt-2 text-white">
              Filmes &amp; Produções
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            {isCurrentLoading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E0D0C]/85 border border-[#FF0829]/45 text-[#F5F3F1] backdrop-blur-md">
                <Loader2 className="w-3.5 h-3.5 text-[#FF0829] animate-spin" />
                <span>CARREGANDO VÍDEO...</span>
              </span>
            )}
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#0E0D0C]/80 border border-white/10 text-[#B3ADA3] backdrop-blur-md">
              REEL {String(activeReelIndex + 1).padStart(2, '0')} /{' '}
              {String(PORTFOLIO_CASES.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Center stays open for WebGL 3D Spiral; on mobile supports horizontal touch swipe & tap */}
        <div
          className="flex-1 pointer-events-auto md:pointer-events-none touch-pan-y"
          onTouchStart={handleStageTouchStart}
          onTouchEnd={handleStageTouchEnd}
        />

        {/* Bottom Docked Telemetry & Quick Controls */}
        <div className="max-w-5xl mx-auto w-full pointer-events-auto bg-[#0E0D0C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-[11px] tracking-widest text-[#FF0829] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF0829] animate-rec-pulse" />
              <span>{currentCase.code}</span>
              <span className="text-[#8A847A]">•</span>
              <span className="text-[#F5F3F1]">
                {currentCase.aspect === '16:9' ? '16:9 HORIZONTAL' : '9:16 VERTICAL'}
              </span>
            </div>
            <h3 className="mt-0.5 font-display text-base sm:text-xl font-bold text-white truncate">
              {currentCase.title}
            </h3>
            <p className="font-mono text-[11px] text-[#B3ADA3] truncate">
              {currentCase.cameraUsed} — {currentCase.colorProfile}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Step selectors 01..05 for each spiral video */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
              {PORTFOLIO_CASES.map((item, idx) => {
                const isActive = activeReelIndex === idx;
                const isBuffering = Boolean(reelBuffering[item.id]);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToReelIndex(idx)}
                    className={`relative px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-colors ${
                      isActive
                        ? 'bg-[#D6001C] text-white font-bold'
                        : 'text-[#B3ADA3] hover:text-white'
                    }`}
                  >
                    {String(item.id).padStart(2, '0')}
                    {isBuffering && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400"
                        title="Carregando vídeo"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              aria-label={isAudioMuted ? 'Ativar áudio da espiral' : 'Silenciar áudio'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#F5F3F1] hover:border-[#FF0829]/60 transition-colors"
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#B3ADA3]" />
                  <span className="hidden sm:inline">Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#FF0829]" />
                  <span className="hidden sm:inline">Som Ativo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setModalCase(currentCase)}
              className="rec-glow-surface inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D6001C] text-white text-xs font-mono font-semibold uppercase tracking-wider transition-transform duration-200 hover:scale-[1.03]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Tela Cheia</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
