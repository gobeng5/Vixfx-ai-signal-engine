// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',

  plugins: [
    react({
      // Force classic JSX runtime so React must be imported
      jsxRuntime: 'classic',

      // Use Babel to auto-inject `import React` where you forgot it
      babel: {
        plugins: ['react-require']
      }
    })
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
