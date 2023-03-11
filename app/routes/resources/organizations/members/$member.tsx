import type { ActionArgs } from '@remix-run/node';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { json } from '@remix-run/node';

import withMethodsGuard from '~/core/middleware/with-methods-guard';
import MembershipRole from '~/lib/organizations/types/membership-role';

import {
  deleteMembershipById,
  updateMembershipById,
} from '~/lib/memberships/mutations';

import getSupabaseServerClient from '~/core/supabase/server-client';
import withCsrf from '~/core/middleware/with-csrf';
import getLogger from '~/core/logger';

export async function action({ request, params }: ActionArgs) {
  withMethodsGuard(request, ['DELETE', 'PUT']);

  try {
    const membershipId = Number(params.member);
    const { error } = await handleMemberRequest(request, membershipId);

    if (error) {
      return handleError(error);
    }

    return json({
      success: true,
    });
  } catch (error) {
    return handleError(error);
  }
}

async function handleMemberRequest(request: Request, membershipId: number) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const client = getSupabaseServerClient(request);
  const { csrfToken } = getCsrfTokenSchema().parse(body);

  // validate CSRF token
  await withCsrf(request, () => csrfToken);

  switch (request.method.toLowerCase()) {
    case 'delete':
      return handleRemoveMemberRequest(client, membershipId);

    case 'put':
      return handleUpdateMemberRequest(client, membershipId, body);
  }

  throw new Error(`Unsupported method: ${request.method}`);
}

async function handleRemoveMemberRequest(
  client: SupabaseClient,
  membershipId: number
) {
  return deleteMembershipById(client, membershipId);
}

function handleUpdateMemberRequest(
  client: SupabaseClient,
  membershipId: number,
  body: UnknownObject
) {
  const role = getRoleSchema().parse(Number(body.role));

  return updateMembershipById(client, {
    id: membershipId,
    role,
  });
}

function handleError(error: unknown) {
  getLogger().error(
    {
      error,
    },
    `Error handling member request`
  );

  return json({ error: true });
}

function getCsrfTokenSchema() {
  return z.object({
    csrfToken: z.string().min(1),
  });
}

function getRoleSchema() {
  return z.nativeEnum(MembershipRole);
}
