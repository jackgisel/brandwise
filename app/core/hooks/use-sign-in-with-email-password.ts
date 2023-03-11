import { useMutation } from '@tanstack/react-query';
import useSupabase from './use-supabase';

interface Credentials {
  email: string;
  password: string;
}

/**
 * @name useSignInWithEmailPassword
 */
function useSignInWithEmailPassword() {
  const client = useSupabase();

  return useMutation((credentials: Credentials) => {
    return client.auth.signInWithPassword(credentials).then((response) => {
      if (response.error) {
        throw response.error;
      }

      return response.data;
    });
  });
}

export default useSignInWithEmailPassword;
