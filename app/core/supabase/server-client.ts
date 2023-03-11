import { createServerClient } from '@supabase/auth-helpers-remix';
import getEnv from '~/core/get-env';
import invariant from 'tiny-invariant';
import type { Database } from '../../database.types';

function getSupabaseServerClient(request: Request, params = { admin: false }) {
  const response = new Response();
  const env = getEnv();

  invariant(env.SUPABASE_URL, `Supabase URL not provided`);
  invariant(env.SUPABASE_ANON_KEY, `Supabase Anon Key not provided`);

  if (params.admin) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    invariant(serviceRoleKey, `Supabase Service Role Key not provided`);

    return createServerClient<Database>(env.SUPABASE_URL, serviceRoleKey, {
      request,
      response,
    });
  }

  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    request,
    response,
  });
}

export default getSupabaseServerClient;
