import { useMutation } from '@tanstack/react-query';
import useSupabase from '~/core/hooks/use-supabase';

/**
 * @name useResetPassword
 */
function useResetPassword() {
  const client = useSupabase();

  return useMutation((params: { email: string; redirectTo: string }) => {
    return client.auth
      .resetPasswordForEmail(params.email, {
        redirectTo: params.redirectTo,
      })
      .then((result) => {
        if (result.error) {
          throw result.error;
        }

        return result.data;
      });
  });
}

export default useResetPassword;
