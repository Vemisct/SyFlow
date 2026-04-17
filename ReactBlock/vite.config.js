import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/static/React/',
  plugins: [react()],
  build: {
    outDir: '../StaticBlock/react',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        welcome: 'src/Indexes/welcome_index.jsx',
        entrance: 'src/Indexes/entrance_index.jsx',
        home: 'src/Indexes/home_index.jsx',
        games: 'src/Indexes/games_index.jsx',
        academy: 'src/Indexes/academy_index.jsx',
        market: 'src/Indexes/market_index.jsx',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  }
});