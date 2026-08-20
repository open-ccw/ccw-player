import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ command }) => ({
  base: "./",
  build: {
    minify: true,
    emptyOutDir: true,
    outDir: "./lib",
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
  },
  plugins: [dts()],
}));
