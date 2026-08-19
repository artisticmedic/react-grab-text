import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export const DEMO_PORT = 5199;
export const DEMO_URL = `http://localhost:${DEMO_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: DEMO_URL,
    // The plugin writes the payload with navigator.clipboard, and the tests
    // read it back.
    permissions: ["clipboard-read", "clipboard-write"],
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // PLAYWRIGHT_CHROMIUM_CHANNEL=chromium uses Playwright's own bundled
        // build; the default runs the locally installed Chrome, which is what
        // this machine has (its cached chromium predates @playwright/test).
        channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL ?? "chrome",
      },
    },
  ],
  webServer: {
    // react-grab only instruments in development, which is the Vite dev default.
    // The build runs first because the script-tag harness serves the real
    // dist/global.global.js. Note it is skipped when an already-running dev
    // server is reused, so rebuild by hand after editing src with `npm run
    // demo` up.
    command: `npm run build && npx vite demo --port ${DEMO_PORT} --strictPort`,
    url: DEMO_URL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
