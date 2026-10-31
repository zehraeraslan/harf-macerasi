import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Yeni sürüm yayınlanınca kullanıcıya soru sormadan kendiliğinden güncellenir
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Harf Macerası',
        short_name: 'Harf Macerası',
        description: 'Okumaya yeni başlayan çocuklar için oyunlu harf öğrenme.',
        lang: 'tr',
        theme_color: '#ff4f81',
        background_color: '#fff8ec',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Uygulamanın kendisi çevrimdışı çalışsın
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,woff2}'],
        navigateFallback: '/index.html',
        // Ses kayıtları (ileride eklenecek) kullanıldıkça önbelleğe alınır
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/audio/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'audio', expiration: { maxEntries: 500 } },
          },
        ],
      },
    }),
  ],
})
