import * as THREE from 'three';

/**
 * Recursively disposes geometries, materials, and attached texture maps
 * on any Three.js Object3D subtree to guarantee zero WebGL VRAM leaks.
 */
export function disposeObject3D(root: THREE.Object3D | null | undefined): void {
  if (!root) return;

  root.traverse((obj) => {
    const meshLike = obj as THREE.Mesh;
    if (meshLike.geometry) {
      meshLike.geometry.dispose();
    }

    const materialProp = (meshLike as { material?: THREE.Material | THREE.Material[] }).material;
    if (!materialProp) return;

    const materials = Array.isArray(materialProp) ? materialProp : [materialProp];
    for (const mat of materials) {
      const record = mat as unknown as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        const value = record[key];
        if (value && typeof value === 'object' && 'isTexture' in value) {
          (value as THREE.Texture).dispose();
        }
      }
      // Also dispose ShaderMaterial uniforms holding textures
      if ('uniforms' in mat && mat.uniforms) {
        const uniforms = mat.uniforms as Record<string, { value: unknown }>;
        for (const uKey of Object.keys(uniforms)) {
          const uVal = uniforms[uKey]?.value;
          if (uVal && typeof uVal === 'object' && 'isTexture' in uVal) {
            (uVal as THREE.Texture).dispose();
          }
        }
      }
      mat.dispose();
    }
  });
}

/**
 * Releases HTMLVideoElement decoder buffers and detaches media streams.
 */
export function disposeVideoElement(video: HTMLVideoElement | null | undefined): void {
  if (!video) return;
  try {
    video.pause();
    video.removeAttribute('src');
    video.load();
  } catch {
    // Ignore errors on already-detached media elements
  }
}
