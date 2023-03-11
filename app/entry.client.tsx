import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import initializeClientI18n from './i18n/initialize-client-i18n';
import getEnv from '~/core/get-env';
import { loadSelectedTheme } from '~/core/theming';
import configuration from '~/configuration';

const hydrate = () => {
  startTransition(() => {
    initializeClientI18n().then((i18next) => {
      const App = (
        <StrictMode>
          <I18nextProvider i18n={i18next}>
            <RemixBrowser />
          </I18nextProvider>
        </StrictMode>
      );

      if (isTestEnv()) {
        require('react-dom').hydrate(App, document);
      } else {
        hydrateRoot(document, App);
      }
    });
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}

function isTestEnv() {
  return getEnv().IS_CI === 'true';
}

if (configuration.enableThemeSwitcher) {
  loadSelectedTheme();
}
