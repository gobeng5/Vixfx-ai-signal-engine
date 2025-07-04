import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic' // 👈 forces classic runtime to require React import
    })
  ],
  base: '/',
});
