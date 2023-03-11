import type { FormEvent } from 'react';
import { useCallback } from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { Trans } from 'react-i18next';

import configuration from '~/configuration';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';
import TextField from '~/core/ui/TextField';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import loadAuthPageData from '~/lib/server/loaders/load-auth-page-data';
import useResetPassword from '~/core/hooks/use-reset-password';

export const loader = loadAuthPageData;

export const meta: MetaFunction = () => {
  return {
    title: 'Password Reset',
  };
};

function PasswordResetPage() {
  const resetPasswordMutation = useResetPassword();
  const error = resetPasswordMutation.error;
  const success = resetPasswordMutation.isSuccess;

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const email = data.get('email') as string;
      const redirectTo = getReturnUrl();

      await resetPasswordMutation.mutateAsync({
        email,
        redirectTo,
      });
    },
    [resetPasswordMutation]
  );

  return (
    <>
      <div>
        <Heading type={6}>
          <span className={'font-medium'}>
            <Trans i18nKey={'auth:passwordResetLabel'} />
          </span>
        </Heading>
      </div>

      <div className={'flex flex-col space-y-4'}>
        <If condition={success}>
          <Alert type={'success'}>
            <Trans i18nKey={'auth:passwordResetSuccessMessage'} />
          </Alert>
        </If>

        <If condition={!resetPasswordMutation.data}>
          <>
            <form
              onSubmit={(e) => void onSubmit(e)}
              className={'container mx-auto flex justify-center'}
            >
              <div className={'flex-col space-y-4'}>
                <div>
                  <p className={'text-sm text-gray-700 dark:text-gray-400'}>
                    <Trans i18nKey={'auth:passwordResetSubheading'} />
                  </p>
                </div>

                <div>
                  <TextField.Label>
                    <Trans i18nKey={'common:emailAddress'} />

                    <TextField.Input
                      name="email"
                      required
                      type="email"
                      placeholder={'your@email.com'}
                    />
                  </TextField.Label>
                </div>

                <AuthErrorMessage error={error} />

                <Button
                  loading={resetPasswordMutation.isLoading}
                  type="submit"
                  block
                >
                  <Trans i18nKey={'auth:passwordResetLabel'} />
                </Button>
              </div>
            </form>
          </>
        </If>

        <div className={'flex justify-center text-xs'}>
          <p className={'flex space-x-1'}>
            <span>
              <Trans i18nKey={'auth:passwordRecoveredQuestion'} />
            </span>

            <Link
              className={
                'text-primary-800 hover:underline dark:text-primary-500'
              }
              to={configuration.paths.signIn}
            >
              <Trans i18nKey={'auth:signIn'} />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default PasswordResetPage;

/**
 * @description
 * Return the URL where the user will be redirected to after resetting
 * their password. By default, we will redirect to the sign-in page
 */
function getReturnUrl() {
  return `${window.location.origin}${configuration.paths.signIn}`;
}
