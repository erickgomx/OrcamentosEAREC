/**
 * One-shot device capability detection used to scale WebGL cost
 * (DPR, particle count, post-processing, backdrop blur) so the experience
 * stays fluid from low-end phones up to high-end desktops.
 */
export type PerfTier = 'low' | 'mid' | 'high';

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

function detectPerfTier(): PerfTier {
  if (typeof window === 'undefined') return 'high';

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 4;
  const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const saveData = (nav as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData;

  if (saveData || cores <= 4 || memory <= 2) return 'low';
  if (isSmallScreen || isCoarse || cores <= 6 || memory <= 4) return 'mid';
  return 'high';
}

export const PERF_TIER: PerfTier = detectPerfTier();

/** Max device pixel ratio allowed per tier. */
export const PERF_MAX_DPR: Record<PerfTier, number> = {
  low: 1,
  mid: 1.1,
  high: 1.5,
};

/** Particle budget per tier (1 single GPU draw call with small point sizes). */
export const PERF_PARTICLES: Record<PerfTier, number> = {
  low: 850,
  mid: 1300,
  high: 3200,
};
