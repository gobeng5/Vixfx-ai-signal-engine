import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Tell Vite’s Babel transform to use react-require
      babel: {
        plugins: ['react-require']
      }
    })
  ],
  base: '/'
});
