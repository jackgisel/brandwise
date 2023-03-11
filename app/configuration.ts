import getEnv from '~/core/get-env';
import type { Provider } from '@supabase/gotrue-js/src/lib/types';

const env = getEnv() ?? {};
const production = env.NODE_ENV === 'production';

const configuration = {
  site: {
    name: 'Branwise - ai brand manager',
    description: 'Your super powered AI brand manager.',
    themeColor: '#ffffff',
    themeColorDark: '#0a0a0a',
    siteUrl: env.SITE_URL,
    siteName: 'Branwise',
    twitterHandle: 'brandwiseai',
    githubHandle: '',
    language: 'en',
    convertKitFormId: '',
    locale: env.DEFAULT_LOCALE,
  },
  auth: {
    // ensure this is the same as your Supabase project
    // by default - it's true in production and false in development
    requireEmailConfirmation: production,
    // NB: Enable the providers below in the Supabase Console
    // in your production project
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      oAuth: ['google'] as Provider[],
    },
  },
  production,
  environment: env.ENVIRONMENT,
  enableThemeSwitcher: true,
  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signInFromLink: '/auth/link',
    onboarding: `/onboarding`,
    appHome: '/dashboard',
    settings: {
      profile: '/settings/profile',
      authentication: '/settings/profile/authentication',
      email: '/settings/profile/email',
      password: '/settings/profile/password',
    },
    api: {
      checkout: `/resources/stripe/checkout`,
      billingPortal: `/resources/stripe/portal`,
      organizations: {
        create: `/resources/organizations/create`,
        transferOwnership: `/resources/organizations/transfer-ownership`,
        members: `/resources/organizations/members`,
      },
    },
  },
  email: {
    host: '',
    port: 587,
    user: '',
    password: '',
    senderAddress: 'Brandwise Team <info@brandwise.ai>',
  },
  sentry: {
    dsn: env.SENTRY_DSN,
  },
  stripe: {
    products: [
      {
        name: 'Start',
        description: 'For individuals and small brands',
        badge: `Great for testing`,
        features: [
          'Up to 3 social media accounts',
          'Up to 5,000 comments processed monthly',
          'Reply to comments in dashboard',
          'Filter stats by page',
        ],
        plans: [
          {
            name: 'Monthly',
            price: '$29',
            stripePriceId: 'price_1MXc7fJtTwudNZ6HGFKZk0r9',
            trialPeriodDays: 7,
          },
        ],
      },
      {
        name: 'Pro',
        badge: `Most Popular`,
        recommended: true,
        description:
          'For teams with several pages and higher volume engagement',
        features: [
          'Unlimited social media accounts',
          'Up to 10,000 comments monthly',
          'Identify comments that require a response',
          'Reply to comments in dashboard',
          'Filter stats by page',
        ],
        plans: [
          {
            name: 'Monthly',
            price: '$69',
            stripePriceId: 'price_1MXc8FJtTwudNZ6HyTdqxxO5',
            trialPeriodDays: 7,
          },
        ],
      },
      {
        name: 'Enterprise',
        description:
          'For large brands, marketing agencies and growing companies',
        badge: ``,
        features: [
          'Unlimited social media accounts',
          'As many monthly comments as you need',
          'Priority support',
          'Custom capabilities',
          'Everything in Pro',
        ],
        plans: [
          {
            name: '',
            price: 'Contact us',
            stripePriceId: '',
            trialPeriodDays: 0,
            label: `Contact us`,
            href: `/contact`,
          },
        ],
      },
    ],
  },
};

export default configuration;
