import { useNavigate } from '@remix-run/react';
import { Trans } from 'react-i18next';
import { useEffect } from 'react';

import useSupabase from '~/core/hooks/use-supabase';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';
import configuration from '~/configuration';

function AuthLinkPage() {
  useRedirectToHomeOnSignIn();

  return (
    <PageLoadingIndicator fullPage={true}>
      <Trans i18nKey={'auth:signingIn'} />
    </PageLoadingIndicator>
  );
}

function useRedirectToHomeOnSignIn() {
  const supabase = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        navigate(configuration.paths.appHome);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [supabase, navigate]);
}

export default AuthLinkPage;