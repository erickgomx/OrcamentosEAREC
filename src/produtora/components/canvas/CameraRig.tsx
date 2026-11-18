import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HARDWARE_RIGS, HardwareItem } from '../../data/portfolioData';
import { experienceState, useExperienceStore } from '../../hooks/useExperienceStore';
import { getPreloadedModel, usePreloaderStore } from '../../utils/assetPreloader';
import { ProceduralCinemaLens } from './ProceduralCinemaLens';

interface RigStationProps {
  rig: HardwareItem;
  isMobile: boolean;
  reducedMotion: boolean;
}

function RigStation({ rig, isMobile, reducedMotion }: RigStationProps) {
  const stationGroupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const keyLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);

  const { isReady, modelVersion } = usePreloaderStore();

  const preloadedScene = useMemo(() => {
    return getPreloadedModel(rig.id);
  }, [rig.id, modelVersion]);

  const posX = isMobile ? 0 : rig.worldPosition[0];
  const posY = isMobile ? rig.worldPosition[1] + 0.35 : rig.worldPosition[1];
  const posZ = rig.worldPosition[2];
  const scaleFactor = isMobile ? 0.72 : 1.05;

  useFrame((state, delta) => {
    // Keep visible during preloader GPU compile, then cull when camera is far away
    const distY = Math.abs(experienceState.cameraWaypoint.y - posY);
    const shouldRender = !isReady || distY < 5.8;
    const shouldLight = !isReady || distY < 4.5;

    if (stationGroupRef.current) {
      stationGroupRef.current.visible = shouldRender;
    }
    if (keyLightRef.current) {
      keyLightRef.current.visible = shouldLight;
    }
    if (rimLightRef.current) {
      rimLightRef.current.visible = shouldLight;
    }

    if (!shouldRender) return;

    const dt = Math.min(delta, 1 / 30);
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const lambda = 1 - Math.exp(-5.0 * dt);

    if (spinRef.current) {
      const baseYaw = rig.baseRotationY ?? 0;
      // On mobile, lock the 3D rig at its canonical front angle until the user scrolls
      const targetRotY = isMobile
        ? baseYaw
        : baseYaw +
          Math.sin(t * 0.65 + rig.index * 1.1) * 0.12 +
          (experienceState.cameraWaypoint.y - posY) * 0.12 +
          experienceState.smoothedMouse.x * 0.38;
      const targetRotX = isMobile
        ? 0.08
        : 0.12 +
          Math.sin(t * 0.6 + rig.index) * 0.06 -
          experienceState.smoothedMouse.y * 0.22;

      spinRef.current.rotation.y = THREE.MathUtils.lerp(
        spinRef.current.rotation.y,
        targetRotY,
        lambda
      );
      spinRef.current.rotation.x = THREE.MathUtils.lerp(
        spinRef.current.rotation.x,
        targetRotX,
        lambda
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={stationGroupRef} position={[posX, posY, posZ]} scale={scaleFactor}>
      <pointLight
        ref={keyLightRef}
        position={[1.5, 1.8, 2.5]}
        intensity={14}
        distance={9}
        color="#ffffff"
      />
      <pointLight
        ref={rimLightRef}
        position={[-1.8, -1.2, 1.8]}
        intensity={8}
        distance={8}
        color="#FF0829"
      />

      <mesh ref={ringRef} position={[0, -1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 12, 72]} />
        <meshStandardMaterial
          color="#FF0829"
          emissive="#FF1E1E"
          emissiveIntensity={2.0}
          toneMapped={false}
        />
      </mesh>

      <group ref={spinRef} rotation={[0, rig.baseRotationY ?? 0, 0]}>
        {preloadedScene ? (
          <primitive object={preloadedScene} dispose={null} />
        ) : (
          <ProceduralCinemaLens scale={1.0} />
        )}
      </group>
    </group>
  );
}

/**
 * Renders all 3 preloaded, mesh-merged 3D equipment stations along Y
 * (-7.0, -13.5, -20.0) with automatic distance visibility & light culling per station.
 */
export function CameraRig() {
  const { isMobile, reducedMotion } = useExperienceStore();

  return (
    <group>
      {HARDWARE_RIGS.map((rig) => (
        <RigStation
          key={rig.id}
          rig={rig}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}
