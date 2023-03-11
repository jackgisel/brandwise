import { useFetcher } from '@remix-run/react';
import { useCallback } from 'react';
import configuration from '~/configuration';
import useCsrfToken from '~/core/hooks/use-csrf-token';

const url = configuration.paths.api.organizations.transferOwnership;

function useTransferOrganizationOwnership() {
  const fetcher = useFetcher();
  const csrfToken = useCsrfToken();

  return useCallback(
    (membershipId: number) => {
      return fetcher.submit(
        {
          membershipId: membershipId.toString(),
          csrfToken,
        },
        {
          method: `put`,
          action: url,
        }
      );
    },
    [fetcher, csrfToken]
  );
}

export default useTransferOrganizationOwnership;
