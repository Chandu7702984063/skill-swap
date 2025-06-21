import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: ['@tailwindcss/postcss7-compat', 'postcss'],
  },
  esbuild: {
    logOverride: { 'http-server': 'silent' },
  },
  build: {
    sourcemap: true,
    target: ['es2020'],
  },
});