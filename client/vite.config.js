import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    fs: {
      strict: true,
    },
    base: '/',
    historyApiFallback: {
      rewrites: [
        { from: /\/.*/, to: '/' }
      ]
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})