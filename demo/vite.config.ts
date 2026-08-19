import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEMO_PORT = 5199;

export default defineConfig({
  plugins: [react()],
  server: {
    port: DEMO_PORT,
    strictPort: true,
    // The demo imports the plugin from ../../src so Vite serves the TypeScript
    // sources directly; the repo root has to be readable from the demo root.
    fs: { allow: [".."] },
  },
});
