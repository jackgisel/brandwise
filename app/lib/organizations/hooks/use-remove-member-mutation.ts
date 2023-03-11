import { useFetcher } from '@remix-run/react';
import { useCallback } from 'react';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import configuration from '~/configuration';

/*
 * @name useRemoveMember
 * @description Mutation to remove a member from an organization.
 * @param membershipId
 */
function useRemoveMember() {
  const csrfToken = useCsrfToken();
  const fetcher = useFetcher();

  return useCallback(
    (membershipId: number) => {
      const action = [
        configuration.paths.api.organizations.members,
        membershipId,
      ].join(`/`);

      return fetcher.submit(
        {
          csrfToken,
        },
        {
          action,
          method: `delete`,
        }
      );
    },
    [csrfToken, fetcher]
  );
}

export default useRemoveMember;
