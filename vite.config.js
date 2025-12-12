// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- ¡Añade esta línea!

export default defineConfig({
  plugins: [react()],
  base: '/',
  
  resolve: {
    alias: {
      // Define que '@/' apunta a 'ruta-absoluta/src/'
      '@': path.resolve(__dirname, './src'), 
    },
  },
});