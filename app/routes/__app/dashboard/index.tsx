import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Trans } from 'react-i18next';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

import DashboardDemo from '~/components/dashboard/DashboardDemo';
import ClientOnly from '~/core/ui/ClientOnly';
import AppHeader from '~/components/AppHeader';
import AppContainer from '~/components/AppContainer';

export const meta: MetaFunction = () => {
  return {
    title: 'Dashboard',
  };
};

function DashboardPage() {
  return (
    <>
      <AppHeader>
        <span className={'flex space-x-2'}>
          <Squares2X2Icon className="w-6" />

          <span>
            <Trans i18nKey={'common:dashboardTabLabel'} />
          </span>
        </span>
      </AppHeader>

      <ClientOnly>
        <AppContainer>
          <DashboardDemo />
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default DashboardPage;
