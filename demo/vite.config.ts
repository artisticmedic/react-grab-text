import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const DEMO_PORT = 5317;
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// The script-tag harness loads both IIFE bundles the way a consumer with no
// bundler does — plain <script src>. Both live outside the demo root (one in
// node_modules, one in dist), so serve them raw and untransformed at stable
// URLs rather than putting machine-specific /@fs/ paths in the HTML.
const IIFE_BUNDLES: Record<string, string> = {
  "/vendor/react-grab.iife.js": "node_modules/react-grab/dist/index.global.js",
  "/vendor/react-grab-text.iife.js": "dist/global.global.js",
};

const serveIifeBundles = (): Plugin => ({
  name: "serve-iife-bundles",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const requestPath = (request.url ?? "").split("?")[0] ?? "";
      const bundlePath = IIFE_BUNDLES[requestPath];
      if (!bundlePath) {
        next();
        return;
      }
      try {
        const contents = readFileSync(`${repoRoot}${bundlePath}`);
        response.setHeader("Content-Type", "text/javascript");
        response.setHeader("Cache-Control", "no-store");
        response.end(contents);
      } catch {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/javascript");
        response.end(`throw new Error("${bundlePath} is missing — run npm run build first.");`);
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), serveIifeBundles()],
  server: {
    port: DEMO_PORT,
    strictPort: true,
    // The demo imports the plugin from ../../src so Vite serves the TypeScript
    // sources directly; the repo root has to be readable from the demo root.
    fs: { allow: [".."] },
  },
});
