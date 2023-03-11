import { Trans } from 'react-i18next';
import type { ActionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import { z } from 'zod';

import {
  throwForbiddenException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import getLogger from '~/core/logger';
import Button from '~/core/ui/Button';

import withMethodsGuard from '~/core/middleware/with-methods-guard';
import getSupabaseServerClient from '~/core/supabase/server-client';
import withCsrf from '~/core/middleware/with-csrf';

import inviteMembers from '~/lib/server/organizations/invite-members';
import InviteMembersForm from '~/components/organizations/InviteMembersForm';
import SettingsTile from '~/components/settings/SettingsTile';

import MembershipRole from '~/lib/organizations/types/membership-role';
import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import requireSession from '~/lib/user/require-session';
import Alert from '~/core/ui/Alert';

export const meta: MetaFunction = () => {
  return {
    title: 'Invite Members',
  };
};

export async function action(props: ActionArgs) {
  const req = props.request;

  // validate request method is POST
  withMethodsGuard(req, ['POST']);

  const formData = await req.formData();
  const body = Object.fromEntries(formData);

  const { invites, csrfToken } = await getBodySchema().parseAsync({
    invites: JSON.parse(body.invites as string),
    csrfToken: body.csrfToken,
  });

  // validate CSRF token
  await withCsrf(req, () => csrfToken);

  const organizationId = Number(await parseOrganizationIdCookie(req));
  const client = getSupabaseServerClient(req);
  const { user } = await requireSession(client);
  const inviterId = user.id;

  // throw an error when we cannot retrieve the inviter's id or the organization id
  if (!inviterId || !organizationId) {
    return throwForbiddenException(`Inviter or organization not found`);
  }

  const adminClient = getSupabaseServerClient(req, { admin: true });

  const params = {
    client,
    adminClient,
    invites,
    organizationId,
    inviterId,
  };

  try {
    // send requests to invite members
    await inviteMembers(params);

    // once successful, redirect to the members page
    return redirect('/settings/organization/members');
  } catch (e) {
    getLogger().error(e, `Error when inviting user to organization`);

    return throwInternalServerErrorException();
  }
}

export const CatchBoundary = () => {
  return (
    <Alert type={'error'}>
      <Trans i18nKey={'organization:inviteMembersError'} />
    </Alert>
  );
};

const OrganizationMembersInvitePage = () => {
  return (
    <>
      <SettingsTile
        heading={<Trans i18nKey={'organization:inviteMembersPageHeading'} />}
        subHeading={
          <Trans i18nKey={'organization:inviteMembersPageSubheading'} />
        }
      >
        <InviteMembersForm />
      </SettingsTile>

      <div className={'mt-4'}>
        <GoBackToMembersButton />
      </div>
    </>
  );
};

export default OrganizationMembersInvitePage;

function GoBackToMembersButton() {
  return (
    <Button
      size={'small'}
      color={'transparent'}
      href={'/settings/organization/members'}
    >
      <span className={'flex items-center space-x-1'}>
        <ArrowLeftIcon className={'h-3'} />

        <span>
          <Trans i18nKey={'organization:goBackToMembersPage'} />
        </span>
      </span>
    </Button>
  );
}

function getBodySchema() {
  return z.object({
    invites: z.array(
      z.object({
        role: z.nativeEnum(MembershipRole),
        email: z.string().email(),
      })
    ),
    csrfToken: z.string().min(1),
  });
}
