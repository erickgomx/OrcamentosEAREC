import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Activity, Film, SlidersHorizontal } from 'lucide-react';
import { experienceState, navigateToProgress } from '../../hooks/useExperienceStore';
import {
  getScrollSequencePools,
  type SequencePool,
  usePreloaderStore,
} from '../../utils/assetPreloader';
import { SCROLL_SEQUENCE_COUNTS } from '../../utils/assetPaths';

function findNearestLoadedImage(
  pool: SequencePool,
  targetIdx: number
): HTMLImageElement | null {
  const clamped = Math.max(0, Math.min(pool.count - 1, targetIdx));
  if (pool.loadedFlags[clamped] === 1 && pool.images[clamped]) {
    return pool.images[clamped];
  }
  for (let offset = 1; offset < pool.count; offset++) {
    const right = clamped + offset;
    if (right < pool.count && pool.loadedFlags[right] === 1 && pool.images[right]) {
      return pool.images[right];
    }
    const left = clamped - offset;
    if (left >= 0 && pool.loadedFlags[left] === 1 && pool.images[left]) {
      return pool.images[left];
    }
  }
  return null;
}

function drawCanvasFallbackGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  label: string,
  progress: number
): void {
  ctx.fillStyle = '#090808';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#FF0829';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= width; x += 8) {
    const wave =
      Math.sin(x * 0.03 + progress * 18) * 18 +
      Math.cos(x * 0.015 - progress * 10) * 12;
    const y = height * 0.55 + wave;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#9D978D';
  ctx.font = '12px monospace';
  ctx.fillText(label, 14, 24);
}

/**
 * Act 3: Vertical sticky suite inside the natural scroll flow.
 * Scrubs all 172 Premiere Timeline frames + 79 Waveform + 96 RGB Parade frames
 * proportionally as the user scrolls down through #act-post.
 */
export function PostProductionScrubber() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const scope1CanvasRef = useRef<HTMLCanvasElement>(null);
  const scope2CanvasRef = useRef<HTMLCanvasElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const timelineWrapRef = useRef<HTMLDivElement>(null);
  const scope1WrapRef = useRef<HTMLDivElement>(null);
  const scope2WrapRef = useRef<HTMLDivElement>(null);

  const sharedPools = getScrollSequencePools();
  const timelinePoolRef = useRef<SequencePool>(sharedPools.timeline);
  const scope1PoolRef = useRef<SequencePool>(sharedPools.scope1);
  const scope2PoolRef = useRef<SequencePool>(sharedPools.scope2);

  const { isReady } = usePreloaderStore();

  useEffect(() => {
    let lastDrawnTimeline = -1;
    let lastDrawnScope1 = -1;
    let lastDrawnScope2 = -1;

    const drawPoolToCanvas = (
      canvas: HTMLCanvasElement | null,
      pool: SequencePool,
      frameIdx: number,
      fallbackLabel: string,
      localProgress: number
    ) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = findNearestLoadedImage(pool, frameIdx);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        drawCanvasFallbackGrid(
          ctx,
          canvas.width,
          canvas.height,
          fallbackLabel,
          localProgress
        );
      }
    };

    if (isReady) {
      drawPoolToCanvas(
        timelineCanvasRef.current,
        timelinePoolRef.current,
        0,
        'PREMIERE TIMELINE // BUFFERING',
        0
      );
      drawPoolToCanvas(
        scope1CanvasRef.current,
        scope1PoolRef.current,
        0,
        'LUMETRI WAVEFORM // IRE',
        0
      );
      drawPoolToCanvas(
        scope2CanvasRef.current,
        scope2PoolRef.current,
        0,
        'RGB PARADE // COLOR',
        0
      );
    }

    let cachedTop = 0;
    let cachedHeight = 1600;
    let cachedInnerHeight = window.innerHeight || 900;
    let cachedInnerWidth = window.innerWidth || 1280;

    const measureSection = () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      cachedTop = rect.top + window.scrollY;
      cachedHeight = rect.height;
      cachedInnerHeight = window.innerHeight || 900;
      cachedInnerWidth = window.innerWidth || 1280;
    };

    measureSection();
    const ro = new ResizeObserver(measureSection);
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener('resize', measureSection, { passive: true });

    const tick = (time: number) => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const rectTop = cachedTop - experienceState.scrollY;
      const rectBottom = rectTop + cachedHeight;
      const scrollableDistance = Math.max(1, cachedHeight - cachedInnerHeight);
      const localProgress = Math.max(
        0,
        Math.min(1, -rectTop / scrollableDistance)
      );

      if (playheadRef.current) {
        playheadRef.current.style.transform = `scaleX(${Math.max(0.01, localProgress)})`;
      }

      // Skip canvas draws and 3D transforms when section is far outside viewport
      if (rectBottom < -200 || rectTop > cachedInnerHeight + 200) {
        return;
      }

      // 3D floating choreography: Timeline centered, Scopes flying on left & right wings
      const isDesktop = !experienceState.isMobile && cachedInnerWidth >= 1024;
      const reduced = experienceState.reducedMotion;
      const mx = reduced ? 0 : experienceState.smoothedMouse.x;
      const my = reduced ? 0 : experienceState.smoothedMouse.y;
      const scrollTilt = (localProgress - 0.5) * 8;

      if (isDesktop) {
        const floatL = reduced ? 0 : Math.sin(time * 1.15) * 10;
        const floatR = reduced ? 0 : Math.sin(time * 1.15 + 1.9) * 10;
        const floatC = reduced ? 0 : Math.cos(time * 0.9) * 4;
        const rollL = reduced ? 0 : Math.cos(time * 0.85) * 1.8;
        const rollR = reduced ? 0 : Math.sin(time * 0.85 + 1.2) * 1.8;

        if (scope1WrapRef.current) {
          scope1WrapRef.current.style.transform = `translate3d(${(mx * -10).toFixed(1)}px, ${(floatL + my * -8).toFixed(1)}px, -24px) rotateY(${(22 + mx * 6 - scrollTilt * 0.4).toFixed(2)}deg) rotateX(${(4 - my * 5 + rollL).toFixed(2)}deg) rotateZ(${(-1.5 + rollL * 0.4).toFixed(2)}deg)`;
        }
        if (timelineWrapRef.current) {
          timelineWrapRef.current.style.transform = `translate3d(${(mx * 8).toFixed(1)}px, ${(floatC + my * 6).toFixed(1)}px, 36px) rotateY(${(mx * 4.5).toFixed(2)}deg) rotateX(${(-my * 3.5).toFixed(2)}deg)`;
        }
        if (scope2WrapRef.current) {
          scope2WrapRef.current.style.transform = `translate3d(${(mx * -10).toFixed(1)}px, ${(floatR + my * -8).toFixed(1)}px, -24px) rotateY(${(-22 + mx * 6 + scrollTilt * 0.4).toFixed(2)}deg) rotateX(${(-3 - my * 5 + rollR).toFixed(2)}deg) rotateZ(${(1.5 + rollR * 0.4).toFixed(2)}deg)`;
        }
      } else {
        if (scope1WrapRef.current) scope1WrapRef.current.style.transform = '';
        if (timelineWrapRef.current) timelineWrapRef.current.style.transform = '';
        if (scope2WrapRef.current) scope2WrapRef.current.style.transform = '';
      }

      const tlIdx = Math.min(
        SCROLL_SEQUENCE_COUNTS.timeline - 1,
        Math.floor(localProgress * (SCROLL_SEQUENCE_COUNTS.timeline - 1))
      );
      const s1Idx = Math.min(
        SCROLL_SEQUENCE_COUNTS.scope1 - 1,
        Math.floor(localProgress * (SCROLL_SEQUENCE_COUNTS.scope1 - 1))
      );
      const s2Idx = Math.min(
        SCROLL_SEQUENCE_COUNTS.scope2 - 1,
        Math.floor(localProgress * (SCROLL_SEQUENCE_COUNTS.scope2 - 1))
      );

      if (
        tlIdx !== lastDrawnTimeline ||
        timelinePoolRef.current.loadedFlags[tlIdx] === 1
      ) {
        drawPoolToCanvas(
          timelineCanvasRef.current,
          timelinePoolRef.current,
          tlIdx,
          'PREMIERE TIMELINE // BUFFERING',
          localProgress
        );
        lastDrawnTimeline = tlIdx;
      }

      if (s1Idx !== lastDrawnScope1 || scope1PoolRef.current.loadedFlags[s1Idx] === 1) {
        drawPoolToCanvas(
          scope1CanvasRef.current,
          scope1PoolRef.current,
          s1Idx,
          'LUMETRI WAVEFORM // IRE',
          localProgress
        );
        lastDrawnScope1 = s1Idx;
      }

      if (s2Idx !== lastDrawnScope2 || scope2PoolRef.current.loadedFlags[s2Idx] === 1) {
        drawPoolToCanvas(
          scope2CanvasRef.current,
          scope2PoolRef.current,
          s2Idx,
          'RGB PARADE // COLOR',
          localProgress
        );
        lastDrawnScope2 = s2Idx;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureSection);
      gsap.ticker.remove(tick);
    };
  }, [isReady]);

  const handleScrubBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const barRect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - barRect.left) / barRect.width)
      );
      const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = Math.max(1, sectionEl.offsetHeight - window.innerHeight);
      const docScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      navigateToProgress((sectionTop + ratio * scrollableDistance) / docScroll);
    },
    []
  );

  return (
    <section
      id="act-post"
      ref={sectionRef}
      aria-label="Engenharia de Pós-Produção e Color Grading"
      className="relative z-10 min-h-[175vh] px-4 sm:px-8 lg:px-10 py-12"
    >
      <div className="pointer-events-auto sticky top-16 sm:top-20 max-w-[90rem] mx-auto flex flex-col justify-center min-h-[calc(100svh-6rem)]">
        {/* Floating Header — No outer card or border */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#FF3852] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF0829] animate-rec-pulse" />
            <span>ATO 03 // O SEGREDO DO PADRÃO CINEMA</span>
          </div>
          <h2 className="type-title mt-2 text-white">
            Onde a imagem ganha vida, ritmo e assinatura visual
          </h2>
        </div>

        {/* 3D Spatial Stage: Left Scope (flying) + Center Timeline + Right Scope (flying) */}
        <div
          className="grid grid-cols-2 lg:grid-cols-12 items-center gap-4 lg:gap-5"
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        >
          {/* Left Flying Wing: Scope 1 (Luz & Profundidade) */}
          <div
            ref={scope1WrapRef}
            className="order-2 lg:order-1 col-span-1 lg:col-span-3 flex flex-col gap-2 will-change-transform"
          >
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#B3ADA3] px-1">
              <Activity className="w-3.5 h-3.5 text-[#FF0829]" />
              <span className="text-white/90 tracking-wider uppercase truncate">
                LUZ &amp; PROFUNDIDADE
              </span>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/10 bg-black/80">
              <canvas
                ref={scope1CanvasRef}
                width={560}
                height={315}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Center Hero: Premiere Timeline */}
          <div
            ref={timelineWrapRef}
            className="order-1 lg:order-2 col-span-2 lg:col-span-6 relative z-20 flex flex-col gap-2.5 will-change-transform"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-[#B3ADA3] px-1">
              <span className="inline-flex items-center gap-1.5 text-white tracking-wider uppercase">
                <Film className="w-3.5 h-3.5 text-[#FF0829]" />
                MONTAGEM &amp; RITMO
              </span>
              <span className="text-[10px] text-[#8A847A] tracking-widest uppercase">
                CORTE FINAL
              </span>
            </div>

            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl shadow-[0_32px_90px_rgba(0,0,0,0.92)] ring-1 ring-white/15 bg-black/90">
              <canvas
                ref={timelineCanvasRef}
                width={960}
                height={420}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              role="slider"
              aria-label="Linha do tempo da edição"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              tabIndex={0}
              onClick={handleScrubBarClick}
              className="relative h-2.5 w-full rounded-full bg-white/10 cursor-pointer overflow-hidden mt-0.5"
            >
              <div
                ref={playheadRef}
                className="h-full w-full bg-gradient-to-r from-[#FF0829] to-[#FF1E1E] origin-left will-change-transform"
                style={{ transform: 'scaleX(0.01)' }}
              />
            </div>
          </div>

          {/* Right Flying Wing: Scope 2 (Calibragem de Cor) */}
          <div
            ref={scope2WrapRef}
            className="order-3 col-span-1 lg:col-span-3 flex flex-col gap-2 will-change-transform"
          >
            <div className="flex items-center lg:justify-end gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#B3ADA3] px-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF0829]" />
              <span className="text-white/90 tracking-wider uppercase truncate">
                TRATAMENTO DE COR
              </span>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/10 bg-black/80">
              <canvas
                ref={scope2CanvasRef}
                width={560}
                height={315}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
