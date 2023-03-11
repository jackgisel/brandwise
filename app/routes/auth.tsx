import { Outlet } from '@remix-run/react';
import loadAuthPageData from '~/lib/server/loaders/load-auth-page-data';
import AuthPageShell from '~/components/auth/AuthPageShell';

export const loader = loadAuthPageData;

function AuthLayout() {
  return (
    <AuthPageShell>
      <Outlet />
    </AuthPageShell>
  );
}

export default AuthLayout;
