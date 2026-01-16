import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  build: {
    outDir: "dist/content-script",
    emptyOutDir: false,
    copyPublicDir: false,
    sourcemap: mode === "development",
    lib: {
      entry: resolve(__dirname, "src/content/index.ts"),
      name: "content",
      formats: ["iife"],
      fileName: () => "content.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "content.css",
      },
    },
  },
}));
