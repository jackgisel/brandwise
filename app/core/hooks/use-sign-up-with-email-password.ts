import { useMutation } from '@tanstack/react-query';
import useSupabase from './use-supabase';
import configuration from '~/configuration';

interface Credentials {
  email: string;
  password: string;
}

/**
 * @name useSignUpWithEmailAndPassword
 */
function useSignUpWithEmailAndPassword() {
  const client = useSupabase();

  return useMutation((credentials: Credentials) => {
    const emailRedirectTo = [
      configuration.site.siteUrl,
      configuration.paths.onboarding,
    ].join('/');

    return client.auth
      .signUp({
        ...credentials,
        options: {
          emailRedirectTo,
        },
      })
      .then((response) => {
        if (response.error) {
          throw response.error;
        }

        return response.data;
      });
  });
}

export default useSignUpWithEmailAndPassword;
