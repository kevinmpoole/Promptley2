import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Polyfill __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      pages: path.resolve(__dirname, 'src/pages'),
      components: path.resolve(__dirname, 'src/components'),
      lib: path.resolve(__dirname, 'src/lib'),
    },
  },
  server: {
    proxy: {
      // API calls
      '/api': 'http://localhost:8000',
      // Static universes served by FastAPI
      '/universes': 'http://localhost:8000',
      // Thumbnail uploads (if used separately)
      '/uploads': 'http://localhost:8000',
      '/thumbnails': 'http://localhost:8000',
      '/universe_schemas': 'http://localhost:8000',
      '/prompt': 'http://localhost:8000'
    }
  }
})
