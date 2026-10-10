import { defineConfig } from "vite";

export default defineConfig({
  server: { host: true, open: "/dev/" },
  build: {
    lib: {
      entry: "src/ma-player-card.ts",
      formats: ["es"],
      fileName: () => "ma-player-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    target: "es2021",
    sourcemap: false,
  },
});
