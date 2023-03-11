import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import ClientOnly from '~/core/ui/ClientOnly';

import configuration from '~/configuration';

const BILLING_PORTAL_REDIRECT_ENDPOINT = configuration.paths.api.billingPortal;

const BillingPortalRedirectButton: React.FCC<{
  customerId: string;
  className?: string;
}> = ({ children, customerId, className }) => {
  return (
    <form method="POST" action={BILLING_PORTAL_REDIRECT_ENDPOINT}>
      <input type={'hidden'} name={'customerId'} value={customerId} />

      <ClientOnly>
        <CsrfTokenInput />
      </ClientOnly>

      <Button color={'secondary'} className={className}>
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowRightIcon className={'h-5'} />
        </span>
      </Button>
    </form>
  );
};

function CsrfTokenInput() {
  const csrfToken = useCsrfToken();

  return <input type="hidden" name={'csrfToken'} defaultValue={csrfToken} />;
}

export default BillingPortalRedirectButton;
