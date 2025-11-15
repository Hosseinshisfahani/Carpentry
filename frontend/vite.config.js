import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Rewrite Set-Cookie headers to work with proxy
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map(cookie => {
                // Remove domain restriction and adjust path
                return cookie
                  .replace(/Domain=[^;]+;?/gi, '')
                  .replace(/Path=[^;]+;?/gi, 'Path=/;')
                  .replace(/SameSite=None/gi, 'SameSite=Lax');
              });
            }
          });
        },
      },
    },
  },
})
