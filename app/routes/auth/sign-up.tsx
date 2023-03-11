import type { MetaFunction } from '@remix-run/node';
import { Link, useNavigate } from '@remix-run/react';
import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';
import EmailPasswordSignUpContainer from '~/components/auth/EmailPasswordSignUpContainer';

import configuration from '~/configuration';
import AuthCatchBoundary from '~/components/auth/AuthCatchBoundary';

export const CatchBoundary = AuthCatchBoundary;

export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up',
  };
};

const SIGN_IN_PATH = configuration.paths.signIn;

export default function SignUpPage() {
  const navigate = useNavigate();

  const onSignUp = useCallback(() => {
    navigate(configuration.paths.onboarding);
  }, [navigate]);

  return (
    <>
      <div>
        <Heading type={6}>
          <span className="font-medium">
            <Trans i18nKey={'auth:signUpHeading'} />
          </span>
        </Heading>
      </div>

      <OAuthProviders onSignIn={onSignUp} />

      <If condition={configuration.auth.providers.emailPassword}>
        <div>
          <span className={'text-xs text-gray-400'}>
            <Trans i18nKey={'auth:orContinueWithEmail'} />
          </span>
        </div>

        <EmailPasswordSignUpContainer onSignUp={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.phoneNumber}>
        <PhoneNumberSignInContainer onSignIn={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.emailLink}>
        <EmailLinkAuth />
      </If>

      <div className={'flex justify-center text-xs'}>
        <p className={'flex space-x-1'}>
          <span>
            <Trans i18nKey={'auth:alreadyHaveAnAccount'} />
          </span>

          <Link
            className={'text-primary-800 hover:underline dark:text-primary-500'}
            to={SIGN_IN_PATH}
          >
            <Trans i18nKey={'auth:signIn'} />
          </Link>
        </p>
      </div>
    </>
  );
}
