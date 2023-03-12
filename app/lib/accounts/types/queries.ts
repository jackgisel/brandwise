import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'app/database.types';
import { ACCOUNTS_TABLE } from '~/lib/db-tables';

type Client = SupabaseClient<Database>;

export function getAccounts(client: Client, organizationId: string) {
  return client
    .from(ACCOUNTS_TABLE)
    .select(
      `
    id,
    name,
    image,
    type,
    organizationId: organization_id,
    connectAt: connect_at
    `
    )
    .eq('organization_id', organizationId)
    .throwOnError();
}
