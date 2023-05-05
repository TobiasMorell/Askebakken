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
      targets: [
        "> 0.25%",
        "not dead",
        "chrome >= 60",
        "safari >= 10.1",
        "ios >= 10.3",
        "not ie <= 11",
        "not op_mini all",
      ],
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
