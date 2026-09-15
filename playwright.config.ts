/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"]
  },
  webServer:process.env.BASE_URL ? undefined : {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false
  }
});