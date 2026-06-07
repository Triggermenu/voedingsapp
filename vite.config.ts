import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We registreren de SW zelf in main.tsx zodat we periodiek op nieuwe
      // deploys kunnen pollen (anders checkt de browser pas als ALLE tabs
      // sluiten — op iOS bleef de app daardoor maandenlang op een oude bundle).
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Nieuwe SW neemt direct over + ruimt oude precaches op, zodat een
        // update niet achter "wachtende" service workers blijft hangen.
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/src\/data\/.+\.json$/,
            handler: 'CacheFirst',
            options: { cacheName: 'food-data', expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 } },
          },
        ],
      },
      manifest: {
        name: 'Triggermenu',
        short_name: 'Triggermenu',
        description: 'Beslishulp bij voedingskeuzes voor jicht, migraine, nierstenen en histamine',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8f7f4',
        theme_color: '#f5f2ea',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-64x64.png',            sizes: '64x64',   type: 'image/png' },
          { src: 'pwa-192x192.png',           sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',           sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    // food-data chunk is intentioneel groot (700 items JSON) — geen code-smell
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: {
          // React-kern apart — wijzigt zelden, lang gecached
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Alle 700-item JSON-bestanden in één data-chunk.
          // Voordeel: bij code-wijzigingen hoeft de browser de ~900 kB data
          // niet opnieuw te downloaden; alleen de kleinere app-chunk verandert.
          'food-data': [
            './src/data/groente.json',
            './src/data/fruit.json',
            './src/data/vlees.json',
            './src/data/vis-schaaldieren.json',
            './src/data/zuivel.json',
            './src/data/eieren.json',
            './src/data/granen.json',
            './src/data/peulvruchten.json',
            './src/data/dranken-alcohol.json',
            './src/data/dranken-non-alcohol.json',
            './src/data/noten-zaden.json',
            './src/data/zoetwaren.json',
            './src/data/sauzen-kruiden.json',
            './src/data/bereid-gerecht.json',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/e2e/**', '**/node_modules/**', '**/.claude/**'],
  },
})
