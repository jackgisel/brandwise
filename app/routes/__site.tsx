import { Outlet, useLoaderData } from '@remix-run/react';
import { useState } from 'react';

import UserSessionContext from '~/core/session/contexts/user-session';
import type UserSession from '~/core/session/types/user-session';
import SiteHeader from '~/components/SiteHeader';
import Footer from '~/components/Footer';

import loadUserData from '~/lib/server/loaders/load-user-data';

export const loader = loadUserData;

function SiteLayout() {
  const { userSession, setUserSession } = useSiteLayoutData();

  return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </UserSessionContext.Provider>
  );
}

function useSiteLayoutData() {
  const loaderData = useLoaderData<typeof loadUserData>();

  const [userSession, setUserSession] = useState<Maybe<UserSession>>({
    data: 'data' in loaderData && loaderData.data ? loaderData.data : undefined,
    auth: 'auth' in loaderData && loaderData.auth ? loaderData.auth : undefined,
    role: undefined,
  });

  return { userSession, setUserSession };
}

export default SiteLayout;
