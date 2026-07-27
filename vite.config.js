import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@components': path.resolve(__dirname, './src/components'),
      '@shaders': path.resolve(__dirname, './src/shaders'),
      '@postprocessing': path.resolve(__dirname, './src/postprocessing'),
      '@animations': path.resolve(__dirname, './src/animations'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@data': path.resolve(__dirname, './src/data'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // 3D + media assets that Vite should treat as static files, not code
  assetsInclude: [
    '**/*.glb',
    '**/*.gltf',
    '**/*.hdr',
    '**/*.exr',
    '**/*.ktx2',
    '**/*.mp3',
    '**/*.wav',
  ],

  server: {
    host: true,
    port: 5173,
  },

  build: {
    // R3F + shaders push chunk sizes up; this just silences the
    // default warning threshold rather than actually splitting things.
    // Real splitting happens later via manualChunks once scenes exist.
    chunkSizeWarningLimit: 1500,
  },

  optimizeDeps: {
    exclude: ['three'],
  },
})
