import type { SignInWithOAuthCredentials } from '@supabase/gotrue-js';
import { useMutation } from '@tanstack/react-query';
import useSupabase from '~/core/hooks/use-supabase';

/**
 * @name useSignInWithProvider
 */
function useSignInWithProvider() {
  const client = useSupabase();

  return useMutation(async (credentials: SignInWithOAuthCredentials) => {
    return client.auth.signInWithOAuth(credentials).then((response) => {
      if (response.error) {
        throw response.error;
      }

      return response.data;
    });
  });
}

export default useSignInWithProvider;
