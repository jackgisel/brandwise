import { useQuery } from '@tanstack/react-query';
import useSupabase from '~/core/hooks/use-supabase';

/**
 * @name useUser
 */
function useUser() {
  const client = useSupabase();
  const key = 'user';

  return useQuery([key], async () => {
    return client.auth.getUser().then((result) => {
      return result.data.user;
    }).catch(() => undefined);
  });
}

export default useUser;
