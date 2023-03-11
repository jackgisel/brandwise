import { json, redirect } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/server-runtime';

import HttpStatusCode from '~/core/generic/http-status-code.enum';
import createCsrfCookie from '~/core/generic/create-csrf-token';
import getCurrentOrganization from '~/lib/server/organizations/get-current-organization';
import {
  parseCsrfSecretCookie,
  serializeCsrfSecretCookie,
} from '~/lib/server/cookies/csrf-secret.cookie';

import {
  parseOrganizationIdCookie,
  serializeOrganizationIdCookie,
} from '~/lib/server/cookies/organization.cookie';

import getUIStateCookies from '~/lib/server/loaders/utils/get-ui-state-cookies';

import configuration from '~/configuration';
import getSupabaseServerClient from '~/core/supabase/server-client';
import requireSession from '~/lib/user/require-session';
import { getUserDataById } from '../queries';
import getLogger from '~/core/logger';

const loadAppData = async ({ request }: LoaderArgs) => {
  try {
    const client = getSupabaseServerClient(request);
    const { user } = await requireSession(client);

    // if for any reason we're not able to fetch the user's data, we redirect
    // back to the login page
    if (!user) {
      return redirectToLogin(request.url);
    }

    // we fetch the user record from the Database
    // which is a separate object from the auth metadata
    const userRecord = await getUserDataById(client, user.id);
    const isOnboarded = Boolean(userRecord?.onboarded);

    // when the user is not yet onboarded,
    // we simply redirect them back to the onboarding flow
    if (!isOnboarded || !userRecord) {
      return redirectToOnboarding();
    }

    const currentOrganizationId = Number(
      await parseOrganizationIdCookie(request)
    );

    // we fetch the current organization
    const organizationData = await getCurrentOrganization(client, {
      userId: userRecord.id,
      organizationId: currentOrganizationId,
    });

    // if it's not found, we redirect the user to the onboarding flow
    if (!organizationData) {
      return redirectToOnboarding();
    }

    const headers = new Headers();

    // if the organization is found, save the ID in a cookie
    // so that we can fetch it on the next request
    const organizationIdCookie = await serializeOrganizationIdCookie(
      organizationData.organization.id
    );

    // add the organization ID cookie to the response headers
    headers.append('Set-Cookie', organizationIdCookie);

    // add the CSRF token cookie to the response headers
    const csrfSecretCookieValue = await parseCsrfSecretCookie(request);
    const { token: csrfToken, secret } = await createCsrfCookie(
      csrfSecretCookieValue
    );

    headers.append('Set-Cookie', await serializeCsrfSecretCookie(secret));

    // get UI state from cookies
    const ui = await getUIStateCookies(request);

    return json(
      {
        csrfToken,
        session: user,
        user: userRecord,
        organization: organizationData?.organization,
        role: organizationData?.role,
        ui,
      },
      {
        headers,
      }
    );
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    getLogger().warn(
      `Could not load application data: ${JSON.stringify(error)}`
    );

    // in case of any error, we redirect the user to the home page
    // to avoid any potential infinite loop
    return redirectToHomePage();
  }
};

function redirectToOnboarding() {
  return redirect(configuration.paths.onboarding);
}

function redirectToLogin(
  returnUrl: string,
  redirectPath = configuration.paths.signIn
) {
  // we build the sign in URL
  // appending the "returnUrl" query parameter so that we can redirect the user
  // straight to where they were headed and the "signOut" parameter
  // to force the client to sign the user out from the client SDK
  const destination = `${redirectPath}?returnUrl=${returnUrl}&signOut=true`;

  return redirect(destination, {
    status: HttpStatusCode.SeeOther,
  });
}

function redirectToHomePage() {
  return redirect('/', {
    status: HttpStatusCode.SeeOther,
  });
}

export default loadAppData;
