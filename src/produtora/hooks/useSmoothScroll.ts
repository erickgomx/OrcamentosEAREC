import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {
  experienceState,
  refreshSectionAnchors,
  setMousePosition,
  setPointerActive,
  setViewportFlags,
  updateScrollMetrics,
  useExperienceStore,
} from './useExperienceStore';
import { usePreloaderStore } from '../utils/assetPreloader';

/**
 * Canonical Lenis + GSAP ticker single-loop synchronization.
 * Keeps DOM section anchor waypoints synchronized with layout changes.
 */
export function useSmoothScroll(): void {
  const { modalCase } = useExperienceStore();
  const { isReady } = usePreloaderStore();

  useEffect(() => {
    const mediaMobile = window.matchMedia('(max-width: 767px)');
    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncFlags = () => {
      setViewportFlags(mediaMobile.matches, mediaMotion.matches);
    };
    syncFlags();

    mediaMobile.addEventListener('change', syncFlags);
    mediaMotion.addEventListener('change', syncFlags);

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    const handleNativeScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      updateScrollMetrics(window.scrollY, progress, 0);
    };

    if (!mediaMotion.matches) {
      lenis = new Lenis({
        lerp: 0.065,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.35,
      });

      lenis.on('scroll', (e: { scroll: number; progress: number; velocity: number }) => {
        updateScrollMetrics(e.scroll ?? window.scrollY, e.progress ?? 0, e.velocity ?? 0);
      });

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);

      experienceState.scrollToProgress = (targetProgress: number) => {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const targetY = Math.max(0, Math.min(1, targetProgress)) * docHeight;
        lenis?.scrollTo(targetY, { duration: 1.35 });
      };

      experienceState.scrollToSection = (sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        lenis?.scrollTo(el, { duration: 1.35, offset: 0 });
      };

      experienceState.scrollToY = (targetY: number) => {
        lenis?.scrollTo(targetY, { duration: 1.15 });
      };
    } else {
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      experienceState.scrollToProgress = (targetProgress: number) => {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const targetY = Math.max(0, Math.min(1, targetProgress)) * docHeight;
        window.scrollTo({ top: targetY, behavior: 'auto' });
      };
      experienceState.scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'auto' });
      };
      experienceState.scrollToY = (targetY: number) => {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      };
      handleNativeScroll();
    }

    const updateNormalizedPointer = (clientX: number, clientY: number) => {
      const nx = (clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -((clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      setMousePosition(nx, ny, 1);
    };

    const handlePointerActive = (event: PointerEvent) => {
      updateNormalizedPointer(event.clientX, event.clientY);
    };

    const handlePointerUpOrCancel = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        setPointerActive(0);
      }
    };

    const handlePointerLeave = () => {
      setPointerActive(0);
    };

    const handleTouchInput = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const t = event.touches[0];
      updateNormalizedPointer(t.clientX, t.clientY);
    };

    const handleTouchRelease = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        setPointerActive(0);
      }
    };

    const handleResize = () => {
      syncFlags();
      refreshSectionAnchors();
      lenis?.resize();
    };

    // Observe document height changes (e.g. responsive fonts/video containers)
    const resizeObserver = new ResizeObserver(() => {
      refreshSectionAnchors();
      lenis?.resize();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('pointerdown', handlePointerActive, { passive: true });
    window.addEventListener('pointermove', handlePointerActive, { passive: true });
    window.addEventListener('pointerup', handlePointerUpOrCancel, { passive: true });
    window.addEventListener('pointercancel', handlePointerUpOrCancel, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchInput, { passive: true });
    window.addEventListener('touchmove', handleTouchInput, { passive: true });
    window.addEventListener('touchend', handleTouchRelease, { passive: true });
    window.addEventListener('touchcancel', handleTouchRelease, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial anchor measurement after first layout paint
    requestAnimationFrame(() => {
      refreshSectionAnchors();
      handleNativeScroll();
    });

    return () => {
      resizeObserver.disconnect();
      mediaMobile.removeEventListener('change', syncFlags);
      mediaMotion.removeEventListener('change', syncFlags);
      window.removeEventListener('pointerdown', handlePointerActive);
      window.removeEventListener('pointermove', handlePointerActive);
      window.removeEventListener('pointerup', handlePointerUpOrCancel);
      window.removeEventListener('pointercancel', handlePointerUpOrCancel);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchInput);
      window.removeEventListener('touchmove', handleTouchInput);
      window.removeEventListener('touchend', handleTouchRelease);
      window.removeEventListener('touchcancel', handleTouchRelease);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleNativeScroll);
      experienceState.scrollToProgress = null;
      experienceState.scrollToSection = null;
      experienceState.scrollToY = null;

      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      lenis?.destroy();
    };
  }, []);

  // Re-measure anchors once Preloader lifts
  useEffect(() => {
    if (isReady) {
      refreshSectionAnchors();
    }
  }, [isReady]);

  // Freeze background scroll when project modal is open
  useEffect(() => {
    if (modalCase) {
      document.body.style.overflow = 'hidden';
    } else if (isReady) {
      document.body.style.overflow = '';
    }
    return () => {
      if (isReady) {
        document.body.style.overflow = '';
      }
    };
  }, [modalCase, isReady]);
}
