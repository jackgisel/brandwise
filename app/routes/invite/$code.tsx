import { useCallback, useState } from 'react';
import { Trans } from 'react-i18next';
import { z } from 'zod';
import type { User } from '@supabase/gotrue-js';

import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useSubmit, useNavigation } from '@remix-run/react';

import {
  parseCsrfSecretCookie,
  serializeCsrfSecretCookie,
} from '~/lib/server/cookies/csrf-secret.cookie';

import If from '~/core/ui/If';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';

import configuration from '~/configuration';
import isBrowser from '~/core/generic/is-browser';

import OAuthProviders from '~/components/auth/OAuthProviders';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

import GuardedPage from '~/components/GuardedPage';
import createCsrfToken from '~/core/generic/create-csrf-token';
import CsrfTokenContext from '~/lib/contexts/csrf';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
  throwNotFoundException,
} from '~/core/http-exceptions';

import EmailPasswordSignUpContainer from '~/components/auth/EmailPasswordSignUpContainer';
import EmailPasswordSignInContainer from '~/components/auth/EmailPasswordSignInContainer';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';

import useCsrfToken from '~/core/hooks/use-csrf-token';
import withCsrf from '~/core/middleware/with-csrf';
import getLogger from '~/core/logger';
import AuthCatchBoundary from '~/components/auth/AuthCatchBoundary';
import getSupabaseServerClient from '~/core/supabase/server-client';
import useSignOut from '~/core/hooks/use-sign-out';

import { getMembershipByInviteCode } from '~/lib/memberships/queries';
import { acceptInviteToOrganization } from '~/lib/memberships/mutations';
import { getOrganizationCookie } from '~/lib/server/cookies/organization.cookie';
import requireSession from '~/lib/user/require-session';

enum Mode {
  SignUp,
  SignIn,
}

export const CatchBoundary = AuthCatchBoundary;

export const meta: MetaFunction = () => {
  return {
    title: `Join Organization`,
  };
};

const InvitePage = () => {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const membership = data.membership;
  const organization = membership.organization;

  if (navigation.state === 'submitting') {
    return (
      <PageLoadingIndicator>
        <Trans
          i18nKey={'auth:addingToOrganization'}
          values={{ name: organization.name }}
          components={{ b: <b /> }}
        />
      </PageLoadingIndicator>
    );
  }

  return (
    <>
      <Heading type={4}>
        <Trans
          i18nKey={'auth:joinOrganizationHeading'}
          values={{
            organization: organization.name,
          }}
        />
      </Heading>

      <div>
        <p className={'text-center'}>
          <Trans
            i18nKey={'auth:joinOrganizationSubHeading'}
            values={{
              organization: organization.name,
            }}
            components={{ b: <b /> }}
          />
        </p>

        <p className={'text-center'}>
          <If condition={!data.user}>
            <Trans i18nKey={'auth:signUpToAcceptInvite'} />
          </If>
        </p>
      </div>

      <CsrfTokenContext.Provider value={data.csrfToken}>
        <AcceptInviteContainer code={data.code} user={data.user} />
      </CsrfTokenContext.Provider>
    </>
  );
};

function AcceptInviteContainer({
  user,
  code,
}: React.PropsWithChildren<{
  user: Maybe<User> | null;
  code: string;
}>) {
  const signOut = useSignOut();
  const submit = useSubmit();
  const csrfToken = useCsrfToken();
  const navigation = useNavigation();
  const redirectOnSignOut = getRedirectPath();
  const [mode, setMode] = useState<Mode>(Mode.SignUp);

  const onInviteAccepted = useCallback(() => {
    const body = {
      csrfToken,
      code,
    };

    return submit(body, {
      method: 'post',
    });
  }, [csrfToken, code, submit]);

  if (navigation.state !== 'idle') {
    return <PageLoadingIndicator />;
  }

  return (
    <>
      {/* FLOW FOR AUTHENTICATED USERS */}
      <If condition={user}>
        <GuardedPage whenSignedOut={redirectOnSignOut}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              return onInviteAccepted();
            }}
            className={'flex flex-col space-y-8'}
          >
            <p className={'text-center text-sm'}>
              <Trans
                i18nKey={'auth:clickToAcceptAs'}
                values={{ email: user?.email }}
                components={{ b: <b /> }}
              />
            </p>

            <Button data-cy={'accept-invite-submit-button'} type={'submit'}>
              <Trans i18nKey={'auth:acceptInvite'} />
            </Button>

            <div>
              <div className={'flex flex-col space-y-2'}>
                <p className={'text-center'}>
                  <span
                    className={
                      'text-center text-sm text-gray-700 dark:text-gray-300'
                    }
                  >
                    <Trans i18nKey={'auth:acceptInviteWithDifferentAccount'} />
                  </span>
                </p>

                <Button
                  block
                  color={'transparent'}
                  size={'small'}
                  onClick={signOut}
                  type={'button'}
                >
                  <Trans i18nKey={'auth:signOut'} />
                </Button>
              </div>
            </div>
          </form>
        </GuardedPage>
      </If>

      {/* FLOW FOR NEW USERS */}
      <If condition={!user}>
        <OAuthProviders onSignIn={onInviteAccepted} />

        <If condition={configuration.auth.providers.emailPassword}>
          <If condition={mode === Mode.SignUp}>
            <div className={'flex w-full flex-col items-center space-y-4'}>
              <EmailPasswordSignUpContainer onSubmit={onInviteAccepted} />

              <Button
                block
                color={'transparent'}
                size={'small'}
                onClick={() => setMode(Mode.SignIn)}
              >
                <Trans i18nKey={'auth:alreadyHaveAccountStatement'} />
              </Button>
            </div>
          </If>

          <If condition={mode === Mode.SignIn}>
            <div className={'flex w-full flex-col items-center space-y-4'}>
              <EmailPasswordSignInContainer onSignIn={onInviteAccepted} />

              <Button
                block
                color={'transparent'}
                size={'small'}
                onClick={() => setMode(Mode.SignUp)}
              >
                <Trans i18nKey={'auth:doNotHaveAccountStatement'} />
              </Button>
            </div>
          </If>
        </If>

        <If condition={configuration.auth.providers.phoneNumber}>
          <PhoneNumberSignInContainer onSignIn={onInviteAccepted} />
        </If>

        <If condition={configuration.auth.providers.emailLink}>
          <EmailLinkAuth />
        </If>
      </If>
    </>
  );
}

export default InvitePage;

export async function loader(args: LoaderArgs) {
  const logger = getLogger();
  const code = args.params.code as string;

  try {
    // we use an admin client to be able to read the pending membership
    const adminClient = getSupabaseServerClient(args.request, { admin: true });

    const { data: membership, error } = await getMembershipByInviteCode<{
      id: number;
      code: string;
      organization: {
        name: string;
        id: number;
      };
    }>(adminClient, {
      code,
      query: `
      id,
      code,
      organization: organization_id (
        name,
        id
      )
    `,
    });

    // if the invite wasn't found, it's 404
    if (error) {
      logger.warn(
        {
          code,
        },
        `User navigated to invite page, but it wasn't found. Redirecting to home page...`
      );

      return throwNotFoundException();
    }

    const { data: userSession } = await adminClient.auth.getSession();
    const user = userSession?.session?.user;

    const csrfSecretValue = await parseCsrfSecretCookie(args.request);
    const { token: csrfToken, secret } = await createCsrfToken(csrfSecretValue);

    const headers = {
      'Set-Cookie': await serializeCsrfSecretCookie(secret),
    };

    return json(
      {
        user,
        membership,
        csrfToken,
        code,
      },
      {
        headers,
      }
    );
  } catch (error) {
    logger.error(
      error,
      `Error encountered while fetching invite. Redirecting to home page...`
    );

    return redirectToHomePage();
  }
}

/**
 * @name action
 * @param args
 */
export async function action(args: ActionArgs) {
  const req = args.request;
  const formData = await req.formData();
  const fields = Object.fromEntries(formData.entries());
  const result = await getBodySchema().safeParseAsync(fields);

  // validate the form data
  if (!result.success) {
    return throwBadRequestException();
  }

  const { code, csrfToken } = result.data;

  // validate CSRF token
  await withCsrf(req, csrfToken);

  const logger = getLogger();
  const adminClient = getSupabaseServerClient(req, { admin: true });

  const organizationIdCookie = await getOrganizationCookie();
  const { user } = await requireSession(adminClient);
  const userId = user.id;

  logger.info(
    {
      code,
      userId,
    },
    `Adding member to organization...`
  );

  try {
    const { data, error } = await acceptInviteToOrganization(adminClient, {
      code,
      userId,
    });

    if (error) {
      return throwInternalServerErrorException();
    }

    const result = data as { organization: number; membership: number };
    const organizationId = result.organization;
    const membershipId = result.membership;

    logger.info(
      {
        membershipId,
        organizationId,
        userId,
      },
      `Member successfully added to organization`
    );

    const requireEmailConfirmation =
      configuration.auth.requireEmailConfirmation;

    // if email confirmation is required, we redirect users to the sign-in page
    if (requireEmailConfirmation) {
      return redirect(configuration.paths.signIn);
    }

    const headers = new Headers();

    const organizationCookie = await organizationIdCookie.serialize(
      organizationId
    );

    headers.set('Set-Cookie', organizationCookie);

    // otherwise, we redirect to the app home page
    return redirect(configuration.paths.appHome, {
      headers,
    });
  } catch (error) {
    logger.error(
      {
        error,
        code,
        userId,
      },
      `Encountered an error while accepting invite`
    );

    return throwInternalServerErrorException();
  }
}

function redirectToHomePage() {
  return redirect('/');
}

function getRedirectPath() {
  return isBrowser() ? window.location.pathname : undefined;
}

function getBodySchema() {
  return z.object({
    code: z.string().min(1),
    csrfToken: z.string().min(1),
  });
}
