import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['63f7-157-157-152-56.ngrok-free.app', 'localhost'],
    cors: true,
    hmr: {
      clientPort: 443
    }
  }
})
