import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'frontend',
  base: '/', // ✅ this is critical for Vercel or any root-hosted app

  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        plugins: ['react-require']
      }
    })
  ],

  esbuild: {
    jsxInject: `import React from 'react'`
  },

  build: {
    outDir: 'frontend/dist',
    emptyOutDir: true
  }
});
