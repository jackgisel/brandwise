import type { LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/node';

import { serializeOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import getSupabaseServerClient from '~/core/supabase/server-client';
import { getOrganizationById } from '~/lib/organizations/database/queries';
import HttpStatusCode from '~/core/generic/http-status-code.enum';

/**
 * Redirects to the path with the organization id in the cookie
 * Useful to change organization or deep-link to a specific organization
 *
 * /1/dashboard will redirect to /dashboard with the organization id in the cookie
 * /4/settings/organization will redirect to /settings/organization with the organization id in the cookie
 */
export async function loader({ params, request }: LoaderArgs) {
  const client = getSupabaseServerClient(request);
  const segments = params['*']?.split('/') ?? [];
  const organizationId = segments[0];
  const path = segments.slice(1).join('/');

  if (organizationId) {
    try {
      const organization = await getOrganizationById(
        client,
        Number(organizationId)
      );

      if (organization.data) {
        const cookie = await serializeOrganizationIdCookie(
          Number(organizationId)
        );

        const headers = {
          'Set-Cookie': cookie,
        };

        return redirect(path, {
          headers,
        });
      }
    } catch (error) {
      // organization not found
    }
  }

  throw new Response(null, { status: HttpStatusCode.NotFound });
}

function OrganizationSplatRoute() {
  return <></>;
}

export default OrganizationSplatRoute;
