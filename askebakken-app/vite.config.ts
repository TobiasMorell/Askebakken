import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    relay,
    react(),
    legacy({
      targets: ["defaults"],
      polyfills: ["es.promise.finally", "es/map", "es/set"],
      modernPolyfills: ["es.promise.finally"],
    }),
  ],
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:5132",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
