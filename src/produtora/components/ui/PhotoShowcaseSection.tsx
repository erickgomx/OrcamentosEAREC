import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  X,
} from 'lucide-react';
import {
  PHOTO_CATEGORIES,
  PORTFOLIO_PHOTOS,
  PhotoCategory,
  PhotoItem,
  buildWhatsAppBudgetUrl,
  navigateToBudgetCategories,
} from '../../data/portfolioData';
import {
  experienceState,
  refreshSectionAnchors,
} from '../../hooks/useExperienceStore';
import { usePreloaderStore } from '../../utils/assetPreloader';

type StreamEntry =
  | {
      kind: 'header';
      id: string;
      indexLabel: string;
      category: PhotoCategory;
      count: number;
    }
  | {
      kind: 'photo';
      id: string;
      photo: PhotoItem;
    };

interface CachedTrackItemMetrics {
  el: HTMLElement;
  center: number;
  lastU: number;
}

interface PhotoCardProps {
  photo: PhotoItem;
  isReady: boolean;
  onSelect: (photo: PhotoItem) => void;
  sizeMode?: 'ribbon' | 'grid';
}

function PhotoCard({
  photo,
  isReady,
  onSelect,
  sizeMode = 'ribbon',
}: PhotoCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isReady && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [isReady, photo.url]);

  const sizeClasses =
    sizeMode === 'ribbon'
      ? photo.orientation === 'landscape'
        ? 'h-[22vh] w-[33vh] min-h-[144px] min-w-[216px] max-h-[255px] max-w-[382px]'
        : 'h-[22vh] w-[14.67vh] min-h-[144px] min-w-[96px] max-h-[255px] max-w-[170px]'
      : photo.orientation === 'landscape'
        ? 'aspect-[3/2] w-full'
        : 'aspect-[2/3] w-full';

  return (
    <button
      type="button"
      onClick={() => onSelect(photo)}
      aria-label={`Ampliar foto ${photo.title}`}
      className={`group relative shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#0E0D0C] text-left shadow-[0_18px_45px_rgba(0,0,0,0.65)] transition-colors duration-300 hover:border-[#FF0829]/80 focus-visible:outline-none ${sizeClasses}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#141312] to-[#070707] animate-pulse">
          <ImageIcon className="w-5 h-5 text-[#736E65]" />
        </div>
      )}

      {isReady && (
        <img
          ref={imgRef}
          src={photo.url}
          alt={`${photo.category} — ${photo.title}`}
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <span className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/65 backdrop-blur-sm border border-white/15 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}

function CategorySequencePlaque({
  indexLabel,
  category,
  count,
}: {
  indexLabel: string;
  category: PhotoCategory;
  count: number;
}) {
  return (
    <div className="shrink-0 h-[22vh] min-h-[144px] max-h-[255px] w-44 sm:w-52 rounded-xl border border-[#FF0829]/35 bg-gradient-to-br from-[#140709]/95 via-[#0E0D0C]/95 to-[#050505]/95 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#FF0829] uppercase">
        <span>{indexLabel}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF0829] animate-rec-pulse" />
      </div>

      <div>
        <p className="font-mono text-[9px] tracking-[0.22em] text-[#8A847A] uppercase">
          SEQUÊNCIA
        </p>
        <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-white tracking-tight">
          {category}
        </h3>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-[#B3ADA3]">
        <span>{String(count).padStart(2, '0')} FOTOS</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#FF0829]" />
      </div>
    </div>
  );
}

/**
 * Act 5: 3D Perspective Photography Showcase.
 * Groups all 32 photos by category with an intro plaque before each sequence
 * (no category badge cluttering individual photos). Cards curve into focus
 * from 3D depth on entry and recede smoothly on exit as the user scrolls.
 */
export function PhotoShowcaseSection() {
  const { isReady } = usePreloaderStore();
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | PhotoCategory>(
    'Todas'
  );
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const wasDraggedRef = useRef(false);

  const handlePhotoSelect = (photo: PhotoItem) => {
    if (wasDraggedRef.current) return;
    setActivePhoto(photo);
  };

  // Build 2 category-grouped streams with Category Plaque placed BEFORE each sequence
  const { stream1, stream2 } = useMemo(() => {
    const buildStream = (cats: PhotoCategory[], startIdx: number): StreamEntry[] => {
      const entries: StreamEntry[] = [];
      cats.forEach((cat, offset) => {
        const photos = PORTFOLIO_PHOTOS.filter((p) => p.category === cat);
        if (photos.length === 0) return;
        entries.push({
          kind: 'header',
          id: `header-${cat}`,
          indexLabel: String(startIdx + offset + 1).padStart(2, '0'),
          category: cat,
          count: photos.length,
        });
        photos.forEach((photo) => {
          entries.push({
            kind: 'photo',
            id: photo.id,
            photo,
          });
        });
      });
      return entries;
    };

    const splitIndex = Math.ceil(PHOTO_CATEGORIES.length / 2);
    const topCats = PHOTO_CATEGORIES.slice(0, splitIndex);
    const botCats = PHOTO_CATEGORIES.slice(splitIndex);

    return {
      stream1: buildStream(topCats, 0),
      stream2: buildStream(botCats, topCats.length),
    };
  }, []);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'Todas') return PORTFOLIO_PHOTOS;
    return PORTFOLIO_PHOTOS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Recalculate global camera/scroll anchors when switching view mode
  useEffect(() => {
    requestAnimationFrame(() => {
      refreshSectionAnchors();
    });
  }, [selectedCategory]);

  // 3D Curved Perspective Entrance/Exit Motion driven by scroll via gsap.ticker
  useEffect(() => {
    if (selectedCategory !== 'Todas') return;

    let metrics1: CachedTrackItemMetrics[] = [];
    let metrics2: CachedTrackItemMetrics[] = [];
    let overflow1 = 0;
    let overflow2 = 0;
    let vpWidth = 1200;
    let cachedInnerHeight = window.innerHeight || 900;
    let cachedInnerWidth = window.innerWidth || 1200;
    let smoothedProgress = 0;
    let lastTargetProgress = -1;
    let lastVel = 0;
    let lastVelSkew1 = Number.NaN;
    let lastVelSkew2 = Number.NaN;
    let hasRenderedFrame = false;
    let touchOffsetProgress = 0;
    let touchVelProgress = 0;
    let isTouching = false;
    let isHorizontalSwipe: boolean | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;

    const measureTracks = () => {
      refreshSectionAnchors();
      const vpEl = viewportRef.current;
      cachedInnerHeight = window.innerHeight || 900;
      cachedInnerWidth = window.innerWidth || 1200;
      lastTargetProgress = -1;
      lastVelSkew1 = Number.NaN;
      lastVelSkew2 = Number.NaN;
      hasRenderedFrame = false;
      if (!vpEl) return;
      vpWidth = Math.max(1, vpEl.clientWidth);

      const collect = (trackEl: HTMLDivElement | null): CachedTrackItemMetrics[] => {
        if (!trackEl || trackEl.children.length === 0) return [];
        const firstLeft = (trackEl.firstElementChild as HTMLElement).offsetLeft;
        return Array.from(trackEl.children).map((child) => {
          const el = child as HTMLElement;
          return {
            el,
            center: el.offsetLeft - firstLeft + el.offsetWidth * 0.5,
            lastU: Number.NaN,
          };
        });
      };

      const getTrackLayoutWidth = (trackEl: HTMLDivElement | null): number => {
        if (!trackEl || trackEl.children.length === 0) return 0;
        const first = trackEl.firstElementChild as HTMLElement;
        const last = trackEl.lastElementChild as HTMLElement;
        const measured = Math.max(0, last.offsetLeft + last.offsetWidth - first.offsetLeft);
        return Math.max(measured, trackEl.scrollWidth);
      };

      metrics1 = collect(track1Ref.current);
      metrics2 = collect(track2Ref.current);
      const padX = cachedInnerWidth < 640 ? 32 : 64;
      const visibleWidth = Math.max(1, vpWidth - padX);
      overflow1 = Math.max(0, getTrackLayoutWidth(track1Ref.current) - visibleWidth);
      overflow2 = Math.max(0, getTrackLayoutWidth(track2Ref.current) - visibleWidth);
    };

    measureTracks();
    const rafId = requestAnimationFrame(measureTracks);
    const timer1 = window.setTimeout(measureTracks, 250);
    const timer2 = window.setTimeout(measureTracks, 900);
    const ro = new ResizeObserver(measureTracks);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (track1Ref.current) ro.observe(track1Ref.current);
    if (track2Ref.current) ro.observe(track2Ref.current);
    window.addEventListener('resize', measureTracks, { passive: true });

    const onTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768 || e.touches.length !== 1) return;
      const t = e.touches[0];
      isTouching = true;
      isHorizontalSwipe = null;
      startX = t.clientX;
      startY = t.clientY;
      lastX = t.clientX;
      touchVelProgress = 0;
      wasDraggedRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching || window.innerWidth >= 768 || e.touches.length !== 1) return;
      const t = e.touches[0];
      const totalDx = t.clientX - startX;
      const totalDy = t.clientY - startY;
      if (isHorizontalSwipe === null && Math.hypot(totalDx, totalDy) > 6) {
        isHorizontalSwipe = Math.abs(totalDx) > Math.abs(totalDy);
      }
      if (isHorizontalSwipe) {
        wasDraggedRef.current = true;
        const dx = t.clientX - lastX;
        const dragSpan = Math.max(700, overflow1 * 0.65);
        const deltaP = -dx / dragSpan;
        touchOffsetProgress += deltaP;
        touchVelProgress = deltaP;
      }
      lastX = t.clientX;
    };

    const onTouchEnd = () => {
      isTouching = false;
      isHorizontalSwipe = null;
    };

    const vpNode = viewportRef.current;
    if (vpNode) {
      vpNode.addEventListener('touchstart', onTouchStart, { passive: true });
      vpNode.addEventListener('touchmove', onTouchMove, { passive: true });
      vpNode.addEventListener('touchend', onTouchEnd, { passive: true });
      vpNode.addEventListener('touchcancel', onTouchEnd, { passive: true });
    }

    const apply3DCurve = (
      items: CachedTrackItemMetrics[],
      shiftX: number,
      velSkew: number,
      lastVelSkew: number,
      isCompact: boolean
    ) => {
      const vpCenter = vpWidth * 0.5;
      const halfSpan = Math.max(220, vpWidth * 0.56);
      const velChanged = Number.isNaN(lastVelSkew) || Math.abs(velSkew - lastVelSkew) >= 0.05;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const { el, center, lastU } = item;
        const screenCenter = center + shiftX;
        const u = Math.max(-1.35, Math.min(1.35, (screenCenter - vpCenter) / halfSpan));
        if (!Number.isNaN(lastU) && Math.abs(u - lastU) < 0.002 && (isCompact || !velChanged)) {
          continue;
        }
        item.lastU = u;
        const absU = Math.abs(u);

        // Keep mobile cards 100% flat-composited (no rotateY/positive Z) to avoid iOS Safari overflow-hidden 3D clipping
        if (isCompact) {
          const scale = 1.0 - Math.min(1, absU) * 0.06;
          const opacity = Math.max(0.55, Math.min(1, 1.15 - absU * 0.45));
          el.style.transform = `scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
        } else {
          const rotY = Math.max(-34, Math.min(34, -u * 26 + velSkew));
          const translateZ = (1 - Math.min(1, absU)) * 68 - absU * 155;
          const scale = 1.03 - Math.min(1, absU) * 0.17;
          const opacity = Math.max(0.08, Math.min(1, 1.18 - absU * 0.88));
          el.style.transform = `translate3d(0, 0, ${translateZ.toFixed(
            1
          )}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
        }
      }
    };

    const tick = () => {
      if (experienceState.sectionBounds.photos.height <= 0) {
        refreshSectionAnchors();
      }
      const bounds = experienceState.sectionBounds.photos;
      if (bounds.height <= 0) return;

      const innerH = experienceState.viewport.height || cachedInnerHeight;
      const innerW = experienceState.viewport.width || cachedInnerWidth;
      const vel = experienceState.smoothedVelocity;
      const rectTop = bounds.top - experienceState.scrollY;
      const rectBottom = rectTop + bounds.height;
      const scrollable = Math.max(1, bounds.height - innerH);

      if (rectBottom < -160 || rectTop > innerH + 160) {
        return;
      }

      if (overflow1 <= 0 || overflow2 <= 0 || metrics1.length === 0) {
        measureTracks();
      }

      const isCompact = innerW < 768;

      if (!isTouching && Math.abs(touchVelProgress) > 0.0001) {
        touchOffsetProgress += touchVelProgress;
        touchVelProgress *= 0.92;
      } else if (!isTouching) {
        touchVelProgress = 0;
      }

      const rawScrollProgress = Math.max(0, Math.min(1, -rectTop / scrollable));
      const scrollTargetProgress = Math.max(
        0,
        Math.min(1, (rawScrollProgress - 0.04) / 0.84)
      );
      const targetProgress = isCompact
        ? Math.max(0, Math.min(1, scrollTargetProgress + touchOffsetProgress))
        : scrollTargetProgress;
      if (isCompact) {
        touchOffsetProgress = targetProgress - scrollTargetProgress;
      }

      // Smoothly damp horizontal travel so fast mobile flicks glide cinematically
      const diff = targetProgress - smoothedProgress;
      const settled =
        Math.abs(diff) < 0.0002 &&
        Math.abs(targetProgress - lastTargetProgress) < 0.0001 &&
        Math.abs(vel - lastVel) < 0.05 &&
        Math.abs(touchVelProgress) < 0.0001;

      if (settled && hasRenderedFrame) {
        return;
      }

      const damping = isTouching && isHorizontalSwipe ? 0.42 : isCompact ? 0.22 : 0.16;
      smoothedProgress += diff * damping;
      if (Math.abs(diff) < 0.0004) smoothedProgress = targetProgress;
      lastTargetProgress = targetProgress;
      lastVel = vel;
      hasRenderedFrame = true;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(
          0.02,
          smoothedProgress
        )})`;
      }

      const velSkew = Math.max(
        -5.0,
        Math.min(5.0, vel * -0.07)
      );

      // Both streams advance from [Category Plaque -> Photos] in natural reading order
      // with distinct track lengths creating organic parallax speed differences
      const shift1 = -smoothedProgress * overflow1;
      const shift2 = -smoothedProgress * overflow2;

      if (track1Ref.current) {
        track1Ref.current.style.transform = isCompact
          ? `translateX(${shift1.toFixed(1)}px)`
          : `translate3d(${shift1.toFixed(1)}px, 0, 0)`;
        apply3DCurve(metrics1, shift1, velSkew, lastVelSkew1, isCompact);
        lastVelSkew1 = velSkew;
      }

      if (track2Ref.current) {
        track2Ref.current.style.transform = isCompact
          ? `translateX(${shift2.toFixed(1)}px)`
          : `translate3d(${shift2.toFixed(1)}px, 0, 0)`;
        const velSkew2 = velSkew * 0.8;
        apply3DCurve(metrics2, shift2, velSkew2, lastVelSkew2, isCompact);
        lastVelSkew2 = velSkew2;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      ro.disconnect();
      if (vpNode) {
        vpNode.removeEventListener('touchstart', onTouchStart);
        vpNode.removeEventListener('touchmove', onTouchMove);
        vpNode.removeEventListener('touchend', onTouchEnd);
        vpNode.removeEventListener('touchcancel', onTouchEnd);
      }
      window.removeEventListener('resize', measureTracks);
      gsap.ticker.remove(tick);
    };
  }, [selectedCategory, stream1.length, stream2.length, isReady]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!activePhoto) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
        if (idx >= 0) {
          setActivePhoto(filteredPhotos[(idx + 1) % filteredPhotos.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
        if (idx >= 0) {
          setActivePhoto(
            filteredPhotos[
              (idx - 1 + filteredPhotos.length) % filteredPhotos.length
            ]
          );
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [activePhoto, filteredPhotos]);

  const activePhotoIndex = activePhoto
    ? filteredPhotos.findIndex((p) => p.id === activePhoto.id)
    : -1;

  const stepPhoto = (delta: number) => {
    if (activePhotoIndex < 0 || filteredPhotos.length === 0) return;
    const nextIdx =
      (activePhotoIndex + delta + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIdx]);
  };

  return (
    <section
      id="act-photos"
      ref={sectionRef}
      aria-label="Galeria 3D de Fotografia Editorial EA REC"
      className={`relative z-10 pointer-events-none ${
        selectedCategory === 'Todas'
          ? 'min-h-[520vh] md:min-h-[520vh]'
          : 'min-h-[100svh] py-24'
      }`}
    >
      <div
        className={
          selectedCategory === 'Todas'
            ? 'sticky top-0 h-[100svh] flex flex-col justify-between pt-20 pb-5 sm:pt-24 sm:pb-6 overflow-hidden'
            : 'max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col gap-6'
        }
      >
        {/* Header + Category Filter Pills */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 pointer-events-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-[#FF0829] uppercase">
                <Camera className="w-3.5 h-3.5" />
                <span>ATO 05 // FOTOGRAFIA PROFISSIONAL</span>
              </div>
              <h2 className="type-title mt-1.5 text-white">
                Imagens que comunicam valor antes mesmo da primeira palavra
              </h2>
            </div>

            {selectedCategory === 'Todas' && (
              <div className="hidden md:flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#B3ADA3] uppercase">
                <span>Role para explorar as galerias</span>
                <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full w-full bg-[#FF0829] origin-left will-change-transform"
                    style={{ transform: 'scaleX(0.02)' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('Todas')}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-colors ${
                selectedCategory === 'Todas'
                  ? 'bg-[#D6001C] text-white font-semibold'
                  : 'bg-[#0E0D0C]/85 border border-white/10 text-[#B3ADA3] hover:text-white'
              }`}
            >
              Todas ({PORTFOLIO_PHOTOS.length})
            </button>
            {PHOTO_CATEGORIES.map((cat) => {
              const count = PORTFOLIO_PHOTOS.filter(
                (p) => p.category === cat
              ).length;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-colors ${
                    active
                      ? 'bg-[#D6001C] text-white font-semibold'
                      : 'bg-[#0E0D0C]/85 border border-white/10 text-[#B3ADA3] hover:text-white'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Mode A: Dual 3D Curved Perspective Streams with Leading Category Plaques */}
        {selectedCategory === 'Todas' ? (
          <div
            ref={viewportRef}
            className="flex-1 flex flex-col justify-center gap-4 sm:gap-6 min-h-0 overflow-hidden pointer-events-auto touch-pan-y px-4 sm:px-8 md:[perspective:1200px]"
          >
            <div
              ref={track1Ref}
              className="flex items-center gap-4 sm:gap-5 w-max md:will-change-transform"
            >
              {stream1.map((entry) =>
                entry.kind === 'header' ? (
                  <CategorySequencePlaque
                    key={entry.id}
                    indexLabel={entry.indexLabel}
                    category={entry.category}
                    count={entry.count}
                  />
                ) : (
                  <PhotoCard
                    key={entry.id}
                    photo={entry.photo}
                    isReady={isReady}
                    onSelect={handlePhotoSelect}
                  />
                )
              )}
            </div>

            <div
              ref={track2Ref}
              className="flex items-center gap-4 sm:gap-5 w-max md:will-change-transform"
            >
              {stream2.map((entry) =>
                entry.kind === 'header' ? (
                  <CategorySequencePlaque
                    key={entry.id}
                    indexLabel={entry.indexLabel}
                    category={entry.category}
                    count={entry.count}
                  />
                ) : (
                  <PhotoCard
                    key={entry.id}
                    photo={entry.photo}
                    isReady={isReady}
                    onSelect={handlePhotoSelect}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          /* Display Mode B: Focused Category Grid (Clean photos, no repeated category tags) */
          <div className="pointer-events-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isReady={isReady}
                onSelect={setActivePhoto}
                sizeMode="grid"
              />
            ))}
          </div>
        )}

        {selectedCategory === 'Todas' && (
          <div className="text-center font-mono text-[10px] tracking-[0.2em] text-[#8A847A] uppercase">
            Clique em qualquer fotografia para ampliar em alta resolução
          </div>
        )}
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizador de foto ${activePhoto.title}`}
          data-lenis-prevent
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 pointer-events-auto bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            aria-label="Fechar foto"
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-[#0E0D0C] border border-white/15 text-white hover:bg-[#FF0829] hover:border-[#FF0829] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stepPhoto(-1);
            }}
            aria-label="Foto anterior"
            className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#0E0D0C]/90 border border-white/15 text-white hover:border-[#FF0829] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stepPhoto(1);
            }}
            aria-label="Próxima foto"
            className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#0E0D0C]/90 border border-white/15 text-white hover:border-[#FF0829] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full flex flex-col items-center gap-4"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#050505] shadow-2xl">
              <img
                src={activePhoto.url}
                alt={`${activePhoto.category} — ${activePhoto.title}`}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="w-full max-w-2xl bg-[#0E0D0C]/90 border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[#FF0829] uppercase">
                  {activePhoto.category} //{' '}
                  {String(activePhotoIndex + 1).padStart(2, '0')} /{' '}
                  {String(filteredPhotos.length).padStart(2, '0')}
                </span>
                <p className="font-display text-sm sm:text-base font-bold text-white">
                  {activePhoto.title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepPhoto(-1)}
                  aria-label="Anterior"
                  className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepPhoto(1)}
                  aria-label="Próxima"
                  className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={buildWhatsAppBudgetUrl(
                    `Ensaio Fotográfico (${activePhoto.category})`
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePhoto(null);
                    navigateToBudgetCategories();
                  }}
                  className="rec-glow-surface inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D6001C] text-white font-mono text-xs font-semibold uppercase tracking-wider"
                >
                  <span>Orçar Cobertura</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
