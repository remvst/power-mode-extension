import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
        'content-css': resolve(__dirname, 'src/content/content.css'),
        sidepanel: resolve(__dirname, 'src/sidepanel/sidepanel.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') {
            return 'content-script/content.js';
          }
          return 'sidepanel/[name].js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            if (assetInfo.name.includes('content')) {
              return 'content-script/[name].[ext]';
            }
            return 'sidepanel/[name].[ext]';
          }
          return '[name].[ext]';
        },
      },
    },
  },
  publicDir: '../public',
});
