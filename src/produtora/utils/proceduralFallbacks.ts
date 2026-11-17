import * as THREE from 'three';

/**
 * Deterministic PRNG (Mulberry32) so particle layouts and noise textures
 * remain reproducible across renders.
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a 512x512 grayscale noise displacement map in memory
 * when displacement-map.webp fails to load.
 */
export function createProceduralDisplacementTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const rng = createSeededRandom(202611);

    // Smooth value noise via coarse grid bilinear-like waves + subtle grain
    const gridSize = 16;
    const grid = new Float32Array(gridSize * gridSize);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = rng();
    }

    const sampleGrid = (x: number, y: number, freq: number): number => {
      const gx = (x / size) * freq;
      const gy = (y / size) * freq;
      const ix = Math.floor(gx) % gridSize;
      const iy = Math.floor(gy) % gridSize;
      const nx = (ix + 1) % gridSize;
      const ny = (iy + 1) % gridSize;
      const fx = gx - Math.floor(gx);
      const fy = gy - Math.floor(gy);
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);

      const v00 = grid[iy * gridSize + ix];
      const v10 = grid[iy * gridSize + nx];
      const v01 = grid[ny * gridSize + ix];
      const v11 = grid[ny * gridSize + nx];
      const vx0 = v00 + (v10 - v00) * sx;
      const vx1 = v01 + (v11 - v01) * sx;
      return vx0 + (vx1 - vx0) * sy;
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n =
          sampleGrid(x, y, 4) * 0.55 +
          sampleGrid(x, y, 8) * 0.3 +
          sampleGrid(x, y, 16) * 0.15;
        const val = Math.max(0, Math.min(255, Math.floor(n * 255)));
        const idx = (y * size + x) * 4;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a 64x64 soft radial glow sprite for GPU Points fallback.
 */
export function createProceduralParticleSprite(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.28, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.62, 'rgba(255, 255, 255, 0.22)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a high-contrast 9:16 slate/viewfinder poster texture on Canvas
 * so cards look intentional instantaneously before MP4 frames decode (or if video fails).
 */
export function createProceduralPosterTexture(
  title: string,
  category: string,
  indexLabel: string
): THREE.CanvasTexture {
  const width = 540;
  const height = 960;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep studio background
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#121010');
    bg.addColorStop(0.55, '#070707');
    bg.addColorStop(1, '#1A0408');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle film grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 90; x < width; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 120; y < height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Viewfinder corner brackets
    ctx.strokeStyle = 'rgba(255, 8, 41, 0.75)';
    ctx.lineWidth = 3;
    const pad = 34;
    const len = 36;
    const corners: [number, number, number, number][] = [
      [pad, pad, 1, 1],
      [width - pad, pad, -1, 1],
      [pad, height - pad, 1, -1],
      [width - pad, height - pad, -1, -1],
    ];
    for (const [cx, cy, sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * len, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + sy * len);
      ctx.stroke();
    }

    // REC Badge
    ctx.fillStyle = '#FF0829';
    ctx.beginPath();
    ctx.arc(64, 72, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F5F3F1';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`REC // ${indexLabel}`, 84, 78);

    // Center crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 22, height / 2);
    ctx.lineTo(width / 2 + 22, height / 2);
    ctx.moveTo(width / 2, height / 2 - 22);
    ctx.lineTo(width / 2, height / 2 + 22);
    ctx.stroke();

    // Category & Title
    ctx.fillStyle = '#FF0829';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(category.toUpperCase(), 48, height - 150);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(title, 48, height - 102, width - 96);

    ctx.fillStyle = '#9D978D';
    ctx.font = '15px monospace';
    ctx.fillText('EA REC MIDIA // 4K 60FPS', 48, height - 62);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Safely loads a Three.js texture with immediate procedural fallback on error.
 */
export function loadTextureWithFallback(
  url: string,
  fallbackFactory: () => THREE.Texture,
  onReady: (texture: THREE.Texture) => void
): () => void {
  let cancelled = false;
  const loader = new THREE.TextureLoader();

  loader.load(
    url,
    (loaded) => {
      if (cancelled) {
        loaded.dispose();
        return;
      }
      loaded.wrapS = THREE.RepeatWrapping;
      loaded.wrapT = THREE.RepeatWrapping;
      loaded.needsUpdate = true;
      onReady(loaded);
    },
    undefined,
    () => {
      if (cancelled) return;
      onReady(fallbackFactory());
    }
  );

  return () => {
    cancelled = true;
  };
}
