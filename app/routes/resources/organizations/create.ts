import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { z } from 'zod';

import requireSession from '~/lib/user/require-session';

import getSupabaseServerClient from '~/core/supabase/server-client';
import getLogger from '~/core/logger';
import withMethodsGuard from '~/core/middleware/with-methods-guard';
import withCsrf from '~/core/middleware/with-csrf';

export async function action({ request }: ActionArgs) {
  // validate request
  withMethodsGuard(request, ['POST']);

  const logger = getLogger();
  const client = getSupabaseServerClient(request);

  try {
    const session = await requireSession(client);
    const formData = await request.formData();

    const { name, csrfToken } = await getBodySchema().parseAsync(
      Object.fromEntries(formData)
    );

    await withCsrf(request, () => csrfToken);

    const userId = session.user.id;

    logger.info(
      {
        userId,
        name,
      },
      `Creating organization...`
    );

    const { data: organizationId, error } = await client
      .rpc('create_new_organization', {
        org_name: name,
        user_id: userId,
        create_user: false,
      })
      .throwOnError()
      .single();

    if (error) {
      return handleError(error);
    }

    logger.info(
      {
        userId,
        name,
      },
      `Organization successfully created`
    );

    return json({
      organizationId,
    });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  getLogger().error(
    {
      error,
    },
    'Error creating organization'
  );

  return json({ error: true });
}

function getBodySchema() {
  return z.object({
    name: z.string().min(1),
    csrfToken: z.string().min(1),
  });
}
