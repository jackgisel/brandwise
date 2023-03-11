import { useMutation } from '@tanstack/react-query';

import type UserData from '~/core/session/types/user-data';
import { updateUserData } from '~/lib/user/database/mutations';
import useSupabase from '~/core/hooks/use-supabase';

type Payload = WithId<Partial<UserData>>;

/**
 * @name useUpdateProfile
 */
function useUpdateProfile() {
  const client = useSupabase();

  return useMutation(async (data: Payload) => {
    return updateUserData(client, data);
  });
}

export default useUpdateProfile;
