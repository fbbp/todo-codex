import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        baseURL: 'http://localhost:4173',
        headless: true,
        offline: true,
        permissions: ['notifications'],
      },
    },
  ],
  webServer: {
    command: 'pnpm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
