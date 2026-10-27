import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createContentSecurityPolicy, getApiOrigin } from './security-policy.mts'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const apiOrigin = getApiOrigin(env.VITE_API_BASE_URL, command === 'build')
  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'warrantykeep-csp',
      transformIndexHtml: {
        order: 'post',
        handler: () => [{
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: createContentSecurityPolicy(apiOrigin, command === 'serve')
          },
          injectTo: 'head-prepend'
        }]
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true
      }
    }
  }
  }
})
