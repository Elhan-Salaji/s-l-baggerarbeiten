import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Kontakt-API in der Entwicklung: das lokal laufende Backend.
    // Läuft es auf einem anderen Port, VITE_API_PROXY setzen.
    proxy: {
      '/api': process.env.VITE_API_PROXY ?? 'http://localhost:8080',
    },
  },
})
