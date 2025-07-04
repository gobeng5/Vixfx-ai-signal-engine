import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],
  base: '/',
  esbuild: {
    jsxInject: `import React from 'react'` // ✅ Forces React to be available in all JSX files
  }
});
