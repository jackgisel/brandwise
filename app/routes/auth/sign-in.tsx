import { useCallback, useEffect, useMemo } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Link, useNavigate } from '@remix-run/react';

import { Trans } from 'react-i18next';
import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';
import isBrowser from '~/core/generic/is-browser';

import getClientQueryParams from '~/core/generic/get-client-query-params';

import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';
import EmailPasswordSignInContainer from '~/components/auth/EmailPasswordSignInContainer';

import configuration from '~/configuration';
import AuthCatchBoundary from '~/components/auth/AuthCatchBoundary';
import useSignOut from '~/core/hooks/use-sign-out';

export const CatchBoundary = AuthCatchBoundary;

export const meta: MetaFunction = () => {
  return {
    title: 'Sign In',
  };
};

const SIGN_UP_PATH = configuration.paths.signUp;
const FORCE_SIGN_OUT_QUERY_PARAM = 'signOut';

function SignInPage() {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const onSignIn = useCallback(() => {
    navigate(configuration.paths.appHome);
  }, [navigate]);

  const shouldForceSignOut = useMemo(() => {
    if (!isBrowser()) {
      return false;
    }

    const params = getClientQueryParams();

    return params.has(FORCE_SIGN_OUT_QUERY_PARAM);
  }, []);

  // force user signOut if the query parameter has been passed
  useEffect(() => {
    if (shouldForceSignOut) {
      void signOut();
    }
  }, [signOut, shouldForceSignOut]);

  return (
    <>
      <div>
        <Heading type={6}>
          <span className={'font-medium'}>
            <Trans i18nKey={'auth:signInHeading'} />
          </span>
        </Heading>
      </div>

      <OAuthProviders onSignIn={onSignIn} />

      <If condition={configuration.auth.providers.emailPassword}>
        <div>
          <span className={'text-xs text-gray-400'}>
            <Trans i18nKey={'auth:orContinueWithEmail'} />
          </span>
        </div>

        <EmailPasswordSignInContainer onSignIn={onSignIn} />
      </If>

      <If condition={configuration.auth.providers.phoneNumber}>
        <PhoneNumberSignInContainer onSignIn={onSignIn} />
      </If>

      <If condition={configuration.auth.providers.emailLink}>
        <EmailLinkAuth />
      </If>

      <div className={'flex justify-center text-xs'}>
        <p className={'flex space-x-1'}>
          <span>
            <Trans i18nKey={'auth:doNotHaveAccountYet'} />
          </span>

          <Link
            className={'text-primary-800 hover:underline dark:text-primary-500'}
            to={SIGN_UP_PATH}
          >
            <Trans i18nKey={'auth:signUp'} />
          </Link>
        </p>
      </div>
    </>
  );
}

export default SignInPage;
