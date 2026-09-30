import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  fullyParallel: true,
  workers: 3,
  reporter: "list",
  use: {
    baseURL: process.env.PREVIEW_URL || "http://127.0.0.1:4173",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  webServer: process.env.PREVIEW_URL
    ? undefined
    : {
        command: "node scripts/serve.mjs",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: true,
      },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
