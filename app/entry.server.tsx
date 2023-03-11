import { PassThrough } from 'stream';
import type { EntryContext } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import initializeServerI18n from './i18n/initialize-server-i18n';
import { useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { useEffect } from 'react';

Sentry.init({
  dsn: 'https://09d502e7ac7f48b1ae5d9b780f088d67:16e65c4b2b1d40af89d00bdeb84aa57e@o4504821132820480.ingest.sentry.io/4504821135114240',
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  const i18n = await initializeServerI18n(request, remixContext);

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
