// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [
    react({
      // Use automatic JSX transform,
      // but still force React to be in scope everywhere
      jsxRuntime: 'automatic'
    })
  ],
  esbuild: {
    // Auto‐prepend `import React from 'react'` into every JSX file
    jsxInject: `import React from 'react'`
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
