import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...devices["Desktop Chrome"],
    launchOptions: {
      args: [
        "--use-gl=swiftshader",
        "--enable-webgl",
        "--ignore-gpu-blocklist",
        "--enable-precise-memory-info",
      ],
    },
  },
  webServer: [
    {
      command: "pnpm --filter @evervale/server start",
      url: "http://127.0.0.1:2567/health",
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        PORT: "2567",
        CLIENT_ORIGIN: "http://127.0.0.1:5173",
        EVERVALE_DEV_AUTH: "true",
      },
    },
    {
      command: "pnpm --filter @evervale/client dev --host 127.0.0.1 --port 5173",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        VITE_API_URL: "http://127.0.0.1:2567",
      },
    },
  ],
});
