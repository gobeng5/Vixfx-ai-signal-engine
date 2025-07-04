import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic' // ✅ enables auto-injection of React
    })
  ],
  base: '/',
});
