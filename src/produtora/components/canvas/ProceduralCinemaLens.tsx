import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { experienceState, useExperienceStore } from '../../hooks/useExperienceStore';

interface ProceduralCinemaLensProps {
  visible?: boolean;
  scale?: number;
}

/**
 * Procedural 3D Cinema Prime Lens with anodized metallic rings,
 * 8 dynamic iris blades driven by scroll, physical glass element,
 * and an emissive #FF0829 REC tally ring.
 * Serves both as a zero-crash fallback for GLB loads and as Rig #4.
 */
export function ProceduralCinemaLens({
  visible = true,
  scale = 1,
}: ProceduralCinemaLensProps) {
  const { reducedMotion } = useExperienceStore();
  const groupRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Mesh[]>([]);
  const focusRingRef = useRef<THREE.Mesh>(null);

  const bladeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.46, 0.08);
    shape.lineTo(0.42, 0.34);
    shape.lineTo(0.05, 0.24);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  const bladeAngles = useMemo(
    () => Array.from({ length: 8 }, (_, idx) => (idx / 8) * Math.PI * 2),
    []
  );

  useEffect(() => {
    return () => {
      bladeGeometry.dispose();
    };
  }, [bladeGeometry]);

  useFrame((state, delta) => {
    if (!visible || !groupRef.current) return;
    const dt = Math.min(delta, 1 / 30);
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const progress = experienceState.scrollProgress;

    const targetRotY = progress * Math.PI * 3.2 + experienceState.smoothedMouse.x * 0.45;
    const targetRotX = 0.25 + experienceState.smoothedMouse.y * 0.28;
    const lambda = 1 - Math.exp(-5.5 * dt);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY + Math.sin(t * 0.45) * 0.12,
      lambda
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      lambda
    );

    if (focusRingRef.current) {
      focusRingRef.current.rotation.z = progress * Math.PI * 2.0;
    }

    // Dynamic iris aperture oscillation synced to scroll + subtle breathing
    const aperture = 0.24 + Math.sin(progress * Math.PI * 6 + t * 0.9) * 0.14;
    bladesRef.current.forEach((blade, idx) => {
      if (!blade) return;
      const baseAngle = (idx / 8) * Math.PI * 2;
      blade.rotation.z = baseAngle + aperture;
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} scale={scale}>
      {/* Outer anodized barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.18, 1.24, 1.35, 48, 1, true]} />
        <meshStandardMaterial
          color="#121110"
          metalness={0.88}
          roughness={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rear mounting flange */}
      <mesh position={[0, 0, -0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.96, 0.92, 0.24, 40]} />
        <meshStandardMaterial color="#1f1e1d" metalness={0.92} roughness={0.22} />
      </mesh>

      {/* Knurled focus gear ring */}
      <mesh ref={focusRingRef} position={[0, 0, 0.08]}>
        <torusGeometry args={[1.22, 0.075, 16, 48]} />
        <meshStandardMaterial color="#2a2826" metalness={0.82} roughness={0.38} />
      </mesh>

      {/* Emissive REC red cinema ring (drives Bloom) */}
      <mesh position={[0, 0, 0.44]}>
        <torusGeometry args={[1.18, 0.024, 16, 64]} />
        <meshStandardMaterial
          color="#FF0829"
          emissive="#FF1E1E"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* Front hood bevel */}
      <mesh position={[0, 0, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.28, 1.18, 0.22, 48, 1, true]} />
        <meshStandardMaterial
          color="#0a0909"
          metalness={0.85}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dynamic 8-blade iris diaphragm */}
      <group position={[0, 0, 0.14]}>
        {bladeAngles.map((angle, idx) => (
          <mesh
            key={angle}
            ref={(el) => {
              if (el) bladesRef.current[idx] = el;
            }}
            geometry={bladeGeometry}
            position={[Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, idx * 0.002]}
            rotation={[0, 0, angle]}
          >
            <meshStandardMaterial
              color="#1b1a19"
              metalness={0.75}
              roughness={0.42}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Optical front glass lens element */}
      <mesh position={[0, 0, 0.42]} scale={[1, 1, 0.22]}>
        <sphereGeometry args={[0.98, 40, 24]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          opacity={1}
          transparent
          roughness={0.04}
          metalness={0.05}
          ior={1.56}
          thickness={0.55}
          reflectivity={0.95}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Inner amber/red anti-reflective optical core glint */}
      <mesh position={[0, 0, -0.15]}>
        <circleGeometry args={[0.72, 36]} />
        <meshStandardMaterial
          color="#160306"
          emissive="#FF0829"
          emissiveIntensity={0.45}
          roughness={0.18}
          metalness={0.85}
        />
      </mesh>
    </group>
  );
}
