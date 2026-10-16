import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Prompt Vault',
        short_name: 'Prompt Vault',
        description: 'Guarda, organiza y copia tus prompts favoritos.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1A1A2E',
        theme_color: '#1A1A2E',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Solo los subconjuntos latinos de la fuente; el resto se descarga si hace falta
        globPatterns: ['**/*.{js,css,html,svg,png,ico}', '**/plus-jakarta-sans-latin*.woff2'],
        // Las páginas estáticas no son rutas de la SPA: se sirven tal cual
        navigateFallbackDenylist: [/\.html$/, /^\/robots\.txt$/, /^\/sitemap\.xml$/],
      },
    }),
  ],
})
