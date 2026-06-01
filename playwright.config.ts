import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(
  (globalThis as typeof globalThis & {
    process?: {
      env?: {
        CI?: string;
      };
    };
  }).process?.env?.CI
);

export default defineConfig({
  testDir: './tests',

 fullyParallel: false,

  forbidOnly: isCI,

  retries: isCI ? 2 : 0,

  workers: isCI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4200',
    headless: isCI,

    viewport: {
      width: 1440,
      height: 900
    },

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],

  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !isCI,
    timeout: 120_000
  }
});