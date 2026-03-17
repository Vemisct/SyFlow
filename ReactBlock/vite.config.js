import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../StaticBlock/react',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/index.jsx',
      output: {
        entryFileNames: 'WelcomeRP.js',
        assetFileNames: '[name].[ext]',
        format: 'iife',
        name: 'WelcomeApp'
      }
    }
  }
});