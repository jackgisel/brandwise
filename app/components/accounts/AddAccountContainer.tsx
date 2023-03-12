import Button from '~/core/ui/Button';

const accounts = [
  {
    id: 'Facebook',
    name: 'Facebook',
  },
];

const AddAccountContainer: React.FC<{
  organizationId: string;
}> = ({ organizationId }) => {
  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'mt-2 flex justify-end'}>
        <ConnectAccountButton>Connect Account</ConnectAccountButton>
      </div>
    </div>
  );
};

function ConnectAccountButton(props: React.PropsWithChildren) {
  return <Button href={'/accounts/new'}>{props.children}</Button>;
}

export default AddAccountContainer;
