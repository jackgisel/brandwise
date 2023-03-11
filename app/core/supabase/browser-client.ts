import { createBrowserClient } from '@supabase/auth-helpers-remix';
import getEnv from '~/core/get-env';
import invariant from 'tiny-invariant';
import type { Database } from '../../database.types';

let client: ReturnType<typeof createBrowserClient<Database>>;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const env = getEnv();

  invariant(env.SUPABASE_URL, `Supabase URL was not provided`);
  invariant(env.SUPABASE_ANON_KEY, `Supabase Anon key was not provided`);

  client = createBrowserClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY
  );

  return client;
}
