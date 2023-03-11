import stylesheetUrl from './styles/dist.css';

import type { LoaderArgs } from '@remix-run/server-runtime';
import type { LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import {
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Meta as RemixMeta,
} from '@remix-run/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import classNames from 'classnames';

import Head from '~/core/ui/Head';
import { parseThemeCookie } from '~/lib/server/cookies/theme.cookie';
import AppRouteLoadingIndicator from '~/components/AppRouteLoadingIndicator';
import RootCatchBoundary from '~/components/RootCatchBoundary';
import i18nNext from './i18n/i18n.server';
import configuration from '~/configuration';

const queryClient = new QueryClient();

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesheetUrl }];
};

export const meta = () => {
  return {
    title: configuration.site.siteName,
    description: configuration.site.description,
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const theme = await parseThemeCookie(request);
  const locale = await i18nNext.getLocale(request);

  return json({
    locale,
    theme,
    ENV: getBrowserEnvironment(),
  });
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  const className = classNames({
    dark: data.theme === 'dark',
  });

  return (
    <html lang={data.locale} className={className}>
      <head>
        <RemixMeta />
        <Links />
        <Head />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      </head>
      <body className="h-full">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>

        <AppRouteLoadingIndicator />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const CatchBoundary = RootCatchBoundary;

function getBrowserEnvironment() {
  const env = process.env;

  return {
    IS_CI: env.IS_CI,
    SITE_URL: env.SITE_URL,
    DEFAULT_LOCALE: env.DEFAULT_LOCALE,
    NODE_ENV: env.NODE_ENV,
    SENTRY_DSN: env.SENTRY_DSN,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  };
}
