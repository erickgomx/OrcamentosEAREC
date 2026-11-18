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
import { getPreloaderSnapshot, usePreloaderStore } from '../utils/assetPreloader';

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
    let lastUserInteractionTime = performance.now();
    let lastFrameTimestamp = performance.now();
    let isTouchDown = false;
    let autoCruiseBlend = 0;
    let autoScrollY: number | null = null;

    const markUserInteraction = () => {
      lastUserInteractionTime = performance.now();
      autoCruiseBlend = 0;
      autoScrollY = null;
    };

    const getAutoCruiseSpeedPxPerSec = (act: number): number => {
      // Section-aware pacing so nothing is skipped quickly:
      // - Act 0/1 (Portal & 3D Camera Rigs): ~85 px/s
      // - Act 2 (Post-Production Scopes): ~65 px/s
      // - Act 3 (3D Reels Spiral): ~68 px/s
      // - Act 4 (Photo Ribbons): ~65 px/s
      // - Act 5 (Team Chapters): ~60 px/s (extra reading time per member)
      if (act === 2) return 65;
      if (act === 3) return 68;
      if (act === 4) return 65;
      if (act === 5) return 60;
      if (act >= 6) return 55;
      return 85;
    };

    const handleNativeScroll = () => {
      const currentY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? currentY / docHeight : 0;
      const vel = currentY - experienceState.scrollY;
      updateScrollMetrics(currentY, progress, vel);
    };

    const IDLE_DELAY_MS = 5000;

    if (!mediaMotion.matches) {
      lenis = new Lenis({
        lerp: 0.065,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.35,
      });

      lenis.on('scroll', (e: { scroll: number; progress: number; velocity: number }) => {
        if (autoScrollY === null) {
          lastUserInteractionTime = performance.now();
        }
        updateScrollMetrics(e.scroll ?? window.scrollY, e.progress ?? 0, e.velocity ?? 0);
      });

      tickerCallback = (time: number) => {
        const now = performance.now();
        const dt = Math.max(0.004, Math.min((now - lastFrameTimestamp) / 1000, 0.05));
        lastFrameTimestamp = now;

        lenis?.raf(time * 1000);

        if (!lenis) return;

        const preloaderReady = getPreloaderSnapshot().isReady;
        const hasOpenDialog =
          document.body.style.overflow === 'hidden' ||
          document.querySelector('[role="dialog"]') !== null;

        if (!preloaderReady) {
          lastUserInteractionTime = now;
          autoCruiseBlend = 0;
          autoScrollY = null;
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
          window.scrollY < maxScroll - 2;

        if (canAutoScroll) {
          if (autoScrollY === null) {
            autoScrollY = window.scrollY;
          }
          // Smooth ~1.2s fade-in into automatic cruise speed
          autoCruiseBlend = Math.min(1, autoCruiseBlend + dt * 0.85);

          const act = getExperienceSnapshot().activeSection;
          const targetSpeedPxPerSec = getAutoCruiseSpeedPxPerSec(act);

          const easeBlend =
            autoCruiseBlend * autoCruiseBlend * (3 - 2 * autoCruiseBlend);
          const stepPx = targetSpeedPxPerSec * easeBlend * dt;
          autoScrollY = Math.min(maxScroll, autoScrollY + stepPx);

          lenis.scrollTo(autoScrollY, { immediate: true });
          const progress = maxScroll > 0 ? autoScrollY / maxScroll : 0;
          updateScrollMetrics(autoScrollY, progress, targetSpeedPxPerSec * easeBlend * 0.016);
        } else if (idleElapsed < IDLE_DELAY_MS) {
          autoCruiseBlend = 0;
          autoScrollY = null;
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

      tickerCallback = () => {
        const now = performance.now();
        const dt = Math.max(0.004, Math.min((now - lastFrameTimestamp) / 1000, 0.05));
        lastFrameTimestamp = now;
        const preloaderReady = getPreloaderSnapshot().isReady;
        const hasOpenDialog =
          document.body.style.overflow === 'hidden' ||
          document.querySelector('[role="dialog"]') !== null;

        if (!preloaderReady) {
          lastUserInteractionTime = now;
          autoCruiseBlend = 0;
          autoScrollY = null;
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
          window.scrollY < maxScroll - 2;

        if (canAutoScroll) {
          if (autoScrollY === null) {
            autoScrollY = window.scrollY;
          }
          autoCruiseBlend = Math.min(1, autoCruiseBlend + dt * 0.65);
          const act = getExperienceSnapshot().activeSection;
          const targetSpeedPxPerSec = getAutoCruiseSpeedPxPerSec(act);
          const easeBlend =
            autoCruiseBlend * autoCruiseBlend * (3 - 2 * autoCruiseBlend);
          autoScrollY = Math.min(
            maxScroll,
            autoScrollY + targetSpeedPxPerSec * easeBlend * dt
          );
          window.scrollTo({ top: autoScrollY, behavior: 'auto' });
        } else {
          autoCruiseBlend = 0;
          autoScrollY = null;
        }
      };

      gsap.ticker.add(tickerCallback);

      experienceState.scrollToProgress = (targetProgress: number) => {
        markUserInteraction();
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const targetY = Math.max(0, Math.min(1, targetProgress)) * docHeight;
        window.scrollTo({ top: targetY, behavior: 'auto' });
      };
      experienceState.scrollToSection = (sectionId: string) => {
        markUserInteraction();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'auto' });
      };
      experienceState.scrollToY = (targetY: number) => {
        markUserInteraction();
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
