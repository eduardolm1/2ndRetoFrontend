import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      '/local': {
        target: 'https://twondretobackend.onrender.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local/, ''),
      },
    },
  }
})
