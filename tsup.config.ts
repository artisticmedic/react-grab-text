import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    platform: "browser",
    target: "es2020",
    external: ["react-grab"],
  },
  {
    entry: { global: "src/global.ts" },
    format: ["iife"],
    globalName: "ReactGrabText",
    platform: "browser",
    target: "es2020",
    minify: true,
    noExternal: [/./],
  },
]);
