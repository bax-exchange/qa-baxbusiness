import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Cargar .env manualmente (sin dotenv como dependencia)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,

  globalSetup: './global-setup.ts',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://business.bax-dev.com',
    storageState: 'auth/storage.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    locale: 'es-AR',
  },

  projects: [
    // Tests de login: sin auth state (prueban el formulario directamente)
    {
      name: 'auth-tests',
      testMatch: '**/auth/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },
    // Resto de tests: con auth state precargado (más rápido)
    {
      name: 'chromium',
      testIgnore: '**/auth/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
