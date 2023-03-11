import type { LoaderArgs } from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/node';

import createCsrfToken from '~/core/generic/create-csrf-token';
import getSupabaseServerClient from '~/core/supabase/server-client';

import {
  parseCsrfSecretCookie,
  serializeCsrfSecretCookie,
} from '~/lib/server/cookies/csrf-secret.cookie';

import configuration from '~/configuration';

const loadAuthPageData = async ({ request }: LoaderArgs) => {
  try {
    const client = getSupabaseServerClient(request);

    const {
      data: { session },
    } = await client.auth.getSession();

    if (session) {
      return redirect(configuration.paths.appHome);
    }

    return continueToLoginPage(request);
  } catch (e) {
    return continueToLoginPage(request);
  }
};

async function getCsrfTokenHeaders(existingSecret?: string) {
  const headers = new Headers();
  const { secret, token } = await createCsrfToken(existingSecret);

  headers.append('Set-Cookie', await serializeCsrfSecretCookie(secret));

  return {
    headers,
    token,
  };
}

async function continueToLoginPage(request: Request) {
  const csrfSecretValue = await parseCsrfSecretCookie(request);
  const { headers, token } = await getCsrfTokenHeaders(csrfSecretValue);

  return json(
    {
      csrfToken: token,
    },
    {
      headers,
    }
  );
}

export default loadAuthPageData;
