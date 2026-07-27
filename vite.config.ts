import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(isSsrBuild
      ? []
      : [
          ViteImageOptimizer({
            webp: { quality: 78, effort: 4 },
            png: { quality: 80 },
            jpg: { quality: 80 },
            jpeg: { quality: 80 },
          }),
        ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    noExternal: [
      'react-router-dom',
      'react-router',
      'motion',
      'embla-carousel-react',
      'lenis',
      'lucide-react',
    ],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !/(?:^|\/)motion-|^ui-/.test(dep.split('/').pop() ?? dep)),
    },
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              motion: ['motion/react'],
              ui: ['embla-carousel-react', 'lenis'],
            },
          },
        },
  },
}))
