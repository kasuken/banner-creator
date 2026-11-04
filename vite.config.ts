import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    // Image search is served by the Functions host (`npm run dev:swa` or `func start` in api/)
    proxy: {
      '/api': 'http://localhost:4280',
    },
  },
  build: {
    outDir: 'build',
  },
});