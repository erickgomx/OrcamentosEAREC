import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { experienceState, useExperienceStore } from '../../hooks/useExperienceStore';
import { notifyGpuReady, usePreloaderStore } from '../../utils/assetPreloader';
import { PERF_MAX_DPR, PERF_TIER } from '../../utils/devicePerf';
import { CameraRig } from './CameraRig';
import { CasesGallery3D } from './CasesGallery3D';
import { CentralFilmstrip3D } from './CentralFilmstrip3D';
import { ParticlesField } from './ParticlesField';
import { PostProcessing } from './PostProcessing';

/**
 * Generates an offline PMREM studio environment map so PBR metallic materials
 * on the Sony, Canon, and DJI 3D models reflect clean studio highlights instead of black.
 */
function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.85;

    return () => {
      scene.environment = null;
      envTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}

/**
 * Pre-compiles shaders & uploads textures for all mounted 3D models
 * while the Preloader curtain is still covering the viewport, avoiding first-scroll hitches.
 */
function GpuPrecompiler() {
  const { gl, scene, camera, invalidate } = useThree();
  const { assetsLoaded } = usePreloaderStore();
  const compiledRef = useRef(false);

  useEffect(() => {
    if (!assetsLoaded || compiledRef.current) return;

    let raf1 = 0;
    let raf2 = 0;
    let raf3 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        compiledRef.current = true;
        try {
          gl.compile(scene, camera);
        } catch {
          // Ignore edge cases if context is not yet active
        }
        // Trigger a warm-up render pass (including EffectComposer) while the curtain is closed
        invalidate();
        raf3 = requestAnimationFrame(() => {
          invalidate();
          notifyGpuReady();
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
    };
  }, [assetsLoaded, gl, scene, camera, invalidate]);

  return null;
}

function VerticalCameraChoreography() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const cursorLightRef = useRef<THREE.PointLight>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 6.8));
  const lookAtGoal = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const { isMobile, reducedMotion } = useExperienceStore();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);

    const velLambda = 1 - Math.exp(-7.5 * dt);
    experienceState.smoothedVelocity = THREE.MathUtils.lerp(
      experienceState.smoothedVelocity,
      experienceState.scrollVelocity,
      velLambda
    );
    experienceState.scrollVelocity *= Math.exp(-6.0 * dt);

    const mouseLambda = 1 - Math.exp(-6.0 * dt);
    experienceState.smoothedMouse.x = THREE.MathUtils.lerp(
      experienceState.smoothedMouse.x,
      experienceState.mousePosition.x,
      mouseLambda
    );
    experienceState.smoothedMouse.y = THREE.MathUtils.lerp(
      experienceState.smoothedMouse.y,
      experienceState.mousePosition.y,
      mouseLambda
    );
    experienceState.smoothedPointerActive = THREE.MathUtils.lerp(
      experienceState.smoothedPointerActive,
      experienceState.pointerActive,
      mouseLambda
    );

    const wp = experienceState.cameraWaypoint;
    const parallaxAmp = reducedMotion ? 0 : isMobile ? 0.16 : 0.42;

    targetPos.current.set(
      wp.x + experienceState.smoothedMouse.x * parallaxAmp,
      wp.y + experienceState.smoothedMouse.y * (parallaxAmp * 0.55),
      wp.z
    );
    lookAtGoal.current.set(
      wp.lookX + experienceState.smoothedMouse.x * 0.18,
      wp.lookY + experienceState.smoothedMouse.y * 0.12,
      wp.lookZ
    );

    if (cameraRef.current) {
      const camLambda = 1 - Math.exp(-6.2 * dt);
      cameraRef.current.position.lerp(targetPos.current, camLambda);
      currentLookAt.current.lerp(lookAtGoal.current, camLambda);
      cameraRef.current.lookAt(currentLookAt.current);
    }

    if (cursorLightRef.current) {
      const lightLambda = 1 - Math.exp(-7.0 * dt);
      const lx = wp.lookX + experienceState.smoothedMouse.x * 4.0;
      const ly = wp.lookY + experienceState.smoothedMouse.y * 2.5;
      const lz = 3.2;
      cursorLightRef.current.position.x = THREE.MathUtils.lerp(
        cursorLightRef.current.position.x,
        lx,
        lightLambda
      );
      cursorLightRef.current.position.y = THREE.MathUtils.lerp(
        cursorLightRef.current.position.y,
        ly,
        lightLambda
      );
      cursorLightRef.current.position.z = THREE.MathUtils.lerp(
        cursorLightRef.current.position.z,
        lz,
        lightLambda
      );
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={80}
        position={[0, 0, 6.8]}
      />
      <pointLight
        ref={cursorLightRef}
        color="#FF1E1E"
        intensity={12}
        distance={14}
        decay={1.7}
        position={[0, 0, 3.2]}
      />
    </>
  );
}

function FrameloopKicker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const frameloop = useThree((s) => s.frameloop);

  useEffect(() => {
    if (!active || frameloop !== 'always') return;
    invalidate();
    const raf = requestAnimationFrame(() => invalidate());
    const onVisible = () => {
      if (!document.hidden) invalidate();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [active, frameloop, invalidate]);

  return null;
}

function SoftwareGlInvalidator({
  active,
  isReady,
}: {
  active: boolean;
  isReady: boolean;
}) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (!active) return;
    invalidate();
    const onInput = () => invalidate();
    window.addEventListener('scroll', onInput, { passive: true });
    window.addEventListener('pointermove', onInput, { passive: true });
    return () => {
      window.removeEventListener('scroll', onInput);
      window.removeEventListener('pointermove', onInput);
    };
  }, [active, isReady, invalidate]);

  return null;
}

export function SceneContainer() {
  const maxDpr = PERF_MAX_DPR[PERF_TIER];
  const [dpr, setDpr] = useState(maxDpr);
  const dprRef = useRef(maxDpr);
  const [postFx, setPostFx] = useState(PERF_TIER === 'high');
  const [isSoftwareGl, setIsSoftwareGl] = useState(false);
  const { isReady, assetsLoaded } = usePreloaderStore();

  const { isMobile } = useExperienceStore();

  return (
    <div
      className={`fixed inset-0 z-0 ${
        isMobile ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      <Canvas
        frameloop={isReady && !isSoftwareGl ? 'always' : 'demand'}
        style={{ touchAction: 'pan-y' }}
        dpr={dpr}
        gl={{
          antialias: PERF_TIER === 'high',
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          try {
            const rawGl = gl.getContext();
            const debugInfo = rawGl.getExtension('WEBGL_debug_renderer_info');
            const renderer = debugInfo
              ? String(rawGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? '')
              : String(rawGl.getParameter(rawGl.RENDERER) ?? '');
            if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
              dprRef.current = 1;
              setDpr(1);
              setPostFx(false);
              setIsSoftwareGl(true);
            }
          } catch {
            // Ignore WebGL parameter inspection errors
          }
        }}
      >
        {/* Adaptive quality: lowers DPR, then disables post FX if FPS keeps dropping */}
        <PerformanceMonitor
          bounds={() => [45, 58]}
          flipflops={1}
          onDecline={() => {
            if (dprRef.current > 1) {
              dprRef.current = Math.max(1, dprRef.current - 0.25);
              setDpr(dprRef.current);
            } else {
              setPostFx(false);
            }
          }}
          onIncline={() => {
            dprRef.current = Math.min(maxDpr, dprRef.current + 0.25);
            setDpr(dprRef.current);
          }}
          onFallback={() => {
            dprRef.current = 1;
            setDpr(1);
            setPostFx(false);
          }}
        />

        <color attach="background" args={['#030303']} />
        <fogExp2 attach="fog" args={['#030303', 0.018]} />

        <StudioEnvironment />
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 6, 8]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-6, -2, 5]} intensity={0.9} color="#F5F3F1" />

        <VerticalCameraChoreography />
        <ParticlesField />
        <CentralFilmstrip3D />
        <CameraRig />
        <CasesGallery3D />
        <GpuPrecompiler />
        <FrameloopKicker active={isReady && !isSoftwareGl} />
        <SoftwareGlInvalidator active={isSoftwareGl} isReady={isReady} />
        {postFx && assetsLoaded && <PostProcessing />}
      </Canvas>
    </div>
  );
}
