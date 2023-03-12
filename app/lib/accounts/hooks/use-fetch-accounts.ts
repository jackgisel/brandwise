import { useQuery } from '@tanstack/react-query';
import useSupabase from '~/core/hooks/use-supabase';
import { getAccounts } from '../types/queries';

export function useFetchAccounts(organizationId: string) {
  const client = useSupabase();
  const key = ['accounts', organizationId];

  return useQuery(key, async () => {
    return getAccounts(client, organizationId).then((res) => res.data);
  });
}

export default useFetchAccounts;
