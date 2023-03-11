import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { z } from 'zod';

import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';

import {
  throwBadRequestException,
  throwForbiddenException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import withCsrf from '~/core/middleware/with-csrf';
import withMethodsGuard from '~/core/middleware/with-methods-guard';
import getLogger from '~/core/logger';

import getSupabaseServerClient from '~/core/supabase/server-client';
import { getUserDataById } from '~/lib/server/queries';
import requireSession from '~/lib/user/require-session';

import { transferOwnership } from '~/lib/memberships/mutations';

export async function action(args: ActionArgs) {
  const req = args.request;

  withMethodsGuard(req, ['PUT']);

  const formData = await req.formData();

  const result = await getBodySchema().safeParseAsync(
    Object.fromEntries(formData)
  );

  // validate the form data
  if (!result.success) {
    throw throwBadRequestException();
  }

  // validate CSRF token
  await withCsrf(req, () => result.data.csrfToken);

  const logger = getLogger();
  const client = getSupabaseServerClient(req);

  const organizationId = Number(await parseOrganizationIdCookie(req));

  const targetUserMembershipId = result.data.membershipId;
  const session = await requireSession(client);
  const currentUserId = session.user.id;
  const currentUser = await getUserDataById(client, currentUserId);

  logger.info(
    {
      organizationId,
      currentUserId,
      targetUserMembershipId,
    },
    `Transferring organization ownership`
  );

  // return early if we can't get the current user
  if (!currentUser) {
    return throwForbiddenException(`User is not logged in or does not exist`);
  }

  // transfer ownership to the target user
  const { error } = await transferOwnership(client, {
    organizationId,
    targetUserMembershipId,
  });

  if (error) {
    logger.error(
      {
        error,
        organizationId,
        currentUserId,
        targetUserMembershipId,
      },
      `Error transferring organization ownership`
    );

    return throwInternalServerErrorException(`Error transferring ownership`);
  }

  // all done! we log the result and return a 200
  logger.info(
    {
      organizationId,
      currentUserId,
      targetUserMembershipId,
    },
    `Ownership successfully transferred to target user`
  );

  return json({ success: true });
}

function getBodySchema() {
  return z.object({
    membershipId: z.coerce.number(),
    csrfToken: z.string().min(1),
  });
}
