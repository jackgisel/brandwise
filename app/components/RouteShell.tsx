import React from 'react';
import { Toaster } from 'react-hot-toast';
import SidebarContext from '~/lib/contexts/sidebar';

import useCollapsible from '~/core/hooks/use-sidebar-state';
import AppSidebar from '~/components/AppSidebar';
import GuardedPage from '~/components/GuardedPage';

const RouteShell: React.FCC<{
  sidebarCollapsed: boolean;
}> = (props) => {
  return (
    <GuardedPage whenSignedOut={'/'}>
      <main>
        <Toaster />

        <RouteShellWithSidebar collapsed={props.sidebarCollapsed}>
          {props.children}
        </RouteShellWithSidebar>
      </main>
    </GuardedPage>
  );
};

export default RouteShell;

function RouteShellWithSidebar(
  props: React.PropsWithChildren<{
    collapsed: boolean;
  }>
) {
  const [collapsed, setCollapsed] = useCollapsible(props.collapsed);

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <div className={'hidden lg:block'}>
          <AppSidebar />
        </div>

        <div className={'relative mx-auto h-screen w-full overflow-y-auto'}>
          <div>{props.children}</div>
        </div>
      </SidebarContext.Provider>
    </div>
  );
}
