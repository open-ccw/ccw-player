import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: "./",
  build: {
    minify: true,
    emptyOutDir: true,
    outDir: "dist",
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },
  },
}));
