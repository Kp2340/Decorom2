import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  base: "/",
  build: {
    sourcemap: false,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.decorom.in",
        changeOrigin: true,
        secure: false,
      },
      "/checkout": {
        target: "https://api.decorom.in",
        changeOrigin: true,
        secure: false,
      },
      "/orders": {
        target: "https://api.decorom.in",
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: "https://api.decorom.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      png: { quality: 70 },
      jpg: { quality: 70 },
      jpeg: { quality: 70 },
      webp: { quality: 70 },
      avif: { quality: 70 },
      svg: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "sortAttrs" },
        ],
      },
    }),
  ],
});
