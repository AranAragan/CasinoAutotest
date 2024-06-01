import dotenv from 'dotenv';
import { PlaywrightTestConfig } from '@playwright/test';

dotenv.config();

dotenv.config({
  path: `helper/env/.env.prod_chillbet`,
  override: false
})

const RPconfig = {
  apiKey: process.env.API_KEY!,
  endpoint: 'https://portal.qa.amxeox.xyz/api/v1',
  project: 'playwright_frontend',
  launch: 'Playwright frontend chillbet launch',
  skippedIssue: false,
  includeTestSteps: true,
  attributes: [
    {
      value: 'Frontend',
    },
    {
      key: 'Stand',
      value: process.env.STAND!,
    },
  ],
  description: 'Frontend autotests launch (Chillbet)',
  agent: {
    rejectUnauthorized: false,
    setTimeout: 20000
  },
  restClientConfig: {
    agent: {
      rejectUnauthorized: false,
    }
  }
};

const config: PlaywrightTestConfig = {
  timeout: 200000,
  globalTimeout: 3600000,
  testDir: './tests/web-tests/',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  expect: {
    timeout:10000
  },
  workers: process.env.CI ? 5 : 5,
  reporter: [['@reportportal/agent-js-playwright', RPconfig]],
  use: {
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
    launchOptions: {
      args: ["--start-fullscreen"],
      slowMo: 4000,
    },
  },
  globalSetup:'src/utils/globalSetup.ts',
  globalTeardown:'src/utils/globalTeardown.ts'
};
export default config;