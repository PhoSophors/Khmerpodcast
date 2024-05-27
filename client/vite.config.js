import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    fs: {
      strict: true,
    },
    // Set the `base` to be the root
    base: '/',
    // Enable the history API fallback
    historyApiFallback: true,
  },
})