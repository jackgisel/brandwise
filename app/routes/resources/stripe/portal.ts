import { z } from 'zod';
import { join } from 'path';
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { SupabaseClient } from '@supabase/supabase-js';

import configuration from '~/configuration';

import getApiRefererPath from '~/core/generic/get-api-referer-path';
import HttpStatusCode from '~/core/generic/http-status-code.enum';

import { canChangeBilling } from '~/lib/organizations/permissions';
import createBillingPortalSession from '~/lib/stripe/create-billing-portal-session';

import withCsrf from '~/core/middleware/with-csrf';
import getLogger from '~/core/logger';

import { throwNotFoundException } from '~/core/http-exceptions';

import getSupabaseServerClient from '~/core/supabase/server-client';
import requireSession from '~/lib/user/require-session';

import { getOrganizationByCustomerId } from '~/lib/organizations/database/queries';
import { getUserMembershipByOrganization } from '~/lib/memberships/queries';

export async function action(props: ActionArgs) {
  const req = props.request;
  const data = await req.formData();
  const body = Object.fromEntries(data.entries());
  const bodyResult = await getBodySchema().safeParseAsync(body);
  const referrerPath = getApiRefererPath(req.headers);

  // Validate the body schema
  if (!bodyResult.success) {
    return redirectToErrorPage(referrerPath);
  }

  const { customerId, csrfToken } = bodyResult.data;

  // verify CSRF token
  await withCsrf(req, csrfToken);

  const client = getSupabaseServerClient(req);
  const logger = getLogger();
  const session = await requireSession(client);
  const userId = session.user.id;

  // get permissions to see if the user can access the portal
  const canAccess = await getUserCanAccessCustomerPortal(client, {
    customerId,
    userId,
  });

  // validate that the user can access the portal
  if (!canAccess) {
    return redirectToErrorPage(referrerPath);
  }

  try {
    const headers = req.headers;
    const referer = headers.get('referer');
    const origin = headers.get('origin');
    const returnUrl = referer || origin || configuration.paths.appHome;

    // get the Stripe Billing Portal session
    const { url } = await createBillingPortalSession({
      returnUrl,
      customerId,
    });

    // redirect to the Stripe Billing Portal
    return redirect(url, {
      status: HttpStatusCode.SeeOther,
    });
  } catch (error) {
    logger.error(error, `Stripe Billing Portal redirect error`);

    return redirectToErrorPage(referrerPath);
  }
}

/**
 * @name getUserCanAccessCustomerPortal
 * @description Returns whether a user {@link userId} has access to the
 * Stripe portal of an organization with customer ID {@link customerId}
 */
async function getUserCanAccessCustomerPortal(
  client: SupabaseClient,
  params: {
    customerId: string;
    userId: string;
  }
) {
  try {
    const { data: organization } = await getOrganizationByCustomerId(
      client,
      params.customerId
    );

    const organizationId = organization?.id;

    if (!organizationId) {
      return throwNotFoundException(
        `Organization not found for customer ${params.customerId}`
      );
    }

    const { role } = await getUserMembershipByOrganization(client, {
      organizationId,
      userId: params.userId,
    });

    if (role === undefined) {
      return false;
    }

    return canChangeBilling(role);
  } catch (e) {
    getLogger().error(e, `Could not retrieve user role`);

    return false;
  }
}

function getBodySchema() {
  return z.object({
    customerId: z.string().min(1),
    csrfToken: z.string().min(1),
  });
}

function redirectToErrorPage(referrerPath: string) {
  const url = join(referrerPath, `?error=true`);

  return redirect(url);
}
