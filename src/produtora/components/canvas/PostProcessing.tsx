import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { experienceState, useExperienceStore } from '../../hooks/useExperienceStore';

/**
 * Post-processing pipeline with selective Bloom for emissive #FF0829 REC accents,
 * dynamic ChromaticAberration driven by scroll velocity, film Noise, and Vignette.
 * Auto-throttles off on viewports < 768px or prefers-reduced-motion to lock 60 FPS.
 */
export function PostProcessing() {
  const { isMobile, reducedMotion } = useExperienceStore();
  const offsetVec = useMemo(() => new THREE.Vector2(0.0005, 0.0005), []);
  const chromaticRef = useRef<{ offset: THREE.Vector2 } | null>(null);

  useFrame(() => {
    if (isMobile || reducedMotion || !chromaticRef.current) return;
    const vel = Math.min(Math.abs(experienceState.smoothedVelocity) * 0.00018, 0.0042);
    const base = 0.00045;
    chromaticRef.current.offset.set(base + vel, base + vel * 0.65);
  });

  if (isMobile || reducedMotion) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.72}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <ChromaticAberration
        ref={chromaticRef as never}
        offset={offsetVec}
        radialModulation
        modulationOffset={0.25}
      />
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
    </EffectComposer>
  );
}
