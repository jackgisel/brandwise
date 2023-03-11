import PhoneNumberCredentialForm from '~/components/auth/PhoneNumberCredentialForm';

const PhoneNumberSignInContainer: React.FC<{
  onSignIn: () => unknown;
}> = ({ onSignIn }) => {
  return <PhoneNumberCredentialForm action={'signIn'} onSuccess={onSignIn} />;
};

export default PhoneNumberSignInContainer;
