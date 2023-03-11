import { redirect } from '@remix-run/node';
import type { SupabaseClient } from '@supabase/supabase-js';
import configuration from '~/configuration';

/**
 * @name requireSession
 * @param client
 */
async function requireSession(client: SupabaseClient) {
  const { data, error } = await client.auth.getSession();

  if (!data.session || error) {
    throw redirect(configuration.paths.signIn);
  }

  return data.session;
}

export default requireSession;
