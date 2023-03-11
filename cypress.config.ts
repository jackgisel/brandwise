import { defineConfig } from 'cypress';
import { resolve } from 'path';
import { config as loadEnv } from 'dotenv';
import { execSync } from 'child_process';

import configuration from './app/configuration';

const testVars = loadEnv({
  path: resolve(process.cwd(), '.env.test'),
});

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  video: false,
  chromeWebSecurity: false,
  port: 4600,
  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 60000,
  experimentalInteractiveRunEvents: true,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  env: getEnv(),
  e2e: {
    setupNodeEvents(on, config) {
      const env = {
        ...(config.env ?? {}),
        ...(testVars.parsed ?? {}),
      };

      const port = 3000;

      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: false,
        screenshotOnRunFailure: !process.env.CI,
      };

      on('task', {
        resetDatabase() {
          return resetDb();
        },
      });

      return {
        ...config,
        ...configOverrides,
        env,
      };
    },
    defaultCommandTimeout: 10000,
    slowTestThreshold: 5000,
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: getExcludeSpecPattern(),
  },
});

function getExcludeSpecPattern() {
  const enableStripeTests = process.env.ENABLE_STRIPE_TESTING === 'true';
  const enableThemeTests = configuration.enableThemeSwitcher;

  const excludePatterns = [];

  if (!enableStripeTests) {
    excludePatterns.push('**/stripe/*');
  }

  if (!enableThemeTests) {
    excludePatterns.push('**/theme.cy.ts');
  }

  return excludePatterns;
}

function getEnv() {
  const env = process.env;

  const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const USER_EMAIL = env.USER_EMAIL;
  const USER_PASSWORD = env.USER_PASSWORD;
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;
  const IS_CI = env.IS_CI;
  const SITE_URL = env.SITE_URL;
  const SECRET_KEY = env.SECRET_KEY;

  return {
    SITE_URL,
    IS_CI,
    SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    USER_EMAIL,
    USER_PASSWORD,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY,
  };
}

function resetDb() {
  console.log(`Resetting database...`);

  try {
    execSync('npm run supabase:db:reset');

    console.log(`DB reset successful`);

    return true;
  } catch (error) {
    console.error(`DB reset failed`, error);
  }

  return false;
}
