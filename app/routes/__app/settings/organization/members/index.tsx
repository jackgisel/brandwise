import type { LoaderArgs } from '@remix-run/server-runtime';
import type { MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Trans } from 'react-i18next';
import type { User } from '@supabase/gotrue-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import SettingsTile from '~/components/settings/SettingsTile';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';
import useUserCanInviteUsers from '~/lib/organizations/hooks/use-user-can-invite-users';
import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';

import {
  getFirstOrganizationByUserId,
  getMembersAuthMetadata,
  getOrganizationInvitedMembers,
  getOrganizationMembers,
} from '~/lib/organizations/database/queries';

import configuration from '~/configuration';
import getSupabaseServerClient from '~/core/supabase/server-client';
import type MembershipRole from '~/lib/organizations/types/membership-role';
import type UserData from '~/core/session/types/user-data';

import OrganizationMembersList from '~/components/organizations/OrganizationMembersList';
import OrganizationInvitedMembersList from '~/components/organizations/OrganizationInvitedMembersList';
import requireSession from '~/lib/user/require-session';

export const meta: MetaFunction = () => {
  return {
    title: 'Members',
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const client = getSupabaseServerClient(request, {
    admin: true,
  });

  let organizationId = await parseOrganizationIdCookie(request);
  const { user } = await requireSession(client);

  if (organizationId === undefined) {
    organizationId = await getFirstOrganizationByUserId(client, user.id).then(
      (result) => result?.data?.organization.id
    );
  }

  if (!organizationId) {
    return redirect(configuration.paths.appHome);
  }

  const [members, { data: invitedMembers }] = await Promise.all([
    fetchOrganizationMembers(client, organizationId).catch(() => []),
    getOrganizationInvitedMembers(client, organizationId),
  ]);

  return json({
    members,
    invitedMembers,
  });
};

const OrganizationMembersPage = () => {
  const data = useLoaderData<typeof loader>();
  const canInviteUsers = useUserCanInviteUsers();
  const organization = useCurrentOrganization();
  const organizationId = organization?.id;

  if (!organizationId) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <SettingsTile
        heading={<Trans i18nKey={'organization:membersTabLabel'} />}
        subHeading={<Trans i18nKey={'organization:membersTabSubheading'} />}
        actions={
          <If condition={canInviteUsers}>
            <InviteMembersButton />
          </If>
        }
      >
        <OrganizationMembersList members={data.members} />
      </SettingsTile>

      <SettingsTile
        heading={<Trans i18nKey={'organization:pendingInvitesHeading'} />}
        subHeading={<Trans i18nKey={'organization:pendingInvitesSubheading'} />}
      >
        <OrganizationInvitedMembersList
          invitedMembers={data.invitedMembers || []}
        />
      </SettingsTile>
    </div>
  );
};

export default OrganizationMembersPage;

function InviteMembersButton() {
  return (
    <Button
      size={'small'}
      className={'w-full lg:w-auto'}
      data-cy={'invite-form-link'}
      type="button"
      href={'/settings/organization/members/invite'}
    >
      <span className="flex items-center space-x-2">
        <UserPlusIcon className="h-5" />

        <span>
          <Trans i18nKey={'organization:inviteMembersButtonLabel'} />
        </span>
      </span>
    </Button>
  );
}

function getMembersPayload<
  T extends {
    data: UserData;
    role: MembershipRole;
  }
>(members: Array<T | null>, users: User[]) {
  type NonNullMembers = Exclude<T, null>;

  return members
    .filter((value): value is NonNullMembers => !!value)
    .sort((prev, next) => {
      return next.role > prev.role ? 1 : -1;
    })
    .map((member) => {
      const authInfo = users.find((user) => {
        return user.id === member.data.id;
      }) as User;

      return {
        ...member,
        auth: authInfo,
      };
    });
}

async function fetchOrganizationMembers(
  client: SupabaseClient,
  organizationId: number
) {
  const { data, error } = await getOrganizationMembers(client, organizationId);

  if (error) {
    return [];
  }

  const userIds = data.map((member) => member.data.id).filter(Boolean);
  const users = await getMembersAuthMetadata(client, userIds);

  return getMembersPayload(data, users);
}
