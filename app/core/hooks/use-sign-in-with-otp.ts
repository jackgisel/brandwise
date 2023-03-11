import { useMutation } from '@tanstack/react-query';
import type { SignInWithPasswordlessCredentials } from '@supabase/gotrue-js';
import useSupabase from '~/core/hooks/use-supabase';

/**
 * @name useSignInWithOtp
 */
function useSignInWithOtp() {
  const client = useSupabase();

  return useMutation((credentials: SignInWithPasswordlessCredentials) => {
    return client.auth.signInWithOtp(credentials).then((result) => {
      if (result.error) {
        throw result.error;
      }

      return result.data;
    });
  });
}

export default useSignInWithOtp;
