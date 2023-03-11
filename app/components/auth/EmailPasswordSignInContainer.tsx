import { useEffect } from 'react';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import EmailPasswordSignInForm from '~/components/auth/EmailPasswordSignInForm';
import useSignInWithEmailPassword from '~/core/hooks/use-sign-in-with-email-password';

const EmailPasswordSignInContainer: React.FCC<{
  onSignIn: () => unknown;
}> = ({ onSignIn }) => {
  const signInMutation = useSignInWithEmailPassword();
  const isLoading = signInMutation.isLoading;

  useEffect(() => {
    if (signInMutation.isSuccess) {
      onSignIn();
    }
  }, [onSignIn, signInMutation.isSuccess]);

  return (
    <>
      <AuthErrorMessage error={signInMutation.error} />

      <EmailPasswordSignInForm
        onSubmit={signInMutation.mutate}
        loading={isLoading}
      />
    </>
  );
};

export default EmailPasswordSignInContainer;
