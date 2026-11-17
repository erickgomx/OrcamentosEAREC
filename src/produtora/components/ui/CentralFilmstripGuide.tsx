import { useExperienceStore } from '../../hooks/useExperienceStore';

/**
 * Lightweight center guide rail positioned at z-[5]
 * (above the 3D filmstrip canvas, strictly below all z-10 UI cards/modals).
 */
export function CentralFilmstripGuide() {
  const { modalCase, activeSection } = useExperienceStore();

  // Duck opacity subtly in center-heavy acts (Timeline, Spiral Videos, Photo Ribbons) and hide when modal opens
  const isCenterHeavy = activeSection === 2 || activeSection === 3 || activeSection === 4;
  const opacityClass = modalCase
    ? 'opacity-0'
    : isCenterHeavy
      ? 'opacity-30'
      : 'opacity-75';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-y-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none flex flex-col items-center justify-between py-20 transition-opacity duration-300 ${opacityClass}`}
    >
      {/* Subtle Vertical Center Axis Hairline */}
      <div className="w-px flex-1 my-3 bg-gradient-to-b from-transparent via-[#FF0829]/25 to-transparent" />

      {/* Bottom Viewfinder Center Reticle */}
      <div className="w-2 h-2 rotate-45 border border-[#FF0829]/50 bg-[#030303]/60" />
    </div>
  );
}
