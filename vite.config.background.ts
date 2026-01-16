import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  build: {
    outDir: "dist/background",
    emptyOutDir: false,
    copyPublicDir: false,
    sourcemap: mode === "development",
    lib: {
      entry: resolve(__dirname, "src/background/index.ts"),
      name: "background",
      formats: ["iife"],
      fileName: () => "background.js",
    },
  },
}));
