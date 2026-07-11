import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  base: "/",
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/checkout": "http://localhost:8080",
      "/payment-notification": "http://localhost:8080",
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
