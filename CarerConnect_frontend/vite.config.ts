import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react(), EnvironmentPlugin("all")],
  server: {
    host: true,
    port: 8080, // tell app which port to run on
    watch: {
      usePolling: true,
    },
  },
});
