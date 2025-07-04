import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic' // ✅ Forces manual React import
    })
  ],
  base: '/',
});
