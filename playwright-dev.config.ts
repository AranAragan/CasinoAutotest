import dotenv from 'dotenv';
import { PlaywrightTestConfig } from '@playwright/test';

dotenv.config();

dotenv.config({
  path: `helper/env/.env.dev`,
  override: false
})

const RPconfig = {
  apiKey: process.env.API_KEY!,
  endpoint: 'https://portal.qa.amxeox.xyz/api/v1',
  project: 'playwright_frontend',
  launch: 'Playwright frontend dev launch',
  skippedIssue: false,
  includeTestSteps: true,
  mode: 'DEBUG',
  attributes: [
    {
      value: 'Frontend',
    },
    {
      key: 'Stand',
      value: process.env.STAND!,
    },
  ],
  description: 'Frontend autotests launch (Dev)',
  agent: {
    rejectUnauthorized: false,
  },
  restClientConfig: {
    agent: {
      rejectUnauthorized: false,
    }
  }
};

const config: PlaywrightTestConfig = {
  timeout: 500000,
  globalTimeout: 3600000,
  testDir: './tests/web-tests/',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  expect: {
    timeout:10000
  },
  retries: 1,
  workers: process.env.CI ? 4 : 4,
  reporter: [['@reportportal/agent-js-playwright', RPconfig]],
  use: {
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
    launchOptions: {
      args: ["--start-fullscreen"],
      slowMo: 3000,
    },
  },
  globalSetup: 'src/utils/globalSetup.ts',
  globalTeardown: 'src/utils/globalTeardown.ts'
};
export default config;
