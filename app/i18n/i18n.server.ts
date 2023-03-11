import Backend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next';
import { createCookie } from '@remix-run/node';

import i18nextOptions from './i18next.config';

const cookie = createCookie('i18next', {
  path: '/',
  httpOnly: false,
  secure: process.env.EMULATOR !== `true`,
  sameSite: 'lax' as const,
});

const i18nNext = new RemixI18Next({
  detection: {
    supportedLanguages: i18nextOptions.supportedLanguages,
    fallbackLanguage: i18nextOptions.fallbackLanguage,
    cookie,
  },
  i18next: {
    ...i18nextOptions,
    supportedLngs: i18nextOptions.supportedLanguages,
    fallbackLng: i18nextOptions.fallbackLanguage,
  },
  // @ts-ignore
  backend: Backend,
});

export default i18nNext;
