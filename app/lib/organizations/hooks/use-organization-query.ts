import useSupabase from '~/core/hooks/use-supabase';
import { getOrganizationById } from '~/lib/organizations/database/queries';
import { useQuery } from '@tanstack/react-query';

/**
 * @name useOrganizationQuery
 * @description Returns a stream with the selected organization's data
 * @param organizationId
 */
function useOrganizationQuery(organizationId: number) {
  const client = useSupabase();
  const key = ['organization', organizationId];

  return useQuery(key, async () => {
    return getOrganizationById(client, organizationId).then(
      (result) => result.data
    );
  });
}

export default useOrganizationQuery;
