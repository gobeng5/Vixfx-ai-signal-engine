import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
  ],
  esbuild: {
    jsxInject: `import React from 'react'`
  }
});
