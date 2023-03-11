import { useMutation } from '@tanstack/react-query';
import useSupabase from '~/core/hooks/use-supabase';
import type { UserAttributes } from '@supabase/gotrue-js';

/**
 * @name useUpdateUserMutation
 */
function useUpdateUserMutation() {
  const client = useSupabase();

  return useMutation((attributes: UserAttributes) => {
    return client.auth.updateUser(attributes).then((response) => {
      if (response.error) {
        throw response.error;
      }

      return response.data;
    });
  });
}

export default useUpdateUserMutation;
