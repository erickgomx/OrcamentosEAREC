import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {
  experienceState,
  getExperienceSnapshot,
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
    let tickerCallback: ((time: number, deltaTime: number) => void) | null = null;
    let lastUserInteractionTime = performance.now();
    let isTouchDown = false;
    let autoCruiseBlend = 0;

    const markUserInteraction = () => {
      lastUserInteractionTime = performance.now();
      autoCruiseBlend = 0;
    };

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

      const IDLE_DELAY_MS = 3500;

      tickerCallback = (time: number, deltaTime: number) => {
        const dt = Math.min((deltaTime || 16.67) / 1000, 0.05);
        lenis?.raf(time * 1000);

        if (!lenis) return;

        const now = performance.now();
        const preloaderReady = usePreloaderStore.getState().isReady;
        const hasOpenDialog =
          document.body.style.overflow === 'hidden' ||
          document.querySelector('[role="dialog"]') !== null;

        if (!preloaderReady) {
          lastUserInteractionTime = now;
          autoCruiseBlend = 0;
          return;
        }

        const idleElapsed = now - lastUserInteractionTime;
        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );

        const canAutoScroll =
          !isTouchDown &&
          !hasOpenDialog &&
          !document.hidden &&
          idleElapsed >= IDLE_DELAY_MS &&
          experienceState.scrollY < maxScroll - 2;

        if (canAutoScroll) {
          // Smooth 2.2s fade-in into automatic cruise speed
          autoCruiseBlend = Math.min(1, autoCruiseBlend + dt * 0.45);

          // Section-aware pacing so nothing is skipped quickly:
          // - Act 0/1 (Portal & 3D Camera Rigs): ~42 px/s
          // - Act 2 (Post-Production Scopes): ~30 px/s
          // - Act 3 (3D Reels Spiral): ~32 px/s
          // - Act 4 (Photo Ribbons): ~30 px/s
          // - Act 5 (Team Chapters): ~28 px/s (extra reading time per member)
          const act = getExperienceSnapshot().activeSection;
          let targetSpeedPxPerSec = 42;
          if (act === 2) targetSpeedPxPerSec = 30;
          else if (act === 3) targetSpeedPxPerSec = 32;
          else if (act === 4) targetSpeedPxPerSec = 30;
          else if (act === 5) targetSpeedPxPerSec = 28;
          else if (act >= 6) targetSpeedPxPerSec = 26;

          const easeBlend =
            autoCruiseBlend * autoCruiseBlend * (3 - 2 * autoCruiseBlend);
          const stepPx = targetSpeedPxPerSec * easeBlend * dt;
          const nextY = Math.min(maxScroll, lenis.targetScroll + stepPx);

          lenis.scrollTo(nextY, { immediate: false });
        } else {
          autoCruiseBlend = 0;
        }
      };

      gsap.ticker.add(tickerCallback);

      experienceState.scrollToProgress = (targetProgress: number) => {
        markUserInteraction();
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const targetY = Math.max(0, Math.min(1, targetProgress)) * docHeight;
        lenis?.scrollTo(targetY, { duration: 1.35 });
      };

      experienceState.scrollToSection = (sectionId: string) => {
        markUserInteraction();
        const el = document.getElementById(sectionId);
        if (!el) return;
        lenis?.scrollTo(el, { duration: 1.35, offset: 0 });
      };

      experienceState.scrollToY = (targetY: number) => {
        markUserInteraction();
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

    const handlePointerDown = (event: PointerEvent) => {
      markUserInteraction();
      if (event.pointerType === 'touch') {
        isTouchDown = true;
      }
      updateNormalizedPointer(event.clientX, event.clientY);
    };

    const handlePointerActive = (event: PointerEvent) => {
      updateNormalizedPointer(event.clientX, event.clientY);
    };

    const handlePointerUpOrCancel = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        isTouchDown = false;
        markUserInteraction();
        setPointerActive(0);
      }
    };

    const handlePointerLeave = () => {
      setPointerActive(0);
    };

    const handleTouchInput = (event: TouchEvent) => {
      isTouchDown = true;
      markUserInteraction();
      if (event.touches.length === 0) return;
      const t = event.touches[0];
      updateNormalizedPointer(t.clientX, t.clientY);
    };

    const handleTouchRelease = (event: TouchEvent) => {
      markUserInteraction();
      if (event.touches.length === 0) {
        isTouchDown = false;
        setPointerActive(0);
      }
    };

    const handleUserScrollInput = () => {
      markUserInteraction();
    };

    const handleResize = () => {
      syncFlags();
      refreshSectionAnchors();
      lenis?.resize();
    };

    // Observe document height changes (e.g. responsive fonts/video containers), throttled to 1 rAF
    let resizeRaf = 0;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        refreshSectionAnchors();
        lenis?.resize();
      });
    });
    resizeObserver.observe(document.body);

    window.addEventListener('wheel', handleUserScrollInput, { passive: true });
    window.addEventListener('keydown', handleUserScrollInput, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
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
      window.removeEventListener('wheel', handleUserScrollInput);
      window.removeEventListener('keydown', handleUserScrollInput);
      window.removeEventListener('pointerdown', handlePointerDown);
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
