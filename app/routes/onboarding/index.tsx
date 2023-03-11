import { useCallback, useState } from 'react';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { z } from 'zod';
import { Trans } from 'react-i18next';

import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import Button from '~/core/ui/Button';
import { throwBadRequestException } from '~/core/http-exceptions';

import type { OrganizationInfoStepData } from '~/components/onboarding/OrganizationInfoStep';
import OrganizationInfoStep from '~/components/onboarding/OrganizationInfoStep';
import OnboardingIllustration from '~/components/onboarding/OnboardingIllustration';
import CompleteOnboardingStep from '~/components/onboarding/CompleteOnboardingStep';

import getCurrentOrganization from '~/lib/server/organizations/get-current-organization';
import completeOnboarding from '~/lib/server/onboarding/complete-onboarding';
import withMethodsGuard from '~/core/middleware/with-methods-guard';
import UserSessionContext from '~/core/session/contexts/user-session';
import type UserSession from '~/core/session/types/user-session';

import configuration from '~/configuration';
import getSupabaseServerClient from '~/core/supabase/server-client';

import { getUserDataById } from '~/lib/server/queries';
import { serializeOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import requireSession from '~/lib/user/require-session';
import HttpStatusCode from '~/core/generic/http-status-code.enum';
import getLogger from '~/core/logger';

interface Data {
  organization: string;
}

export const meta: MetaFunction = () => {
  return {
    title: `Onboarding - ${configuration.site.siteName}`,
  };
};

const Onboarding = () => {
  const data = useLoaderData() as UserSession;

  const [currentStep, setCurrentStep] = useState(0);
  const [userSession, setUserSession] = useState<Maybe<UserSession>>(data);
  const [formData, setFormData] = useState<Data>();

  const onFirstStepSubmitted = useCallback(
    (organizationInfo: OrganizationInfoStepData) => {
      setFormData({
        organization: organizationInfo.organization,
      });

      setCurrentStep(1);
    },
    []
  );

  return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
      <div className={'flex flex-1 flex-col dark:bg-black-500'}>
        <div className={'flex divide-x divide-gray-100 dark:divide-black-300'}>
          <div
            className={
              'flex h-screen w-full flex-1 flex-col items-center justify-center lg:w-6/12'
            }
          >
            <div className={'absolute top-24 hidden lg:flex'}>
              <Logo href={'/onboarding'} />
            </div>

            <div className={'w-9/12'}>
              <If condition={currentStep === 0}>
                <OrganizationInfoStep onSubmit={onFirstStepSubmitted} />
              </If>

              <If condition={currentStep === 1 && formData}>
                {(formData) => <CompleteOnboardingStep data={formData} />}
              </If>
            </div>
          </div>

          <div
            className={
              'hidden w-6/12 flex-1 items-center justify-center bg-gray-50 dark:bg-black-400 lg:flex'
            }
          >
            <div>
              <OnboardingIllustration />
            </div>
          </div>
        </div>
      </div>
    </UserSessionContext.Provider>
  );
};

export default Onboarding;

export function CatchBoundary() {
  const navigate = useNavigate();

  return (
    <div
      className={
        'flex h-screen w-full flex-1 flex-col items-center justify-center'
      }
    >
      <div className={'flex flex-col items-center space-y-8'}>
        <div>
          <Logo />
        </div>

        <Alert type={'error'}>
          <Alert.Heading>
            <Trans i18nKey={'common:genericServerError'} />
          </Alert.Heading>

          <Trans i18nKey={'common:genericServerErrorHeading'} />
        </Alert>

        <Button onClick={() => navigate('.')}>
          <Trans i18nKey={'common:retry'} />
        </Button>
      </div>
    </div>
  );
}

export async function action(args: ActionArgs) {
  const req = args.request;
  const formData = await req.formData();
  const body = JSON.parse(formData.get('data') as string);
  const parsedBody = await getBodySchema().safeParseAsync(body);

  if (!parsedBody.success) {
    return throwBadRequestException(`Invalid body data`);
  }

  // validate that the request is POST
  withMethodsGuard(req, ['POST']);

  const logger = getLogger();
  const client = await getSupabaseServerClient(req);
  const { user } = await requireSession(client);

  const userId = user.id;
  const organizationName = parsedBody.data.organization;

  const payload = {
    userId,
    organizationName,
    client,
  };

  logger.info(
    {
      userId,
    },
    `Completing onboarding for user...`
  );

  try {
    // complete onboarding and get the organization id created
    const organizationId = await completeOnboarding(payload);

    logger.info(
      {
        userId,
        organizationId,
      },
      `Onboarding successfully completed for user`
    );

    // set the organization id cookie
    const headers = new Headers({
      'Set-Cookie': await serializeOrganizationIdCookie(organizationId),
    });

    // redirect to the home page
    return redirect(configuration.paths.appHome, {
      headers,
    });
  } catch (error) {
    logger.error({ error }, `Failed to complete onboarding`);

    return json({}, { status: HttpStatusCode.InternalServerError });
  }
}

export async function loader(args: LoaderArgs) {
  const client = getSupabaseServerClient(args.request);
  const session = await requireSession(client);
  const userData = await getUserDataById(client, session.user.id);

  // if we cannot find the user's Database record
  // the user should go to the onboarding flow
  // so that the record wil be created after the end of the flow
  if (!userData) {
    const response: UserSession = {
      auth: session.user || undefined,
      data: userData ?? undefined,
      role: undefined,
    };

    return json(response);
  }

  const userId = userData.id;

  const organization = await getCurrentOrganization(client, {
    userId,
  });

  const onboarded = userData.onboarded;

  // there are two cases when we redirect the user to the onboarding
  // 1. if they have not been onboarded yet
  // 2. if they end up with 0 organizations (for example, if they get removed)
  //
  // NB: you should remove this if you want to
  // allow organization-less users within the application
  if (onboarded && organization) {
    throw redirectToAppHome();
  }

  const response: UserSession = {
    auth: session.user || undefined,
    data: userData,
    role: undefined,
  };

  return json(response);
}

function redirectToAppHome() {
  return redirect(configuration.paths.appHome);
}

function getBodySchema() {
  return z.object({
    organization: z.string(),
  });
}
