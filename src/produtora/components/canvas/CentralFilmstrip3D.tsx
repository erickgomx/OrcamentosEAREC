import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HARDWARE_RIGS } from '../../data/portfolioData';
import { experienceState, useExperienceStore } from '../../hooks/useExperienceStore';
import { PERF_TIER } from '../../utils/devicePerf';

const FILMSTRIP_VERTEX_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying float vWorldY;

uniform float uTime;
uniform float uVelocity;
uniform vec2 uMouse;
uniform float uCurveAmp;

void main() {
  vUv = uv;
  vec3 pos = position;

  vec4 worldBefore = modelMatrix * vec4(pos, 1.0);
  float wy = worldBefore.y;

  // S-curve path following the 3 alternating 3D hardware stations:
  // Y = -7.0 (Sony, Left) -> Y = -13.5 (Canon, Right) -> Y = -20.0 (DJI, Left)
  float stationEnv = smoothstep(-0.5, -5.5, wy) * (1.0 - smoothstep(-21.5, -26.5, wy));
  float rigCurve = -cos((wy + 7.0) * (3.14159265 / 6.5)) * uCurveAmp * stationEnv;

  // Pronounced organic S-wave across the full vertical ribbon
  float wave = sin(wy * 0.38 + uTime * 0.45) * 0.32;
  float twist = cos(wy * 0.24 - uTime * 0.35) * 0.20;
  float velPull = clamp(uVelocity, -35.0, 35.0) * 0.008;

  pos.x += rigCurve + wave + uMouse.x * 0.14 * sin(wy * 0.25);
  pos.z += sin(uv.x * 3.14159265) * 0.08 + twist + velPull * sin(wy * 0.5);

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldY = worldPos.y;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const FILMSTRIP_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying float vWorldY;

uniform float uTime;
uniform float uCamY;
uniform float uProgress;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  // Continuous vertical motion synced slightly with scroll + world Y
  float filmY = vWorldY * 1.15 - uProgress * 2.5;
  float frameIdx = floor(filmY);
  float cellY = fract(filmY); // 0..1 within one 35mm frame

  // Left & right sprocket perforation rails
  float edgeX = abs(vUv.x - 0.5) * 2.0; // 0 at center, 1 at outer border

  // 4 sprocket holes per film frame along outer rails (edgeX in 0.72..0.90)
  float holeRepeatY = fract(filmY * 4.0) - 0.5;
  float holeDistX = abs(vUv.x - 0.5) - 0.415; // centered at uv.x = 0.085 and 0.915
  vec2 holeCoord = vec2(holeDistX * 1.15, holeRepeatY * 0.215);
  float dHole = sdRoundBox(holeCoord, vec2(0.036, 0.052), 0.012);
  float aa = max(fwidth(dHole), 0.002);
  float holeMask = 1.0 - smoothstep(-aa, aa, dHole);

  // Optical crimson sound track near left edge
  float trackMask = smoothstep(0.148, 0.143, vUv.x) * smoothstep(0.122, 0.127, vUv.x);
  float trackWave = 0.5 + 0.5 * sin(vWorldY * 14.0 + uTime * 3.0) * cos(vWorldY * 5.0);

  // Frame border & divider bars
  float innerX = smoothstep(0.16, 0.175, vUv.x) * smoothstep(0.84, 0.825, vUv.x);
  float innerY = smoothstep(0.05, 0.07, cellY) * smoothstep(0.95, 0.93, cellY);
  float innerWindow = innerX * innerY;

  // Subtle negative celluloid shading + sprocket border
  vec3 baseFilm = vec3(0.055, 0.050, 0.048);
  vec3 windowFilm = vec3(0.025, 0.024, 0.025);
  vec3 color = mix(baseFilm, windowFilm, innerWindow);

  // Subtle scanlines inside frame windows
  float scan = 0.88 + 0.12 * sin(vWorldY * 48.0 + frameIdx * 1.7);
  color *= mix(1.0, scan, innerWindow);

  // Camera focal reader beam (glows crimson around uCamY)
  float camDist = abs(vWorldY - uCamY);
  float focusBeam = exp(-camDist * 0.36);
  float finePlayhead = exp(-camDist * 3.8);

  vec3 recRed = vec3(1.0, 0.035, 0.165); // #FF0829
  vec3 warmWhite = vec3(0.96, 0.95, 0.94);

  // Highlight frame borders & optical track near active camera position
  float frameOutline = (1.0 - innerWindow) * step(0.15, vUv.x) * step(vUv.x, 0.85);
  color += recRed * trackMask * (0.28 + 0.72 * trackWave) * (0.35 + focusBeam * 0.95);
  color += recRed * frameOutline * focusBeam * 0.32;
  color += mix(recRed, warmWhite, 0.35) * finePlayhead * (1.0 - holeMask) * 0.65;

  // Softly duck opacity behind center-screen cards (Portal Y=0, Post Y=-26.5, Gallery Y=-32.5, Photos Y=-38, CTA Y=-44)
  float portalDuck = 1.0 - 0.45 * exp(-pow((vWorldY - 0.0) * 0.35, 2.0));
  float postDuck = 1.0 - 0.5 * exp(-pow((vWorldY + 26.5) * 0.32, 2.0));
  float galleryDuck = 1.0 - 0.55 * exp(-pow((vWorldY + 32.5) * 0.3, 2.0));
  float photosDuck = 1.0 - 0.55 * exp(-pow((vWorldY + 38.0) * 0.3, 2.0));
  float ctaDuck = 1.0 - 0.48 * exp(-pow((vWorldY + 44.0) * 0.35, 2.0));
  float duckFactor = portalDuck * postDuck * galleryDuck * photosDuck * ctaDuck;

  // Fade outer ends cleanly
  float topEnd = smoothstep(3.5, 1.0, vWorldY);
  float botEnd = smoothstep(-46.5, -44.0, vWorldY);

  float baseAlpha = mix(0.62, 0.32, innerWindow);
  float finalAlpha = baseAlpha * (0.55 + 0.45 * focusBeam) * duckFactor * topEnd * botEnd;

  // Punch transparent holes for 35mm perforations
  finalAlpha *= (1.0 - holeMask);

  // Subtle edge vignette
  finalAlpha *= smoothstep(1.0, 0.94, edgeX);

  gl_FragColor = vec4(color, clamp(finalAlpha, 0.0, 0.92));
}
`;

/**
 * Continuous 35mm Central Filmstrip spanning from Act 1 (Y = +3.5) to Act 5 (Y = -40.5),
 * guiding the user's descent with sprocket perforations, an optical REC reader beam
 * tracking the camera Y position, and horizontal station connectors to each 3D rig.
 */
export function CentralFilmstrip3D() {
  const { isMobile, reducedMotion } = useExperienceStore();
  const stripMeshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const connectorsRef = useRef<THREE.Group>(null);
  const stationGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const lineGroupRefs = useRef<(THREE.Group | null)[]>([]);

  const stripGeometry = useMemo(() => {
    const width = isMobile ? 0.85 : 1.18;
    const isLightTier = isMobile || PERF_TIER !== 'high';
    return new THREE.PlaneGeometry(
      width,
      50,
      isLightTier ? 10 : 16,
      isLightTier ? 160 : 290
    );
  }, [isMobile]);

  const connectorLineGeo = useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCamY: { value: 0 },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uCurveAmp: { value: 1.15 },
    }),
    []
  );

  useEffect(() => {
    return () => {
      stripGeometry.dispose();
      connectorLineGeo.dispose();
      materialRef.current?.dispose();
    };
  }, [stripGeometry, connectorLineGeo]);

  useFrame((state) => {
    const camY = experienceState.cameraWaypoint.y;
    const isFilmstripVisible = camY >= -39.5;
    if (stripMeshRef.current) {
      stripMeshRef.current.visible = isFilmstripVisible;
    }
    if (connectorsRef.current) {
      connectorsRef.current.visible = !isMobile && isFilmstripVisible;
    }
    if (!isFilmstripVisible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const vel = experienceState.smoothedVelocity;
    const mouseX = experienceState.smoothedMouse.x;
    const curveAmp = isMobile ? 0.55 : 1.15;

    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uCamY.value = camY;
      mat.uniforms.uProgress.value = experienceState.scrollProgress;
      mat.uniforms.uVelocity.value = vel;
      mat.uniforms.uCurveAmp.value = curveAmp;
      mat.uniforms.uMouse.value.set(mouseX, experienceState.smoothedMouse.y);
    }

    if (!isMobile) {
      const velPull = Math.max(-35.0, Math.min(35.0, vel)) * 0.008;

      HARDWARE_RIGS.forEach((rig, idx) => {
        const stationEl = stationGroupRefs.current[idx];
        const lineEl = lineGroupRefs.current[idx];
        if (!stationEl) return;

        const wy = rig.worldPosition[1];
        const rigCurve = -Math.cos((wy + 7.0) * (Math.PI / 6.5)) * curveAmp;
        const wave = Math.sin(wy * 0.38 + t * 0.45) * 0.32;
        const twist = Math.cos(wy * 0.24 - t * 0.35) * 0.2;

        const stripX = rigCurve + wave + mouseX * 0.14 * Math.sin(wy * 0.25);
        const stripZ = -2.25 + 0.08 + twist + velPull * Math.sin(wy * 0.5) + 0.02;

        stationEl.position.set(stripX, wy, stripZ);

        if (lineEl) {
          const dx = (rig.worldPosition[0] - stripX) * 0.65;
          const dz = (rig.worldPosition[2] - stripZ) * 0.45;
          lineEl.scale.set(dx, 1, dz);
        }
      });
    }
  });

  return (
    <group>
      {/* Main Vertical 35mm Celluloid Ribbon centered at X=0, Z=-2.25 */}
      <mesh
        ref={stripMeshRef}
        geometry={stripGeometry}
        position={[0, -21.5, -2.25]}
        frustumCulled={false}
      >
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={FILMSTRIP_VERTEX_SHADER}
          fragmentShader={FILMSTRIP_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Station Keyframe Nodes & Horizontal Branches to each Desktop 3D Rig */}
      <group ref={connectorsRef}>
        {HARDWARE_RIGS.map((rig, idx) => {
          const y = rig.worldPosition[1];
          const dir = rig.worldPosition[0] < 0 ? -1 : 1;
          return (
            <group
              key={rig.id}
              ref={(el) => {
                stationGroupRefs.current[idx] = el;
              }}
              position={[0, y, -2.1]}
            >
              {/* Emissive center frame node */}
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <ringGeometry args={[0.07, 0.11, 4]} />
                <meshBasicMaterial color="#FF0829" toneMapped={false} />
              </mesh>

              {/* Optical branch line pointing toward the 3D camera/drone */}
              <group
                ref={(el) => {
                  lineGroupRefs.current[idx] = el;
                }}
                scale={[dir, 1, 1]}
              >
                <lineSegments geometry={connectorLineGeo}>
                  <lineBasicMaterial
                    color="#FF0829"
                    transparent
                    opacity={0.45}
                  />
                </lineSegments>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}
