import type { EntryContext } from '@remix-run/node';

import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { initReactI18next } from 'react-i18next';
import i18next from './i18n.server';
import i18n from './i18next.config';

async function initializeServerI18n(request: Request, context: EntryContext) {
  const instance = createInstance();
  const lng = await i18next.getLocale(request);
  const ns = [...i18n.defaultNS, ...i18next.getRouteNamespaces(context)];
  const bundle = createLanguageBundle(lng);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      supportedLngs: i18n.supportedLanguages,
      fallbackLng: i18n.fallbackLanguage,
      lng,
      ns,
      resources: {
        [lng]: bundle,
      },
    });

  return instance;
}

export default initializeServerI18n;

function createLanguageBundle(language: string) {
  const prefix = '../public/locales';

  const common = require(`${prefix}/${language}/common.json`);
  const auth = require(`${prefix}/${language}/auth.json`);
  const organization = require(`${prefix}/${language}/organization.json`);
  const profile = require(`${prefix}/${language}/profile.json`);
  const subscription = require(`${prefix}/${language}/subscription.json`);

  return {
    common,
    auth,
    organization,
    profile,
    subscription,
  };
}
