import { useCallback, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';

import AuthErrorMessage from './AuthErrorMessage';
import EmailPasswordSignUpForm from '~/components/auth/EmailPasswordSignUpForm';
import useSignUpWithEmailAndPasswordMutation from '~/core/hooks/use-sign-up-with-email-password';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import configuration from '~/configuration';

const requireEmailConfirmation = configuration.auth.requireEmailConfirmation;

const EmailPasswordSignUpContainer: React.FCC<{
  onSignUp?: () => unknown;
  onSubmit?: () => void;
  onError?: (error?: unknown) => unknown;
}> = ({ onSignUp, onSubmit, onError }) => {
  const signUpMutation = useSignUpWithEmailAndPasswordMutation();
  const redirecting = useRef(false);
  const loading = signUpMutation.isLoading || redirecting.current;
  const [showVerifyEmailAlert, setShowVerifyEmailAlert] = useState(false);

  const callOnErrorCallback = useCallback(() => {
    if (signUpMutation.error && onError) {
      onError(signUpMutation.error);
    }
  }, [signUpMutation.error, onError]);

  useEffect(() => {
    callOnErrorCallback();
  }, [callOnErrorCallback]);

  const onSignupRequested = useCallback(
    async (params: { email: string; password: string }) => {
      if (loading) {
        return;
      }

      try {
        await signUpMutation.mutateAsync(params);

        // If the user is required to confirm their email, we display a message
        if (requireEmailConfirmation) {
          setShowVerifyEmailAlert(true);

          if (onSubmit) {
            onSubmit();
          }
        } else {
          // Otherwise, we redirect the user to the onboarding page
          onSignUp && onSignUp();
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    },
    [loading, onError, onSignUp, onSubmit, signUpMutation]
  );

  return (
    <>
      <If condition={showVerifyEmailAlert}>
        <Alert type={'success'}>
          <Alert.Heading>
            <Trans i18nKey={'auth:emailConfirmationAlertHeading'} />
          </Alert.Heading>

          <p data-cy={'email-confirmation-alert'}>
            <Trans i18nKey={'auth:emailConfirmationAlertBody'} />
          </p>
        </Alert>
      </If>

      <If condition={!showVerifyEmailAlert}>
        <AuthErrorMessage error={signUpMutation.error} />

        <EmailPasswordSignUpForm
          onSubmit={onSignupRequested}
          loading={loading}
        />
      </If>
    </>
  );
};

export default EmailPasswordSignUpContainer;
