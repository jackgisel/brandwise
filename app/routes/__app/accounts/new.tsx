import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Trans } from 'react-i18next';
import { UserCircleIcon } from '@heroicons/react/24/outline';

import ClientOnly from '~/core/ui/ClientOnly';
import AppHeader from '~/components/AppHeader';
import AppContainer from '~/components/AppContainer';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';
import AddAccountContainer from '~/components/accounts/AddAccountContainer';

export const meta: MetaFunction = () => {
  return {
    title: 'Add Account',
  };
};

function NewAccountPage() {
  const organization = useCurrentOrganization();

  if (!organization?.id) {
    return;
  }

  return (
    <>
      <AppHeader>
        <span className={'flex space-x-2'}>
          <UserCircleIcon className="w-6" />

          <span>
            <Trans i18nKey={'common:accountsTabLabel'} />
          </span>
        </span>
      </AppHeader>

      <ClientOnly>
        <AppContainer>
          <AddAccountContainer organizationId={organization.id.toString()} />
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default NewAccountPage;
