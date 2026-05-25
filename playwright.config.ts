import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Lokaal 1 worker: voorkomt dat meerdere Playwright-browsers tegelijk een koude
  // Vite-dev-server raken (cold-start bundeling → timeout). In CI ook 1.
  workers: 1,
  timeout: 60_000,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // domcontentloaded is voldoende voor een SPA: React mount wordt bewaakt
    // door de expect()-assertions, niet door de goto zelf.
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
