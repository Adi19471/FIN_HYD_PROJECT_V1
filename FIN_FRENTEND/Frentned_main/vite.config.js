import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import os from "os";

const viteCacheDir = path.join(os.tmpdir(), "vite-cache");

export default defineConfig({
  base: "./",
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.VITE_API_BASE": JSON.stringify(process.env.VITE_API_BASE),
    "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_APP_URL
    ),
   
  },
 
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  cacheDir: viteCacheDir,

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src"),
      toastify: path.resolve(__dirname, "src/toastify.js"),
      lib: path.resolve(__dirname, "src/lib"),
      // Add more aliases here if needed
    },
  },

  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],

  server: {
     watch: {
      usePolling: true,
    },
    proxy: {
      "/balaji-finance": {
        target: process.env.VITE_API_BASE || "http://localhost:8881",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    target: "es2018",
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    brotliSize: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Put all node_modules into a vendor chunk to improve long-term caching
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // deterministic names for better caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
