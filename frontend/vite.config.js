import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // your frontend lives in /frontend
  root: 'frontend',

  // assets served from /
  base: '/',

  plugins: [
    react({
      // automatic JSX runtime injects React where needed
      jsxRuntime: 'automatic'
    })
  ],

  build: {
    // output to frontend/dist
    outDir: 'frontend/dist',
    emptyOutDir: true
  }
});
