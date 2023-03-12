import isBrowser from '~/core/generic/is-browser';

interface EnvVars {
  SITE_TITLE: string;
  SITE_DESCRIPTION: string;
  ENVIRONMENT: string;
  DEFAULT_LOCALE: string;
  SITE_URL: string;
  SENTRY_DSN: string;
  NODE_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  IS_CI: string;
  EMAIL_HOST: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

function getEnv(): EnvVars {
  return (isBrowser() ? window.ENV : process.env) as EnvVars;
}

export default getEnv;
