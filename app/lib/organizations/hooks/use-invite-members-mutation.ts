import { useCallback } from 'react';
import { useSubmit } from '@remix-run/react';
import type MembershipRole from '../types/membership-role';
import useCsrfToken from '~/core/hooks/use-csrf-token';

interface Invite {
  email: string;
  role: MembershipRole;
}

function useInviteMembers() {
  const submit = useSubmit();
  const csrfToken = useCsrfToken();

  return useCallback(
    (invites: Invite[]) => {
      const data = {
        invites: JSON.stringify(invites),
        csrfToken: csrfToken ?? '',
      };

      return submit(data, {
        method: 'post',
      });
    },
    [submit, csrfToken]
  );
}

export default useInviteMembers;
