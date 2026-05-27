import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Ye section CORS errors se bachne mein madad karega
    proxy: {
      '/backend': {
        target: 'http://localhost/leavecraft', // Aapke XAMPP folder ka path
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '/backend'),
      },
    },
  },
});