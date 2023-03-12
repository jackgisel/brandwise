import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Trans } from 'react-i18next';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

import ClientOnly from '~/core/ui/ClientOnly';
import AppHeader from '~/components/AppHeader';
import AppContainer from '~/components/AppContainer';
import AccountsContainer from '~/components/accounts/AccountsListContainer';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

export const meta: MetaFunction = () => {
  return {
    title: 'Accounts',
  };
};

function AccountsPage() {
  const organization = useCurrentOrganization();

  return (
    <>
      <AppHeader>
        <span className={'flex space-x-2'}>
          <Squares2X2Icon className="w-6" />

          <span>
            <Trans i18nKey={'common:accountsTabLabel'} />
          </span>
        </span>
      </AppHeader>

      <ClientOnly>
        <AppContainer>
          {organization ? (
            <AccountsContainer organizationId={organization?.id.toString()} />
          ) : (
            <p>add an orgnizatgiono</p>
          )}
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default AccountsPage;
