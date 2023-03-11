import { useCallback } from 'react';
import { useFetcher } from '@remix-run/react';
import type MembershipRole from '../types/membership-role';
import configuration from '~/configuration';
import useCsrfToken from '~/core/hooks/use-csrf-token';

interface Params {
  role: MembershipRole;
}

/**
 * @name useUpdateMemberRequest
 * @description Mutation to update the role of a member within an organization.
 * @param membershipId
 */
function useUpdateMemberRequest(membershipId: number) {
  const fetcher = useFetcher();
  const csrfToken = useCsrfToken();

  const action = [
    configuration.paths.api.organizations.members,
    membershipId,
  ].join(`/`);

  return useCallback(
    (params: Params) => {
      const role = params.role.toString();

      return fetcher.submit(
        {
          role,
          csrfToken,
        },
        {
          action,
          method: `put`,
        }
      );
    },
    [action, fetcher, csrfToken]
  );
}

export default useUpdateMemberRequest;
