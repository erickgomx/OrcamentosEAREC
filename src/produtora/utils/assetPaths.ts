/**
 * Centralized asset path resolver with URI encoding for filenames containing
 * spaces, double spaces, and parentheses in public/.
 */

export const TEXTURE_PATHS = {
  logo: '/textures/logo-earec.svg',
  logoOriginal: '/logo.svg',
  displacementMap: '/displacement-map.webp',
  displacementMapFallback: '/textures/displacement-map.webp',
  particleSprite: '/particle-sprite.webp',
  particleSpriteFallback: '/textures/particle-sprite.webp',
} as const;

export function getHardwareModelUrl(filename: string): string {
  return encodeURI(`/3D/${filename}`);
}

export function getReelVideoUrl(index: number): string {
  return encodeURI(`/REELS/Reel (${index}).mp4`);
}

export function getPortfolioPhotoUrl(filename: string): string {
  return encodeURI(`/fotos portifolio/${filename}`);
}

export function getTeamPhotoUrl(filename: string): string {
  return encodeURI(`/team/${filename}`);
}

/**
 * Note: Actual files in public/SCROLL/Timeline/ have a double space
 * between "Timeline" and "(N).jpg" (e.g. "Timeline  (1).jpg").
 */
export function getTimelineFrameUrl(index: number): string {
  return encodeURI(`/SCROLL/Timeline/Timeline  (${index}).jpg`);
}

export function getScope1FrameUrl(index: number): string {
  return encodeURI(`/SCROLL/Scope1/Scope1 (${index}).jpg`);
}

export function getScope2FrameUrl(index: number): string {
  return encodeURI(`/SCROLL/Scope2/Scope2 (${index}).jpg`);
}

export const SCROLL_SEQUENCE_COUNTS = {
  timeline: 172,
  scope1: 79,
  scope2: 96,
} as const;
