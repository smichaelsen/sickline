import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: resolve(__dirname, "dist/client"),
    emptyOutDir: true
  },
  server: {
    hmr: {
      clientPort: 5173
    },
    port: 5173,
    host: "0.0.0.0",
    strictPort: true,
    watch: {
      usePolling: true
    }
  }
});
