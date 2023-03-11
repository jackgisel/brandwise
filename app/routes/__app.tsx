import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLoaderData } from '@remix-run/react';

import type UserSession from '~/core/session/types/user-session';
import type Organization from '~/lib/organizations/types/organization';
import loadAppData from '~/lib/server/loaders/load-app-data';

import OrganizationContext from '~/lib/contexts/organization';
import CsrfTokenContext from '~/lib/contexts/csrf';
import UserSessionContext from '~/core/session/contexts/user-session';

import RouteShell from '~/components/RouteShell';
import AuthChangeListenerProvider from '~/components/AuthChangeListenerProvider';

export const loader = loadAppData;

function AppRoot() {
  const data = useLoaderData<typeof loadAppData>();

  const userSessionContext: UserSession = useMemo(() => {
    return {
      auth: data.session,
      data: data.user,
      role: data.role,
    };
  }, [data]);

  const [organization, setOrganization] = useState<Maybe<Organization>>(
    data.organization || undefined
  );

  const [userSession, setUserSession] =
    useState<Maybe<UserSession>>(userSessionContext);

  const updateCurrentOrganization = useCallback(() => {
    setOrganization(data.organization ?? undefined);
  }, [data.organization]);

  const updateCurrentUser = useCallback(() => {
    if (userSessionContext.auth) {
      setUserSession(userSessionContext);
    }
  }, [userSessionContext]);

  useEffect(updateCurrentOrganization, [updateCurrentOrganization]);
  useEffect(updateCurrentUser, [updateCurrentUser]);

  const sidebarCollapsed = data?.ui?.sidebarState === 'collapsed';

  return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
      <OrganizationContext.Provider value={{ organization, setOrganization }}>
        <CsrfTokenContext.Provider value={data.csrfToken}>
          <AuthChangeListenerProvider>
            <RouteShell sidebarCollapsed={sidebarCollapsed}>
              <Outlet />
            </RouteShell>
          </AuthChangeListenerProvider>
        </CsrfTokenContext.Provider>
      </OrganizationContext.Provider>
    </UserSessionContext.Provider>
  );
}

export default AppRoot;
