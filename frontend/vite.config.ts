import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Kontakt-API in der Entwicklung: das lokal laufende Backend.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
