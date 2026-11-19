import path from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Torna o CSS principal não-bloqueante na renderização inicial,
 * evitando atraso no First Contentful Paint / LCP.
 */
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css-plugin',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/g,
        '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">\n    <noscript><link rel="stylesheet" crossorigin href="$1"></noscript>'
      );
    },
  };
}

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), asyncCssPlugin()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      esbuild: {
        legalComments: 'none',
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (
                id.includes('vite/preload-helper') ||
                id.includes('commonjsHelpers') ||
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/') ||
                id.includes('node_modules/scheduler/')
              ) {
                return 'vendor-react';
              }
              if (id.includes('node_modules/framer-motion/')) {
                return 'vendor-motion';
              }
              if (id.includes('node_modules/leaflet/')) {
                return 'vendor-map';
              }
              if (id.includes('node_modules/lucide-react/')) {
                return 'vendor-icons';
              }
              if (
                id.includes('node_modules/three/') ||
                id.includes('node_modules/@react-three/') ||
                id.includes('node_modules/postprocessing/') ||
                id.includes('node_modules/three-stdlib/') ||
                id.includes('node_modules/troika-')
              ) {
                return 'vendor-three';
              }
              if (id.includes('node_modules/gsap/') || id.includes('node_modules/lenis/')) {
                return 'vendor-produtora-scroll';
              }
            }
          }
        },
        chunkSizeWarningLimit: 800
      }
    };
});
