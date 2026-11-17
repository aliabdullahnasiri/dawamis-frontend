import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { port: 5173, strictPort: true, proxy: { "/api": { target: loadEnv(mode, process.cwd()).VITE_BACKEND_URL || "http://127.0.0.1:8000", changeOrigin: true } } },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
}))
