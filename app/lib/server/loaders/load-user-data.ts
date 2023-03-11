import type { LoaderArgs } from '@remix-run/server-runtime';
import { getUserDataById } from '~/lib/server/queries';
import getSupabaseServerClient from '~/core/supabase/server-client';

/**
 * @name loadUserData
 * @description Loads the user's data from Supabase Auth and Database
 * @param args
 */
async function loadUserData(args: LoaderArgs) {
  const client = getSupabaseServerClient(args.request);
  try {
    const { data, error } = await client.auth.getUser();

    if (!data.user || error) {
      return emptyUserData();
    }

    const userData = await getUserDataById(client, data.user.id);

    return {
      auth: data.user,
      data: userData,
      role: undefined,
    };
  } catch (e) {
    return emptyUserData();
  }
}

function emptyUserData() {
  return {
    auth: undefined,
    data: undefined,
    role: undefined,
  };
}

export default loadUserData;
