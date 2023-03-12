import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';
import Alert from '~/core/ui/Alert';
import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import useFetchAccounts from '~/lib/accounts/hooks/use-fetch-accounts';
import type { Account } from '~/lib/accounts/types/account';

const AccountsContainer: React.FC<{
  organizationId: string;
}> = ({ organizationId }) => {
  const { data, error, isLoading } = useFetchAccounts(organizationId);

  const accounts: Account[] = data || [];

  if (isLoading) {
    return <PageLoadingIndicator>Loading accounts...</PageLoadingIndicator>;
  }

  if (error) {
    return (
      <Alert type={'error'}>
        Sorry, we encountered an error while fetching your accounts.
      </Alert>
    );
  }

  if (accounts.length === 0) {
    return <AccountsEmptyState />;
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'mt-2 flex justify-end'}>
        <CreateTaskButton>New Account</CreateTaskButton>
      </div>

      <AccountsList accounts={accounts} />
    </div>
  );
};

function AccountsEmptyState() {
  return (
    <div
      className={
        'flex h-full flex-col items-center justify-center space-y-4 p-24'
      }
    >
      <div>
        <Heading type={5}>No accounts linked</Heading>
      </div>

      <CreateTaskButton>Connect your first account</CreateTaskButton>
    </div>
  );
}

function AccountsList({
  accounts,
}: React.PropsWithChildren<{
  accounts: Account[];
}>) {
  return (
    <div className={'flex flex-col space-y-4'}>
      {accounts.map((account) => {
        return <p key={account.id}>{account.id}</p>;
      })}
    </div>
  );
}

function CreateTaskButton(props: React.PropsWithChildren) {
  return <Button href={'/tasks/new'}>{props.children}</Button>;
}

export default AccountsContainer;
