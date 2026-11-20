import { useEffect } from 'react';
import { usePreloaderStore } from '../utils/assetPreloader';

/**
 * Single shared IntersectionObserver that reveals every `[data-reveal]` element
 * once the preloader curtain lifts (`isReady`) and the element enters the viewport.
 * Pure CSS compositor-only transitions (opacity, transform, clip-path) → 60 FPS.
 */
export function useRevealOnScroll(): void {
  const { isReady } = usePreloaderStore();

  useEffect(() => {
    if (!isReady) return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => {
        if (el.closest('#act-portal')) return;
        el.classList.add('is-revealed');
      });
      return;
    }

    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          } else {
            entry.target.classList.remove('is-revealed');
          }
        }
      },
      { rootMargin: '-4% 0px -4% 0px', threshold: 0.01 }
    );

    const observeAll = () => {
      const vh = window.innerHeight || 900;
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.closest('#act-portal')) return;
        if (!observed.has(el)) {
          observed.add(el);
          const rect = el.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) {
            el.classList.add('is-revealed');
          }
          observer.observe(el);
        }
      });
    };

    observeAll();

    const mutObserver = new MutationObserver(observeAll);
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutObserver.disconnect();
      observer.disconnect();
    };
  }, [isReady]);
}
