import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { setCookie } from '~/core/generic/cookies';

function useChangeLanguage() {
  const { i18n } = useTranslation();
  const cookieName = i18n.options.detection?.lookupCookie ?? 'i18next';

  return useCallback(
    (language: string) => {
      return i18n.changeLanguage(language, () => {
        // we need to set the cookie manually because Remix encodes the cookie value
        // while the library does not
        setCookie(cookieName, language);
      });
    },
    [cookieName, i18n]
  );
}

export default useChangeLanguage;
