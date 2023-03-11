import useCsrfToken from '~/core/hooks/use-csrf-token';

function AuthenticityToken() {
  const csrfToken = useCsrfToken();

  return <input type="hidden" value={csrfToken} name={'csrfToken'} />;
}

export default AuthenticityToken;
