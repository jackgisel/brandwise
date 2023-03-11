import { useQuery } from '@tanstack/react-query';

import useUserId from '~/core/hooks/use-user-id';
import { getUserById } from '~/lib/user/database/queries';
import useSupabase from '~/core/hooks/use-supabase';

/*
 * @name useFetchUserSession
 * @description Fetches the user data from the database to be used
 * in pages where we don't SSR
 */
function useFetchUserData() {
  const client = useSupabase();
  const userId = useUserId();

  return useQuery(
    ['user-data'],
    async () => {
      return getUserById(client, userId as string).then((res) => res.data);
    },
    {
      enabled: !!userId,
    }
  );
}

export default useFetchUserData;
