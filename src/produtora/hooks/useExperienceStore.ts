import { useSyncExternalStore } from 'react';
import { ACTS, CaseItem, PORTFOLIO_CASES } from '../data/portfolioData';

export interface MouseCoords {
  x: number;
  y: number;
}

export interface CameraWaypoint {
  x: number;
  y: number;
  z: number;
  lookX: number;
  lookY: number;
  lookZ: number;
}

interface SectionScrollAnchor {
  key: string;
  actId: number;
  scrollY: number;
  desktopCam: CameraWaypoint;
  mobileCam: CameraWaypoint;
}

const WAYPOINT_TEMPLATES: Omit<SectionScrollAnchor, 'scrollY'>[] = [
  {
    key: 'act-portal',
    actId: 0,
    desktopCam: { x: 0, y: 0, z: 6.8, lookX: 0, lookY: 0, lookZ: 0 },
    mobileCam: { x: 0, y: 0, z: 7.4, lookX: 0, lookY: 0, lookZ: 0 },
  },
  {
    key: 'rig-sony',
    actId: 1,
    desktopCam: { x: -0.25, y: -7.0, z: 4.5, lookX: -0.45, lookY: -7.0, lookZ: 0 },
    mobileCam: { x: 0, y: -7.15, z: 6.2, lookX: 0, lookY: -7.25, lookZ: 0 },
  },
  {
    key: 'rig-canon',
    actId: 1,
    desktopCam: { x: 0.25, y: -13.5, z: 4.5, lookX: 0.45, lookY: -13.5, lookZ: 0 },
    mobileCam: { x: 0, y: -13.65, z: 6.2, lookX: 0, lookY: -13.75, lookZ: 0 },
  },
  {
    key: 'rig-dji',
    actId: 1,
    desktopCam: { x: -0.25, y: -20.0, z: 4.5, lookX: -0.45, lookY: -20.0, lookZ: 0 },
    mobileCam: { x: 0, y: -20.15, z: 6.2, lookX: 0, lookY: -20.25, lookZ: 0 },
  },
  {
    key: 'act-post-start',
    actId: 2,
    desktopCam: { x: 0, y: -26.5, z: 5.2, lookX: 0, lookY: -26.5, lookZ: -1.5 },
    mobileCam: { x: 0, y: -26.5, z: 6.0, lookX: 0, lookY: -26.5, lookZ: -1.5 },
  },
  {
    key: 'act-post-end',
    actId: 2,
    desktopCam: { x: 0, y: -26.5, z: 5.2, lookX: 0, lookY: -26.5, lookZ: -1.5 },
    mobileCam: { x: 0, y: -26.5, z: 6.0, lookX: 0, lookY: -26.5, lookZ: -1.5 },
  },
  {
    key: 'act-gallery-start',
    actId: 3,
    desktopCam: { x: 0, y: -32.5, z: 5.8, lookX: 0, lookY: -32.5, lookZ: 0 },
    mobileCam: { x: 0, y: -32.5, z: 6.5, lookX: 0, lookY: -32.5, lookZ: 0 },
  },
  {
    key: 'act-gallery-end',
    actId: 3,
    desktopCam: { x: 0, y: -32.5, z: 5.8, lookX: 0, lookY: -32.5, lookZ: 0 },
    mobileCam: { x: 0, y: -32.5, z: 6.5, lookX: 0, lookY: -32.5, lookZ: 0 },
  },
  {
    key: 'act-photos-start',
    actId: 4,
    desktopCam: { x: 0, y: -38.0, z: 5.6, lookX: 0, lookY: -38.0, lookZ: 0 },
    mobileCam: { x: 0, y: -38.0, z: 6.2, lookX: 0, lookY: -38.0, lookZ: 0 },
  },
  {
    key: 'act-photos-end',
    actId: 4,
    desktopCam: { x: 0, y: -38.0, z: 5.6, lookX: 0, lookY: -38.0, lookZ: 0 },
    mobileCam: { x: 0, y: -38.0, z: 6.2, lookX: 0, lookY: -38.0, lookZ: 0 },
  },
  {
    key: 'act-team-start',
    actId: 5,
    desktopCam: { x: 0, y: -41.0, z: 5.4, lookX: 0, lookY: -41.0, lookZ: 0 },
    mobileCam: { x: 0, y: -41.0, z: 6.0, lookX: 0, lookY: -41.0, lookZ: 0 },
  },
  {
    key: 'act-team-end',
    actId: 5,
    desktopCam: { x: 0, y: -41.0, z: 5.4, lookX: 0, lookY: -41.0, lookZ: 0 },
    mobileCam: { x: 0, y: -41.0, z: 6.0, lookX: 0, lookY: -41.0, lookZ: 0 },
  },
  {
    key: 'act-cta',
    actId: 6,
    desktopCam: { x: 0, y: -45.0, z: 4.8, lookX: 0, lookY: -45.0, lookZ: 0 },
    mobileCam: { x: 0, y: -45.0, z: 5.4, lookX: 0, lookY: -45.0, lookZ: 0 },
  },
];

let cachedAnchors: SectionScrollAnchor[] = WAYPOINT_TEMPLATES.map((t, i) => ({
  ...t,
  scrollY: i * 900,
}));

let galleryRange = { startY: 4000, endY: 7000 };
let photosLogoRange = { startY: 7500, endY: 8500 };

function getElementDocBounds(id: string): { top: number; height: number } | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.top + window.scrollY, height: rect.height };
}

/**
 * Measures real DOM section positions so the 3D camera descends in exact
 * lockstep with every section and stays aligned across multi-screen sticky runs.
 */
export function refreshSectionAnchors(): void {
  if (typeof window === 'undefined') return;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  experienceState.viewport.width = vw;
  experienceState.viewport.height = vh;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

  const postB = getElementDocBounds('act-post');
  if (postB) experienceState.sectionBounds.post = postB;
  const galleryB = getElementDocBounds('act-gallery');
  if (galleryB) experienceState.sectionBounds.gallery = galleryB;
  const photosB = getElementDocBounds('act-photos');
  if (photosB) experienceState.sectionBounds.photos = photosB;
  const teamB = getElementDocBounds('act-team');
  if (teamB) experienceState.sectionBounds.team = teamB;

  const resolved: SectionScrollAnchor[] = WAYPOINT_TEMPLATES.map((tpl, idx) => {
    let scrollY = (idx / Math.max(1, WAYPOINT_TEMPLATES.length - 1)) * maxScroll;

    if (tpl.key === 'act-portal') {
      scrollY = 0;
    } else if (tpl.key === 'act-cta') {
      scrollY = maxScroll;
    } else if (tpl.key === 'act-post-start') {
      if (postB) scrollY = postB.top;
    } else if (tpl.key === 'act-post-end') {
      if (postB) scrollY = Math.max(postB.top, postB.top + postB.height - vh);
    } else if (tpl.key === 'act-gallery-start') {
      if (galleryB) {
        scrollY = galleryB.top;
        galleryRange.startY = galleryB.top;
      }
    } else if (tpl.key === 'act-gallery-end') {
      if (galleryB) {
        scrollY = Math.max(galleryB.top, galleryB.top + galleryB.height - vh);
        galleryRange.endY = scrollY;
      }
    } else if (tpl.key === 'act-photos-start') {
      if (photosB) scrollY = photosB.top;
    } else if (tpl.key === 'act-photos-end') {
      if (photosB) {
        scrollY = Math.max(photosB.top, photosB.top + photosB.height - vh);
      }
    } else if (tpl.key === 'act-team-start') {
      if (teamB) scrollY = teamB.top;
    } else if (tpl.key === 'act-team-end') {
      if (teamB) {
        scrollY = Math.max(teamB.top, teamB.top + teamB.height - vh);
        // Start forming the final CTA logo only after the team section has scrolled
        // past the upper half of the viewport so particles never overlap the founders.
        const clearanceStart = Math.min(maxScroll - 1, scrollY + vh * 0.45);
        photosLogoRange = {
          startY: clearanceStart,
          endY: Math.max(clearanceStart + 1, maxScroll),
        };
      }
    } else {
      const b = getElementDocBounds(tpl.key);
      if (b) {
        scrollY = b.top + b.height * 0.5 - vh * 0.5;
      }
    }

    return {
      ...tpl,
      scrollY: Math.max(0, Math.min(maxScroll, scrollY)),
    };
  });

  // Guarantee non-decreasing order
  for (let i = 1; i < resolved.length; i++) {
    if (resolved[i].scrollY < resolved[i - 1].scrollY) {
      resolved[i].scrollY = resolved[i - 1].scrollY;
    }
  }

  cachedAnchors = resolved;
}

function interpolateWaypoint(
  scrollY: number,
  isMobile: boolean
): { waypoint: CameraWaypoint; actId: number } {
  const anchors = cachedAnchors;
  if (anchors.length === 0) {
    return {
      waypoint: { x: 0, y: 0, z: 6.8, lookX: 0, lookY: 0, lookZ: 0 },
      actId: 0,
    };
  }

  if (scrollY <= anchors[0].scrollY) {
    const cam = isMobile ? anchors[0].mobileCam : anchors[0].desktopCam;
    return { waypoint: { ...cam }, actId: anchors[0].actId };
  }

  const lastIdx = anchors.length - 1;
  if (scrollY >= anchors[lastIdx].scrollY) {
    const cam = isMobile ? anchors[lastIdx].mobileCam : anchors[lastIdx].desktopCam;
    return { waypoint: { ...cam }, actId: anchors[lastIdx].actId };
  }

  for (let i = 0; i < lastIdx; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scrollY >= a.scrollY && scrollY <= b.scrollY) {
      const span = Math.max(1, b.scrollY - a.scrollY);
      const rawT = (scrollY - a.scrollY) / span;
      // On mobile hardware stations, hold/lock the camera at each rig before transitioning
      const isRigSegment =
        isMobile && (a.key.startsWith('rig-') || b.key.startsWith('rig-'));
      const easedRaw = isRigSegment
        ? Math.max(0, Math.min(1, (rawT - 0.25) / 0.5))
        : rawT;
      const t = easedRaw * easedRaw * (3 - 2 * easedRaw);

      const camA = isMobile ? a.mobileCam : a.desktopCam;
      const camB = isMobile ? b.mobileCam : b.desktopCam;

      const lerp = (u: number, v: number) => u + (v - u) * t;
      const nearestAct = rawT < 0.5 ? a.actId : b.actId;

      return {
        waypoint: {
          x: lerp(camA.x, camB.x),
          y: lerp(camA.y, camB.y),
          z: lerp(camA.z, camB.z),
          lookX: lerp(camA.lookX, camB.lookX),
          lookY: lerp(camA.lookY, camB.lookY),
          lookZ: lerp(camA.lookZ, camB.lookZ),
        },
        actId: nearestAct,
      };
    }
  }

  const fallback = isMobile ? anchors[0].mobileCam : anchors[0].desktopCam;
  return { waypoint: { ...fallback }, actId: 0 };
}

/**
 * High-frequency mutable frame state read inside R3F useFrame and Canvas 2D loops
 * without triggering React re-renders.
 */
export const experienceState = {
  scrollProgress: 0,
  scrollY: 0,
  scrollVelocity: 0,
  smoothedVelocity: 0,
  gallerySpiralProgress: 0, // 0.0 -> 4.0 across the 5 Reels
  postPhotosLogoProgress: 0, // 0.0 until photos pass; 0.0 -> 1.0 entering final CTA
  mousePosition: { x: 0, y: 0 } as MouseCoords,
  smoothedMouse: { x: 0, y: 0 } as MouseCoords,
  pointerActive: 0,
  smoothedPointerActive: 0,
  cameraWaypoint: {
    x: 0,
    y: 0,
    z: 6.8,
    lookX: 0,
    lookY: 0,
    lookZ: 0,
  } as CameraWaypoint,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  viewport: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  },
  sectionBounds: {
    post: { top: 0, height: 0 },
    gallery: { top: 0, height: 0 },
    photos: { top: 0, height: 0 },
    team: { top: 0, height: 0 },
  },
  scrollToSection: null as ((sectionId: string) => void) | null,
  scrollToProgress: null as ((progress: number) => void) | null,
  scrollToY: null as ((y: number) => void) | null,
};

interface UIExperienceState {
  activeSection: number;
  activeReelIndex: number;
  hoveredCaseId: number | null;
  reelBuffering: Record<number, boolean>;
  modalCase: CaseItem | null;
  isAudioMuted: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}

let uiState: UIExperienceState = {
  activeSection: 0,
  activeReelIndex: 0,
  hoveredCaseId: null,
  reelBuffering: Object.fromEntries(PORTFOLIO_CASES.map((c) => [c.id, true])),
  modalCase: null,
  isAudioMuted: true,
  isMobile: experienceState.isMobile,
  reducedMotion: experienceState.reducedMotion,
};

const listeners = new Set<() => void>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeExperience(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getExperienceSnapshot(): UIExperienceState {
  return uiState;
}

export function useExperienceStore(): UIExperienceState {
  return useSyncExternalStore(
    subscribeExperience,
    getExperienceSnapshot,
    getExperienceSnapshot
  );
}

export function updateScrollMetrics(
  scrollY: number,
  progress: number,
  velocity: number
): void {
  const clamped = Math.max(0, Math.min(1, progress));
  experienceState.scrollY = scrollY;
  experienceState.scrollProgress = clamped;
  experienceState.scrollVelocity = velocity;

  const { waypoint, actId } = interpolateWaypoint(scrollY, experienceState.isMobile);
  experienceState.cameraWaypoint = waypoint;

  // Compute continuous spiral index (0.0 -> PORTFOLIO_CASES.length - 1) across #act-gallery
  const maxReelIndex = Math.max(0, PORTFOLIO_CASES.length - 1);
  const span = Math.max(1, galleryRange.endY - galleryRange.startY);
  const rawGalleryLinear = Math.max(
    0,
    Math.min(1, (scrollY - galleryRange.startY) / span)
  );
  const rawGallery = Math.max(
    0,
    Math.min(1, (rawGalleryLinear - 0.06) / 0.82)
  );
  experienceState.gallerySpiralProgress = rawGallery * maxReelIndex;

  // 0 until #act-photos clears the upper viewport, then 0 -> 1 into #act-cta
  const logoSpan = Math.max(1, photosLogoRange.endY - photosLogoRange.startY);
  experienceState.postPhotosLogoProgress = Math.max(
    0,
    Math.min(1, (scrollY - photosLogoRange.startY) / logoSpan)
  );

  const nextReelIndex = Math.max(
    0,
    Math.min(maxReelIndex, Math.round(experienceState.gallerySpiralProgress))
  );
  const clampedAct = Math.max(0, Math.min(ACTS.length - 1, actId));

  if (
    clampedAct !== uiState.activeSection ||
    nextReelIndex !== uiState.activeReelIndex
  ) {
    uiState = {
      ...uiState,
      activeSection: clampedAct,
      activeReelIndex: nextReelIndex,
    };
    emitChange();
  }
}

export function setMousePosition(x: number, y: number, active = 1): void {
  experienceState.mousePosition.x = x;
  experienceState.mousePosition.y = y;
  experienceState.pointerActive = active;
}

export function setPointerActive(active: number): void {
  experienceState.pointerActive = active;
}

export function setViewportFlags(isMobile: boolean, reducedMotion: boolean): void {
  experienceState.isMobile = isMobile;
  experienceState.reducedMotion = reducedMotion;
  refreshSectionAnchors();
  if (uiState.isMobile !== isMobile || uiState.reducedMotion !== reducedMotion) {
    uiState = { ...uiState, isMobile, reducedMotion };
    emitChange();
  }
}

export function setReelBufferingState(id: number, buffering: boolean): void {
  if (uiState.reelBuffering[id] === buffering) return;
  uiState = {
    ...uiState,
    reelBuffering: { ...uiState.reelBuffering, [id]: buffering },
  };
  emitChange();
}

export function setHoveredCaseId(id: number | null): void {
  if (uiState.hoveredCaseId === id) return;
  uiState = { ...uiState, hoveredCaseId: id };
  emitChange();
}

export function setModalCase(item: CaseItem | null): void {
  uiState = { ...uiState, modalCase: item };
  emitChange();
}

export function setIsAudioMuted(muted: boolean): void {
  uiState = { ...uiState, isAudioMuted: muted };
  emitChange();
}

export function navigateToSection(sectionId: string): void {
  if (experienceState.scrollToSection) {
    experienceState.scrollToSection(sectionId);
  }
}

export function navigateToProgress(progress: number): void {
  if (experienceState.scrollToProgress) {
    experienceState.scrollToProgress(progress);
  }
}

export function scrollToReelIndex(index: number): void {
  const maxReelIndex = Math.max(0, PORTFOLIO_CASES.length - 1);
  const clamped = Math.max(0, Math.min(maxReelIndex, index));
  const span = Math.max(0, galleryRange.endY - galleryRange.startY);
  const normalizedRatio = maxReelIndex > 0 ? 0.06 + (clamped / maxReelIndex) * 0.82 : 0;
  const targetY = galleryRange.startY + normalizedRatio * span;
  if (experienceState.scrollToY) {
    experienceState.scrollToY(targetY);
  }
}
