import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { startAssetPreload, usePreloaderStore } from '../../utils/assetPreloader';
import { BrandLogo } from './BrandLogo';

/**
 * Full-screen preloader curtain that blocks page reveal until all 3D GLB rigs,
 * WebGL textures, and initial sequence frames are loaded and normalized.
 */
export function PreloaderScreen() {
  const { progress, currentLabel, isReady, items } = usePreloaderStore();
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    void startAssetPreload();
  }, []);

  // Lock page scrolling while preloader is covering the viewport
  useEffect(() => {
    if (!isReady) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      const timer = window.setTimeout(() => setUnmounted(true), 650);
      return () => window.clearTimeout(timer);
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isReady]);

  if (unmounted) return null;

  return (
    <div
      aria-live="polite"
      aria-busy={!isReady}
      className={`fixed inset-0 z-[100] bg-[#030303] flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${
        isReady ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Subtle studio crimson backlight */}
      <div className="absolute w-80 h-80 rounded-full bg-[#FF0829]/15 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0E0D0C]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo className="h-7 sm:h-8 w-auto" />
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {String(progress).padStart(3, '0')}
            <span className="text-[#FF3852]">%</span>
          </span>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-[#F5F3F1]/90 font-medium">
          Estamos preparando cada detalhe do portfólio para você.
        </p>

        {/* GPU-composited progress bar */}
        <div className="mt-5 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full w-full bg-gradient-to-r from-[#FF0829] via-[#FF1E1E] to-white origin-left transition-transform duration-200 will-change-transform"
            style={{ transform: `scaleX(${Math.max(0.02, progress / 100)})` }}
          />
        </div>

        <p className="mt-3 font-mono text-[11px] tracking-wider text-[#B3ADA3] truncate">
          {currentLabel}
        </p>

        {/* Checklist of Studio Assets */}
        <ul className="mt-5 pt-4 border-t border-white/10 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between font-mono text-[11px]"
            >
              <span
                className={
                  item.status === 'ready' || item.status === 'fallback'
                    ? 'text-[#F5F3F1]'
                    : 'text-[#A39D93]'
                }
              >
                {item.label}
              </span>
              {item.status === 'ready' || item.status === 'fallback' ? (
                <span className="inline-flex items-center gap-1 text-[#FF3852]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Pronto</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#A39D93]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>
                    {item.status === 'loading' ? 'Preparando...' : 'Aguardando'}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
