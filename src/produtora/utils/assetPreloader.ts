import { useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  HARDWARE_RIGS,
  PORTFOLIO_CASES,
  PORTFOLIO_PHOTOS,
  TEAM_CHAPTERS,
} from '../data/portfolioData';
import {
  getScope1FrameUrl,
  getScope2FrameUrl,
  getTimelineFrameUrl,
  SCROLL_SEQUENCE_COUNTS,
  TEXTURE_PATHS,
} from './assetPaths';
import { PERF_TIER } from './devicePerf';

export interface SequencePool {
  images: (HTMLImageElement | null)[];
  loadedFlags: Uint8Array;
  count: number;
}

export interface ScrollSequencePools {
  timeline: SequencePool;
  scope1: SequencePool;
  scope2: SequencePool;
}

export interface PreloadItemStatus {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'ready' | 'fallback';
}

export interface PreloadState {
  progress: number;
  currentLabel: string;
  assetsLoaded: boolean;
  isReady: boolean;
  modelVersion: number;
  items: PreloadItemStatus[];
}

function createSequencePool(count: number): SequencePool {
  return {
    images: new Array(count).fill(null),
    loadedFlags: new Uint8Array(count),
    count,
  };
}

const scrollPools: ScrollSequencePools = {
  timeline: createSequencePool(SCROLL_SEQUENCE_COUNTS.timeline),
  scope1: createSequencePool(SCROLL_SEQUENCE_COUNTS.scope1),
  scope2: createSequencePool(SCROLL_SEQUENCE_COUNTS.scope2),
};

export function getScrollSequencePools(): ScrollSequencePools {
  return scrollPools;
}

const initialItems: PreloadItemStatus[] = [
  { id: 'sony-a6100', label: 'Câmera de Cinema Sony A6400', status: 'pending' },
  { id: 'canon-400d', label: 'Câmera Fotográfica Canon SL2', status: 'pending' },
  { id: 'dji-mini-3-pro', label: 'Drone DJI Mini 3', status: 'pending' },
  { id: 'textures', label: 'Cenário & Iluminação de Estúdio', status: 'pending' },
  {
    id: 'scroll-timeline',
    label: 'Estúdio de Edição & Montagem',
    status: 'pending',
  },
  {
    id: 'scroll-scopes',
    label: 'Painéis de Cor & Luz',
    status: 'pending',
  },
  {
    id: 'photos',
    label: 'Galeria de Fotos & Equipe',
    status: 'pending',
  },
  {
    id: 'videos',
    label: 'Filmes & Produções',
    status: 'pending',
  },
];

let state: PreloadState = {
  progress: 0,
  currentLabel: 'Preparando o estúdio EA REC...',
  assetsLoaded: false,
  isReady: false,
  modelVersion: 0,
  items: initialItems,
};

const listeners = new Set<() => void>();
const preloadedModels = new Map<string, THREE.Group>();
let bootPromise: Promise<void> | null = null;
let resolveGpuGate: (() => void) | null = null;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribePreloader(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPreloaderSnapshot(): PreloadState {
  return state;
}

export function usePreloaderStore(): PreloadState {
  return useSyncExternalStore(
    subscribePreloader,
    getPreloaderSnapshot,
    getPreloaderSnapshot
  );
}

export function getPreloadedModel(id: string): THREE.Group | null {
  return preloadedModels.get(id) ?? null;
}

export function notifyGpuReady(): void {
  if (resolveGpuGate) {
    resolveGpuGate();
    resolveGpuGate = null;
  }
}

function updateItemStatus(
  id: string,
  status: PreloadItemStatus['status']
): void {
  state = {
    ...state,
    items: state.items.map((item) =>
      item.id === id ? { ...item, status } : item
    ),
  };
  emit();
}

/**
 * Safely merges static meshes sharing the same Material and compatible geometry
 * attributes to drastically reduce WebGL draw calls (e.g. 672 -> ~8 on DJI Drone).
 */
function mergeStaticMeshesByMaterial(root: THREE.Object3D): THREE.Group {
  root.updateMatrixWorld(true);

  const buckets = new Map<
    string,
    { material: THREE.Material; geos: THREE.BufferGeometry[] }
  >();
  const unmergedMeshes: THREE.Mesh[] = [];

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry || !mesh.material) return;

    if (Array.isArray(mesh.material) || (mesh as THREE.SkinnedMesh).isSkinnedMesh) {
      const cloned = mesh.clone();
      cloned.applyMatrix4(mesh.matrixWorld);
      unmergedMeshes.push(cloned);
      return;
    }

    const bakedGeo = mesh.geometry.clone();
    bakedGeo.applyMatrix4(mesh.matrixWorld);

    // Build compatibility signature: material uuid + indexed flag + attribute keys
    const attrKeys = Object.keys(bakedGeo.attributes).sort().join(',');
    const isIndexed = bakedGeo.index !== null ? 'idx' : 'nonidx';
    const sig = `${mesh.material.uuid}::${isIndexed}::${attrKeys}`;

    let bucket = buckets.get(sig);
    if (!bucket) {
      bucket = { material: mesh.material, geos: [] };
      buckets.set(sig, bucket);
    }
    bucket.geos.push(bakedGeo);
  });

  const mergedGroup = new THREE.Group();

  for (const { material, geos } of buckets.values()) {
    if ('envMapIntensity' in material) {
      (material as THREE.MeshStandardMaterial).envMapIntensity = 1.45;
    }

    if (geos.length === 1) {
      mergedGroup.add(new THREE.Mesh(geos[0], material));
      continue;
    }

    let merged: THREE.BufferGeometry | null = null;
    try {
      merged = mergeGeometries(geos, false);
    } catch {
      merged = null;
    }

    if (merged) {
      for (const g of geos) g.dispose();
      mergedGroup.add(new THREE.Mesh(merged, material));
    } else {
      for (const g of geos) {
        mergedGroup.add(new THREE.Mesh(g, material));
      }
    }
  }

  for (const mesh of unmergedMeshes) {
    mergedGroup.add(mesh);
  }

  return mergedGroup;
}

/**
 * Merges compatible static meshes, centers bounding box at (0,0,0),
 * and uniformly scales its longest axis to targetSize.
 */
function normalizeModelScene(root: THREE.Object3D, targetSize = 2.7): THREE.Group {
  const consolidated = mergeStaticMeshesByMaterial(root);
  consolidated.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(consolidated);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxAxis = Math.max(size.x, size.y, size.z, 0.001);
  const scaleFactor = targetSize / maxAxis;

  const wrapper = new THREE.Group();
  consolidated.position.set(
    -center.x * scaleFactor,
    -center.y * scaleFactor,
    -center.z * scaleFactor
  );
  consolidated.scale.setScalar(scaleFactor);
  wrapper.add(consolidated);
  return wrapper;
}

function preloadGLB(
  id: string,
  url: string,
  onProgress: (ratio: number) => void
): Promise<void> {
  updateItemStatus(id, 'loading');
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const normalized = normalizeModelScene(gltf.scene, 2.7);
        preloadedModels.set(id, normalized);
        updateItemStatus(id, 'ready');
        onProgress(1);
        resolve();
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          onProgress(Math.min(0.95, xhr.loaded / xhr.total));
        }
      },
      () => {
        updateItemStatus(id, 'fallback');
        onProgress(1);
        resolve();
      }
    );
  });
}

function preloadImage(url: string, retries = 2): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const attempt = (remaining: number) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        if (remaining > 0) {
          window.setTimeout(() => attempt(remaining - 1), 250);
        } else {
          resolve(null);
        }
      };
      img.src = url;
    };
    attempt(retries);
  });
}

function preloadVideoMetadata(url: string, timeoutMs = 4500): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }
    const video = document.createElement('video');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      video.onloadeddata = null;
      video.onloadedmetadata = null;
      video.onerror = null;
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = finish;
    video.onloadedmetadata = finish;
    video.onerror = finish;
    video.src = url;
    video.load();
  });
}

async function runConcurrentQueue<T>(
  jobs: T[],
  concurrency: number,
  worker: (job: T) => Promise<void>
): Promise<void> {
  let cursor = 0;
  const runners = Array.from(
    { length: Math.min(concurrency, jobs.length) },
    async () => {
      while (cursor < jobs.length) {
        const job = jobs[cursor++];
        await worker(job);
      }
    }
  );
  await Promise.all(runners);
}

let sequencePreloadStarted = false;
let modelsPreloadStarted = false;

/**
 * Streams the 3D GLB hardware rigs sequentially in the background with main-thread
 * yields so the Hero opens immediately without blocking Speed Index or TBT.
 */
export function startBackgroundModelsPreload(): void {
  if (modelsPreloadStarted) return;
  modelsPreloadStarted = true;

  void (async () => {
    for (const rig of HARDWARE_RIGS) {
      if (!rig.modelUrl || preloadedModels.has(rig.id)) continue;
      await preloadGLB(rig.id, rig.modelUrl, () => {});
      state = { ...state, modelVersion: state.modelVersion + 1 };
      emit();
      await new Promise((r) => window.setTimeout(r, 16));
    }
  })();
}

/**
 * Streams the 347 Timeline & Lumetri Scope frames in the background on first
 * user scroll/interaction so initial page load stays fast and lightweight.
 */
export function startBackgroundSequencePreload(): void {
  if (sequencePreloadStarted) return;
  sequencePreloadStarted = true;

  interface SequenceJob {
    pool: SequencePool;
    zeroIndex: number;
    url: string;
  }

  const frameStride = PERF_TIER === 'low' ? 3 : PERF_TIER === 'mid' ? 2 : 1;
  const jobs: SequenceJob[] = [];
  for (let i = 1; i < scrollPools.timeline.count; i += frameStride) {
    jobs.push({
      pool: scrollPools.timeline,
      zeroIndex: i,
      url: getTimelineFrameUrl(i + 1),
    });
  }
  const maxScopeCount = Math.max(scrollPools.scope1.count, scrollPools.scope2.count);
  for (let i = 1; i < maxScopeCount; i += frameStride) {
    if (i < scrollPools.scope1.count) {
      jobs.push({
        pool: scrollPools.scope1,
        zeroIndex: i,
        url: getScope1FrameUrl(i + 1),
      });
    }
    if (i < scrollPools.scope2.count) {
      jobs.push({
        pool: scrollPools.scope2,
        zeroIndex: i,
        url: getScope2FrameUrl(i + 1),
      });
    }
  }

  void runConcurrentQueue(jobs, 4, async (job) => {
    if (job.pool.loadedFlags[job.zeroIndex] === 1) return;
    const img = await preloadImage(job.url, 1);
    if (img) {
      job.pool.images[job.zeroIndex] = img;
      job.pool.loadedFlags[job.zeroIndex] = 1;
    }
  });
}

/**
 * Preloads all 3D GLB assets, base WebGL textures, ALL Timeline/Scope scroll
 * sequences, portfolio photos, and fonts, then waits for GPU shader
 * compilation before lifting the Preloader curtain.
 */
export function startAssetPreload(): Promise<void> {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    const rigProgress = new Map<string, number>();
    const totalWeight = HARDWARE_RIGS.length + 5;

    const recalculateProgress = (label: string) => {
      let sum = 0;
      for (const v of rigProgress.values()) sum += v;
      const pct = Math.min(98, Math.round((sum / totalWeight) * 100));
      state = {
        ...state,
        progress: Math.max(state.progress, pct),
        currentLabel: label,
      };
      emit();
    };

    state = { ...state, currentLabel: 'Posicionando as câmeras e o drone em 3D...' };
    emit();

    const glbPromises = HARDWARE_RIGS.filter((r) => Boolean(r.modelUrl)).map((rig) =>
      preloadGLB(rig.id, rig.modelUrl!, (ratio) => {
        rigProgress.set(rig.id, ratio);
        recalculateProgress(`Preparando ${rig.name}...`);
      }).then(() => {
        state = { ...state, modelVersion: state.modelVersion + 1 };
        emit();
      })
    );

    updateItemStatus('textures', 'loading');
    const texturesPromise = Promise.all([
      preloadImage(TEXTURE_PATHS.particleSprite),
      preloadImage(TEXTURE_PATHS.displacementMap),
    ]).then(() => {
      rigProgress.set('textures', 1);
      updateItemStatus('textures', 'ready');
      recalculateProgress('Cenário e iluminação prontos');
    });

    updateItemStatus('scroll-timeline', 'loading');
    updateItemStatus('scroll-scopes', 'loading');

    const frameStride = PERF_TIER === 'low' ? 3 : PERF_TIER === 'mid' ? 2 : 1;

    interface SequenceJob {
      kind: 'timeline' | 'scopes';
      pool: SequencePool;
      zeroIndex: number;
      url: string;
    }

    const timelineJobs: SequenceJob[] = [];
    for (let i = 0; i < scrollPools.timeline.count; i += frameStride) {
      timelineJobs.push({
        kind: 'timeline',
        pool: scrollPools.timeline,
        zeroIndex: i,
        url: getTimelineFrameUrl(i + 1),
      });
    }

    const scopeJobs: SequenceJob[] = [];
    const maxScopeCount = Math.max(scrollPools.scope1.count, scrollPools.scope2.count);
    for (let i = 0; i < maxScopeCount; i += frameStride) {
      if (i < scrollPools.scope1.count) {
        scopeJobs.push({
          kind: 'scopes',
          pool: scrollPools.scope1,
          zeroIndex: i,
          url: getScope1FrameUrl(i + 1),
        });
      }
      if (i < scrollPools.scope2.count) {
        scopeJobs.push({
          kind: 'scopes',
          pool: scrollPools.scope2,
          zeroIndex: i,
          url: getScope2FrameUrl(i + 1),
        });
      }
    }

    const timelineTotal = Math.max(1, timelineJobs.length);
    const scopesTotal = Math.max(1, scopeJobs.length);
    let timelineDone = 0;
    let scopesDone = 0;

    const runSequenceJob = async (job: SequenceJob) => {
      const img = await preloadImage(job.url, 2);
      if (img) {
        job.pool.images[job.zeroIndex] = img;
        job.pool.loadedFlags[job.zeroIndex] = 1;
      }
      if (job.kind === 'timeline') {
        timelineDone++;
        rigProgress.set('scroll-timeline', timelineDone / timelineTotal);
        if (timelineDone === timelineTotal) {
          updateItemStatus('scroll-timeline', 'ready');
        }
        if (timelineDone % 8 === 0 || timelineDone === timelineTotal) {
          recalculateProgress(
            `Preparando o estúdio de edição (${Math.round((timelineDone / timelineTotal) * 100)}%)...`
          );
        }
      } else {
        scopesDone++;
        rigProgress.set('scroll-scopes', scopesDone / scopesTotal);
        if (scopesDone === scopesTotal) {
          updateItemStatus('scroll-scopes', 'ready');
        }
        if (scopesDone % 8 === 0 || scopesDone === scopesTotal) {
          recalculateProgress(
            `Calibrando cores e luz (${Math.round((scopesDone / scopesTotal) * 100)}%)...`
          );
        }
      }
    };

    const sequencesPromise = Promise.all([
      runConcurrentQueue(timelineJobs, 6, runSequenceJob),
      runConcurrentQueue(scopeJobs, 6, runSequenceJob),
    ]);

    updateItemStatus('photos', 'loading');
    const allPhotoUrls = [
      ...PORTFOLIO_PHOTOS.map((p) => p.url),
      ...TEAM_CHAPTERS.map((c) => c.imageUrl),
    ];
    let photosDone = 0;
    const photosTotal = allPhotoUrls.length;
    const photosPromise = runConcurrentQueue(allPhotoUrls, 6, async (url) => {
      await preloadImage(url, 2);
      photosDone++;
      rigProgress.set('photos', photosDone / Math.max(1, photosTotal));
      if (photosDone === photosTotal) {
        updateItemStatus('photos', 'ready');
      }
      if (photosDone % 4 === 0 || photosDone === photosTotal) {
        recalculateProgress(
          `Organizando a galeria de fotos (${Math.round((photosDone / photosTotal) * 100)}%)...`
        );
      }
    });

    updateItemStatus('videos', 'loading');
    let videosDone = 0;
    const videosTotal = PORTFOLIO_CASES.length;
    const videosPromise = runConcurrentQueue(PORTFOLIO_CASES, 3, async (c) => {
      await preloadVideoMetadata(c.videoUrl);
      videosDone++;
      rigProgress.set('videos', videosDone / Math.max(1, videosTotal));
      if (videosDone === videosTotal) {
        updateItemStatus('videos', 'ready');
      }
      recalculateProgress(`Preparando os filmes (${videosDone}/${videosTotal})...`);
    });

    const fontsPromise =
      typeof document !== 'undefined' && 'fonts' in document
        ? Promise.race([
            document.fonts.ready.then(() => undefined),
            new Promise<void>((resolve) => window.setTimeout(resolve, 2000)),
          ])
        : Promise.resolve();

    await Promise.all([
      ...glbPromises,
      texturesPromise,
      sequencesPromise,
      photosPromise,
      videosPromise,
      fontsPromise,
    ]);

    // Signal SceneContainer to mount models & compile shaders on GPU
    state = {
      ...state,
      progress: 99,
      assetsLoaded: true,
      currentLabel: 'Ajustando os últimos detalhes...',
    };
    emit();

    // Wait for GPU compilation signal (with 2500ms fallback timeout if WebGL fails)
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => {
        resolveGpuGate = null;
        resolve();
      }, 2500);
      resolveGpuGate = () => {
        window.clearTimeout(timer);
        resolve();
      };
    });

    state = {
      ...state,
      progress: 100,
      currentLabel: 'Tudo pronto! Bem-vindo à EA REC.',
      isReady: true,
    };
    emit();
  })();

  return bootPromise;
}
