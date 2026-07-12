import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        careers: new URL('./careers.html', import.meta.url).pathname,
      },
    },
  },
  plugins: [react()],
})
