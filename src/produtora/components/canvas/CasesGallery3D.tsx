import { useEffect, useMemo, useRef, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CaseItem, PORTFOLIO_CASES } from '../../data/portfolioData';
import {
  experienceState,
  setHoveredCaseId,
  setModalCase,
  setReelBufferingState,
  useExperienceStore,
} from '../../hooks/useExperienceStore';
import { TEXTURE_PATHS } from '../../utils/assetPaths';
import { usePreloaderStore } from '../../utils/assetPreloader';
import { disposeVideoElement } from '../../utils/dispose';
import {
  createProceduralDisplacementTexture,
  createProceduralPosterTexture,
  loadTextureWithFallback,
} from '../../utils/proceduralFallbacks';

const SPIRAL_VERTEX_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uVelocity;
uniform float uHover;
uniform float uFocus;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Gentle scroll-velocity curvature while traveling along the 3D spiral
  float vel = clamp(uVelocity, -35.0, 35.0) * 0.008;
  pos.z += sin(uv.y * 3.14159265 + uTime * 2.0) * vel;
  pos.z += sin(uv.x * 3.14159265) * 0.045 * uHover * uFocus;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const SPIRAL_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uDisplacementMap;
uniform float uTime;
uniform float uVelocity;
uniform float uHover;
uniform float uFocus;
uniform float uOpacity;
uniform float uLoading;

void main() {
  vec2 uv = vUv;

  // Subtle liquid edge motion only during fast scroll or hover
  float disp = texture2D(uDisplacementMap, uv * 1.1 + vec2(uTime * 0.03, -uTime * 0.02)).r - 0.5;
  float velWarp = clamp(abs(uVelocity) * 0.0009, 0.0, 0.024);
  vec2 warpedUv = clamp(uv + vec2(disp * velWarp, disp * velWarp * 0.6), 0.001, 0.999);

  float rgbShift = velWarp * 0.45;
  float r = texture2D(uTexture, clamp(warpedUv + vec2(rgbShift, 0.0), 0.001, 0.999)).r;
  float g = texture2D(uTexture, warpedUv).g;
  float b = texture2D(uTexture, clamp(warpedUv - vec2(rgbShift, 0.0), 0.001, 0.999)).b;
  vec3 videoColor = vec3(r, g, b);

  // Full native brightness on center focused card; softer dimming on background spiral cards
  float brightness = mix(0.45, 1.0, clamp(uFocus + uHover * 0.3, 0.0, 1.0));
  vec3 color = videoColor * brightness;

  // Subtle dark slate overlay + animated crimson REC spinner ring while buffering
  vec2 centered = uv - 0.5;
  float dist = length(centered);
  float angle = atan(centered.y, centered.x);
  float ringBand = smoothstep(0.11, 0.095, dist) * smoothstep(0.065, 0.08, dist);
  float arcSweep = smoothstep(-0.2, 0.7, sin(angle + uTime * 5.2));
  vec3 spinnerGlow = vec3(1.0, 0.035, 0.165) * ringBand * arcSweep * 1.4;
  color = mix(color, color * 0.45 + spinnerGlow, uLoading);

  // Crisp glowing REC frame border around focused / hovered card
  float frameDist = max(abs(uv.x - 0.5) * 2.0, abs(uv.y - 0.5) * 2.0);
  float borderMask = smoothstep(0.976, 0.995, frameDist);
  vec3 borderColor = mix(vec3(0.35, 0.35, 0.38), vec3(1.0, 0.035, 0.165) * 1.25, clamp(uFocus + uHover, 0.0, 1.0));
  color = mix(color, borderColor, borderMask * 0.85);

  gl_FragColor = vec4(color, uOpacity);
}
`;

interface SpiralVideoCardProps {
  item: CaseItem;
  index: number;
  displacementTexture: THREE.Texture;
  isMobile: boolean;
  reducedMotion: boolean;
  isAudioMuted: boolean;
  hasModalOpen: boolean;
  isPreloaderReady: boolean;
}

function SpiralVideoCard({
  item,
  index,
  displacementTexture,
  isMobile,
  reducedMotion,
  isAudioMuted,
  hasModalOpen,
  isPreloaderReady,
}: SpiralVideoCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);
  const hoverValueRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const isLoadingRef = useRef(1);
  const [videoActivated, setVideoActivated] = useState(false);
  const videoActivatedRef = useRef(false);

  const posterTexture = useMemo(
    () => createProceduralPosterTexture(item.title, item.category, item.code),
    [item.title, item.category, item.code]
  );

  // Exact aspect-ratio geometry: 16:9 widescreen, 3:4 editorial portrait, or 9:16 vertical
  const geometry = useMemo(() => {
    if (item.aspect === '16:9') {
      return isMobile
        ? new THREE.PlaneGeometry(2.15, 1.21, 10, 8)
        : new THREE.PlaneGeometry(3.2, 1.8, 28, 20);
    }
    if (item.aspect === '3:4') {
      return isMobile
        ? new THREE.PlaneGeometry(1.5, 2.0, 10, 12)
        : new THREE.PlaneGeometry(1.92, 2.56, 26, 30);
    }
    return isMobile
      ? new THREE.PlaneGeometry(1.18, 2.1, 8, 12)
      : new THREE.PlaneGeometry(1.48, 2.63, 24, 32);
  }, [item.aspect, isMobile]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: posterTexture },
          uDisplacementMap: { value: displacementTexture },
          uTime: { value: 0 },
          uVelocity: { value: 0 },
          uHover: { value: 0 },
          uFocus: { value: 1 },
          uOpacity: { value: 0 },
          uLoading: { value: 1 },
        },
        vertexShader: SPIRAL_VERTEX_SHADER,
        fragmentShader: SPIRAL_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [posterTexture, displacementTexture]
  );

  useEffect(() => {
    material.uniforms.uDisplacementMap.value = displacementTexture;
  }, [displacementTexture, material]);

  useEffect(() => {
    // Wait until Preloader opens AND user approaches the gallery before streaming MP4s
    if (!isPreloaderReady || !videoActivated) return;

    let active = true;
    setReelBufferingState(item.id, true);
    isLoadingRef.current = 1;

    const video = document.createElement('video');
    video.src = item.videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    videoRef.current = video;

    const markReady = () => {
      if (!active) return;
      if (!videoTextureRef.current) {
        const vTex = new THREE.VideoTexture(video);
        vTex.minFilter = THREE.LinearFilter;
        vTex.magFilter = THREE.LinearFilter;
        vTex.colorSpace = THREE.SRGBColorSpace;
        vTex.generateMipmaps = false;
        vTex.needsUpdate = true;
        videoTextureRef.current = vTex;
        material.uniforms.uTexture.value = vTex;
      }
      isLoadingRef.current = 0;
      setReelBufferingState(item.id, false);
    };

    const markBuffering = () => {
      if (!active) return;
      isLoadingRef.current = 1;
      setReelBufferingState(item.id, true);
    };

    const handleError = () => {
      if (!active) return;
      isLoadingRef.current = 0;
      setReelBufferingState(item.id, false);
      material.uniforms.uTexture.value = posterTexture;
    };

    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    video.addEventListener('playing', markReady);
    video.addEventListener('waiting', markBuffering);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      active = false;
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
      video.removeEventListener('playing', markReady);
      video.removeEventListener('waiting', markBuffering);
      video.removeEventListener('error', handleError);
      disposeVideoElement(video);
      videoTextureRef.current?.dispose();
      videoTextureRef.current = null;
      videoRef.current = null;
    };
  }, [isPreloaderReady, videoActivated, item.id, item.videoUrl, material, posterTexture]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      posterTexture.dispose();
      material.dispose();
    };
  }, [geometry, posterTexture, material]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dt = Math.min(delta, 1 / 30);
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const lambda = 1 - Math.exp(-8.5 * dt);

    // Distance from gallery focus Y (-32.5)
    const distFromGalleryY = Math.abs(experienceState.cameraWaypoint.y - (-32.5));
    const sectionVisibility = 1 - THREE.MathUtils.smoothstep(distFromGalleryY, 3.0, 5.8);

    // Relative position along the 5-card spiral: rel = 0 is dead center
    const rel = index - experienceState.gallerySpiralProgress;

    // Sequential 1-by-1 reveal as user scrolls down:
    // Cards below (rel > 0) fade in smoothly between rel 1.90 -> 0.55
    // Cards above (rel < 0) fade out smoothly between rel -0.45 -> -1.45
    const enterAlpha = 1 - THREE.MathUtils.smoothstep(rel, 0.55, 1.9);
    const exitAlpha = THREE.MathUtils.smoothstep(rel, -1.45, -0.45);
    const cardOpacity = enterAlpha * exitAlpha * sectionVisibility;

    mesh.visible = cardOpacity > 0.015;

    // 3D Helical Spiral Coordinates around (0, 0, 0) inside the Y = -32.5 stage
    const theta = rel * 1.05;
    const radiusX = isMobile ? 1.15 : 2.55;
    const targetX = Math.sin(theta) * radiusX;
    const targetY = -rel * (isMobile ? 1.25 : 1.45) + (hoverValueRef.current * 0.08);
    const targetZ =
      1.15 -
      (1 - Math.cos(theta)) * 1.45 -
      Math.abs(rel) * 0.72 +
      hoverValueRef.current * 0.25;
    const targetRotY = -theta * 0.42;

    hoverValueRef.current = THREE.MathUtils.lerp(
      hoverValueRef.current,
      hoveredRef.current ? 1 : 0,
      lambda
    );

    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, lambda);
    mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, lambda);
    mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, lambda);
    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotY, lambda);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, -rel * 0.035, lambda);

    const focus = THREE.MathUtils.clamp(1 - Math.abs(rel) * 0.85, 0, 1);
    const scaleTarget = 0.86 + focus * 0.14 + hoverValueRef.current * 0.04;
    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, scaleTarget, lambda));

    // Lazy-activate video streaming only when user scrolls near the gallery
    if (
      !videoActivatedRef.current &&
      isPreloaderReady &&
      (distFromGalleryY < 14 || experienceState.scrollProgress > 0.28) &&
      (index <= 1 || Math.abs(rel) < 1.8)
    ) {
      videoActivatedRef.current = true;
      setVideoActivated(true);
    }

    // Playback & audio sync for spiral cards: decode/play only the active/adjacent card to avoid multi-HD video stalls
    const v = videoRef.current;
    if (v) {
      const shouldPlay =
        mesh.visible &&
        !hasModalOpen &&
        Math.abs(rel) < 0.68 &&
        sectionVisibility > 0.25;
      const isCenterFocused = Math.abs(rel) < 0.42 && sectionVisibility > 0.6;
      v.muted = isAudioMuted || !isCenterFocused || hasModalOpen;

      if (shouldPlay && v.paused && v.readyState >= 2) {
        v.play().catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
      } else if (!shouldPlay && !v.paused) {
        v.pause();
      }
    }

    material.uniforms.uTime.value = t;
    material.uniforms.uVelocity.value = experienceState.smoothedVelocity;
    material.uniforms.uHover.value = hoverValueRef.current;
    material.uniforms.uFocus.value = focus;
    material.uniforms.uOpacity.value = cardOpacity;
    material.uniforms.uLoading.value = THREE.MathUtils.lerp(
      material.uniforms.uLoading.value,
      isLoadingRef.current,
      lambda
    );
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!meshRef.current?.visible) return;
    e.stopPropagation();
    hoveredRef.current = true;
    document.body.style.cursor = 'pointer';
    setHoveredCaseId(item.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoveredRef.current = false;
    document.body.style.cursor = 'auto';
    setHoveredCaseId(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!meshRef.current?.visible) return;
    e.stopPropagation();
    setModalCase(item);
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

/**
 * Act 4 (Y = -32.5): Interactive 3D Spiral Gallery revealing all 5 Reels 1 by 1
 * as the user scrolls down through #act-gallery.
 */
export function CasesGallery3D() {
  const { isMobile, reducedMotion, isAudioMuted, modalCase } = useExperienceStore();
  const { isReady } = usePreloaderStore();
  const [displacementTexture, setDisplacementTexture] = useState<THREE.Texture>(() =>
    createProceduralDisplacementTexture()
  );

  useEffect(() => {
    let activeTexture = displacementTexture;
    const cancelLoad = loadTextureWithFallback(
      TEXTURE_PATHS.displacementMap,
      () => activeTexture,
      (loaded) => {
        if (loaded !== activeTexture) {
          const prev = activeTexture;
          activeTexture = loaded;
          setDisplacementTexture(loaded);
          prev.dispose();
        }
      }
    );

    return () => {
      cancelLoad();
      activeTexture.dispose();
      document.body.style.cursor = 'auto';
    };
    // Run once on mount to load external displacement texture safely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group position={[0, -32.5, 0]}>
      {PORTFOLIO_CASES.map((item, idx) => (
        <SpiralVideoCard
          key={item.id}
          item={item}
          index={idx}
          displacementTexture={displacementTexture}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          isAudioMuted={isAudioMuted}
          hasModalOpen={Boolean(modalCase)}
          isPreloaderReady={isReady}
        />
      ))}
    </group>
  );
}
