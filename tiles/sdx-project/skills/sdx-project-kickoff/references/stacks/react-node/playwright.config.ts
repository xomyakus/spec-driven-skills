import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const E2E_BACKEND_PORT = 3100;
const E2E_FRONTEND_PORT = 5174;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: `http://localhost:${E2E_FRONTEND_PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: `PORT=${E2E_BACKEND_PORT} npm run dev:server`,
      url: `http://localhost:${E2E_BACKEND_PORT}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
    },
    {
      command: `VITE_PORT=${E2E_FRONTEND_PORT} VITE_API_PORT=${E2E_BACKEND_PORT} npm run dev:client`,
      url: `http://localhost:${E2E_FRONTEND_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
    },
  ],
});
