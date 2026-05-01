import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 57715,

    proxy: {
      '/api': {
        target: 'https://localhost:7057',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
