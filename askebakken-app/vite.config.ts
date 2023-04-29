import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [relay, react()],
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
