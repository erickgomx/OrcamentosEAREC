import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { experienceState, useExperienceStore } from '../../hooks/useExperienceStore';
import { createSeededRandom } from '../../utils/proceduralFallbacks';
import { PERF_PARTICLES, PERF_TIER } from '../../utils/devicePerf';
import { EA_REC_LOGO_PATHS } from '../ui/BrandLogo';

// In front of the filmstrip ribbon (z≈0) so the mark is never occluded
const LOGO_Z = 0.6;

const PARTICLE_VERTEX_SHADER = /* glsl */ `
precision highp float;

// position.xy = normalized logo coordinate (x in [-0.5, 0.5]), position.z = depth jitter
attribute vec3 aScatterOffset;
attribute float aScale;
attribute float aSeed;
attribute float aMix;

uniform float uTime;
uniform float uProgress;
uniform float uGatherProgress;
uniform vec2 uMouse;
uniform vec2 uHalfWorldSize;
uniform float uPointerActive;
uniform float uCamY;
uniform float uLogoWidth;
uniform float uLogoY;
uniform float uLogoZ;
uniform float uLogoPointScale;
uniform float uHalfBufferH;

varying float vAlpha;
varying float vMix;
varying float vSeed;
varying float vLogoFocus;
varying float vShine;

const float PI = 3.14159265;

void main() {
  vMix = aMix;
  vSeed = aSeed;

  float p = clamp(uProgress, 0.0, 1.0);

  // Logo holds gently breathing at top, disperses immediately on the very first
  // scroll movement, and only re-gathers AFTER passing the photo showcase section.
  float stagger = aSeed * 0.018;
  float expand = smoothstep(0.0005 + stagger * 0.3, 0.042 + stagger, p);
  float g = clamp(uGatherProgress, 0.0, 1.0);
  float gather = smoothstep(0.04 + aSeed * 0.14, 0.78 + aSeed * 0.12, g);
  float spread = expand * (1.0 - gather);
  vLogoFocus = 1.0 - spread;

  // Logo target, always framed relative to the camera (same form at start & end)
  vec3 logoPos = vec3(
    position.x * uLogoWidth,
    uCamY + uLogoY + position.y * uLogoWidth,
    uLogoZ + position.z
  );

  // Expanded cinematic cloud riding along with the camera (subtle depth parallax)
  float parallax = 0.965 + aSeed * 0.07;
  vec3 cloudPos = vec3(
    aScatterOffset.x,
    uCamY * parallax + aScatterOffset.y,
    aScatterOffset.z
  );

  vec3 pos = mix(logoPos, cloudPos, spread);

  // Graceful curved flight path: left half arcs down-left, right half arcs down-right
  float side = sign(position.x + 0.0001);
  float arc = sin(spread * PI);
  pos.x += side * arc * (0.32 + aSeed * 0.52);
  pos.y -= arc * (0.24 + aSeed * 0.4);
  pos.z -= arc * (0.3 + aSeed * 0.55);

  // Smooth, unhurried floating drift (gentle breathing on logo, slow organic glide when expanded)
  float driftAmp = mix(0.016, 0.42, spread);
  float t = uTime * (0.14 + aSeed * 0.16) + aSeed * 6.283185;
  pos.x += (cos(t) * 0.7 + sin(t * 0.53 + aSeed * 4.2) * 0.3) * driftAmp;
  pos.y += (sin(t * 0.82 + aSeed * 3.1) * 0.75 + cos(t * 0.41) * 0.25) * driftAmp;
  pos.z += sin(t * 0.55 + aSeed * 5.2) * driftAmp * 0.45;

  // Hard Z-plane clamp when expanded so particles never drift in front of 3D rigs (z ~ 0) or filmstrip (z ~ -2.25)
  pos.z = min(pos.z, mix(uLogoZ + 0.1, -2.6, smoothstep(0.2, 0.75, spread)));

  // Gentle cursor & touch dispersion (like dust in a projector beam)
  vec2 mouseWorld = vec2(uMouse.x * uHalfWorldSize.x, uCamY + uMouse.y * uHalfWorldSize.y);
  vec2 delta = pos.xy - mouseWorld;
  float dist = length(delta) + 0.001;
  float repelRadius = mix(1.15, 2.4, spread);
  float repelFactor = smoothstep(repelRadius, 0.0, dist);
  float repel = repelFactor * repelFactor * mix(0.62, 0.42, spread) * uPointerActive;
  pos.xy += (delta / dist) * repel;
  pos.z += repelFactor * 0.25 * vLogoFocus * uPointerActive;

  // Slow light sweep travelling across the logo (cinematic "shine")
  float sweep = fract(uTime * 0.085) * 1.8 - 0.9;
  vShine = exp(-pow((position.x - sweep) * 7.0, 2.0)) * vLogoFocus;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float depth = max(0.6, -mvPosition.z);

  // World-space point size → fine, crisp pixel-like optical motes (low overdraw, 60 FPS)
  float logoSize = uLogoWidth * uLogoPointScale;
  float cloudSize = 0.046;
  float worldSize = mix(logoSize, cloudSize, spread) * aScale;
  gl_PointSize = clamp(worldSize * projectionMatrix[1][1] * uHalfBufferH / depth, 1.4, 7.5);
  gl_Position = projectionMatrix * mvPosition;

  float nearFade = smoothstep(0.6, 1.8, depth);
  float farFade = 1.0 - smoothstep(11.0, 22.0, depth);
  vAlpha = nearFade * farFade * mix(0.94, 0.46 + 0.22 * aScale, spread);
}
`;

const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;

varying float vAlpha;
varying float vMix;
varying float vSeed;
varying float vLogoFocus;
varying float vShine;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c) * 4.0;
  if (r2 > 1.0) discard;

  // Crisp optical pinpoint falloff — sharp premium particle definition
  float k = 1.0 - r2;
  float shape = mix(k * k, pow(k, 1.45), vLogoFocus);

  vec3 recRed = vec3(1.0, 0.035, 0.165) * mix(1.0, 1.55, vLogoFocus); // Vivid #FF0829 crimson
  vec3 offWhite = vec3(0.98, 0.97, 0.96) * mix(1.0, 1.15, vLogoFocus);
  vec3 warmAsh = vec3(0.66, 0.62, 0.57);

  vec3 color = mix(warmAsh, offWhite, smoothstep(0.12, 0.48, vMix));
  color = mix(color, recRed, smoothstep(0.62, 0.90, vMix));

  // Subtle travelling light sweep across the logo
  color += vec3(0.65, 0.58, 0.56) * vShine * 0.35;

  float twinkle = mix(0.88 + 0.12 * sin(uTime * 0.95 + vSeed * 42.0), 0.96, vLogoFocus);
  gl_FragColor = vec4(color * twinkle, shape * vAlpha);
}
`;

interface SampledLogoPoint {
  nx: number;
  ny: number;
  isRed: boolean;
}

/**
 * Rasterizes the official EA•REC SVG paths onto an offscreen canvas and performs
 * jittered stratified sampling so the whole mark is filled uniformly (no banding).
 */
function sampleEaRecLogoPoints(count: number, rng: () => number): SampledLogoPoint[] {
  const { viewBox, ea, recR, recE, recC, recDot } = EA_REC_LOGO_PATHS;
  const aspect = viewBox.width / viewBox.height;

  if (typeof document !== 'undefined' && typeof Path2D !== 'undefined') {
    const canvasW = 640;
    const canvasH = Math.max(64, Math.round(canvasW / aspect));
    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      const scaleX = canvasW / viewBox.width;
      const scaleY = canvasH / viewBox.height;

      const collectPixels = (draw: () => void): Array<{ nx: number; ny: number }> => {
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.save();
        ctx.scale(scaleX, scaleY);
        ctx.translate(-viewBox.x, -viewBox.y);
        ctx.fillStyle = '#ffffff';
        draw();
        ctx.restore();

        const data = ctx.getImageData(0, 0, canvasW, canvasH).data;
        const pts: Array<{ nx: number; ny: number }> = [];
        for (let py = 0; py < canvasH; py++) {
          for (let px = 0; px < canvasW; px++) {
            if (data[(py * canvasW + px) * 4 + 3] > 100) {
              pts.push({
                nx: px / canvasW - 0.5,
                ny: (0.5 - py / canvasH) / aspect,
              });
            }
          }
        }
        return pts;
      };

      const whitePts = collectPixels(() => {
        ctx.fill(new Path2D(ea), 'evenodd');
      });

      const redPts = collectPixels(() => {
        ctx.fill(new Path2D(recDot));
        ctx.fill(new Path2D(recR), 'evenodd');
        ctx.fill(new Path2D(recE));
        ctx.fill(new Path2D(recC));
      });

      if (whitePts.length > 0 && redPts.length > 0) {
        const result: SampledLogoPoint[] = [];
        const whiteTarget = Math.round(
          count * (whitePts.length / (whitePts.length + redPts.length))
        );
        const redTarget = count - whiteTarget;
        const jitter = 1 / canvasW;

        const pushStratified = (
          pool: Array<{ nx: number; ny: number }>,
          target: number,
          isRed: boolean
        ) => {
          for (let i = 0; i < target; i++) {
            const idx = Math.min(
              pool.length - 1,
              Math.floor(((i + rng()) / target) * pool.length)
            );
            const p = pool[idx];
            result.push({
              nx: p.nx + (rng() - 0.5) * jitter,
              ny: p.ny + (rng() - 0.5) * jitter,
              isRed,
            });
          }
        };

        pushStratified(whitePts, whiteTarget, false);
        pushStratified(redPts, redTarget, true);
        return result;
      }
    }
  }

  const fallback: SampledLogoPoint[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    fallback.push({
      nx: t - 0.5 + (rng() - 0.5) * 0.02,
      ny: ((rng() - 0.5) * 0.8) / aspect,
      isRed: t > 0.45,
    });
  }
  return fallback;
}

/**
 * Cinematic particle system on one continuous scroll path:
 * - Start: dense, 100% filled EA•REC logo framed in the upper part of the hero.
 * - Scroll: particles arc outward (left/right) into a floating bokeh field.
 * - End: they arc back and reassemble the EA•REC logo above the final CTA.
 * Logo size/position are recomputed per frame from the real camera frustum,
 * so it is never cropped on narrow phones nor tiny on ultrawide monitors.
 */
export function ParticlesField() {
  const { isMobile, reducedMotion } = useExperienceStore();
  const count = isMobile
    ? Math.min(PERF_PARTICLES[PERF_TIER], 2400)
    : PERF_PARTICLES[PERF_TIER];
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const drawSize = useMemo(() => new THREE.Vector2(), []);
  const smoothedProgressRef = useRef(0);
  const smoothedGatherRef = useRef(0);

  const geometry = useMemo(() => {
    const rng = createSeededRandom(19842026);
    const logoCoords = new Float32Array(count * 3);
    const scatterOffsets = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const mixes = new Float32Array(count);

    const logoPoints = sampleEaRecLogoPoints(count, rng);
    const spreadX = isMobile ? 4.2 : 7.0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const lp = logoPoints[i];

      logoCoords[i3] = lp.nx;
      logoCoords[i3 + 1] = lp.ny;
      logoCoords[i3 + 2] = (rng() - 0.5) * 0.05;

      const side = lp.nx >= 0 ? 1 : -1;
      scatterOffsets[i3] = side * (1.4 + Math.pow(rng(), 0.8) * spreadX);
      scatterOffsets[i3 + 1] = (rng() - 0.5) * 8.0;
      // Strictly behind all 3D models (z ~ 0), filmstrip (z = -2.25), and spiral reels
      scatterOffsets[i3 + 2] = -2.8 - rng() * 4.5;

      mixes[i] = lp.isRed ? 0.86 + rng() * 0.14 : 0.32 + rng() * 0.18;
      scales[i] = 0.75 + Math.pow(rng(), 1.3) * 0.6;
      seeds[i] = rng();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(logoCoords, 3));
    geo.setAttribute('aScatterOffset', new THREE.BufferAttribute(scatterOffsets, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aMix', new THREE.BufferAttribute(mixes, 1));
    return geo;
  }, [count, isMobile]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uGatherProgress: { value: 0 },
      uCamY: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uHalfWorldSize: { value: new THREE.Vector2(4.5, 2.8) },
      uPointerActive: { value: 0 },
      uLogoWidth: { value: 5.0 },
      uLogoY: { value: 1.5 },
      uLogoZ: { value: LOGO_Z },
      uLogoPointScale: { value: 0.0082 },
      uHalfBufferH: { value: 500 },
    }),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      materialRef.current?.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    const cam = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(delta, 1 / 30);

    // Responsive damping so particles begin dispersing immediately on first scroll
    const pLambda = 1 - Math.exp(-8.5 * dt);
    smoothedProgressRef.current = THREE.MathUtils.lerp(
      smoothedProgressRef.current,
      experienceState.scrollProgress,
      pLambda
    );
    smoothedGatherRef.current = THREE.MathUtils.lerp(
      smoothedGatherRef.current,
      experienceState.postPhotosLogoProgress,
      pLambda
    );

    // Frame the logo from the actual frustum at the logo's depth
    const distance = Math.max(1, cam.position.z - LOGO_Z);
    const visibleH = 2 * distance * Math.tan(THREE.MathUtils.degToRad(cam.fov * 0.5));
    const visibleW = visibleH * cam.aspect;
    const logoWidth = Math.min(visibleW * (isMobile ? 0.88 : 0.52), 5.2);
    const logoH = logoWidth * (EA_REC_LOGO_PATHS.viewBox.height / EA_REC_LOGO_PATHS.viewBox.width);
    // Center the mark in the upper band, keeping clear of the fixed header
    const logoY = Math.min(visibleH * 0.5 * 0.56, visibleH * 0.5 * 0.8 - logoH * 0.5);

    const logoPointScale = isMobile ? 0.0068 : 0.0052;

    state.gl.getDrawingBufferSize(drawSize);

    u.uTime.value = reducedMotion ? state.clock.elapsedTime * 0.25 : state.clock.elapsedTime;
    u.uProgress.value = smoothedProgressRef.current;
    u.uGatherProgress.value = smoothedGatherRef.current;
    u.uCamY.value = cam.position.y;
    u.uLogoWidth.value = logoWidth;
    u.uLogoY.value = logoY;
    u.uLogoPointScale.value = logoPointScale;
    u.uHalfBufferH.value = drawSize.y * 0.5;
    u.uMouse.value.set(experienceState.smoothedMouse.x, experienceState.smoothedMouse.y);
    u.uHalfWorldSize.value.set(visibleW * 0.5, visibleH * 0.5);
    u.uPointerActive.value = experienceState.smoothedPointerActive;
  });

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={-1}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
