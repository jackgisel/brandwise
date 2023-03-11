import { useMutation } from '@tanstack/react-query';
import type Organization from '~/lib/organizations/types/organization';
import useSupabase from '~/core/hooks/use-supabase';
import { updateOrganization } from '~/lib/organizations/database/mutations';

/**
 * @name useUpdateOrganizationMutation
 * @description Hook to update an organization's general information (name, logo and timezone)
 */
export default function useUpdateOrganizationMutation() {
  const client = useSupabase();

  return useMutation((organization: WithId<Partial<Organization>>) => {
    return updateOrganization(client, {
      data: organization,
      id: organization.id,
    });
  });
}
