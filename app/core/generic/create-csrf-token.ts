import Csrf from 'csrf';

/**
 * @name createCsrfToken
 * @param existingSecret
 */
async function createCsrfToken(existingSecret?: Maybe<unknown>) {
  const csrf = new Csrf();
  const useExistingSecret =
    existingSecret && typeof existingSecret === 'string';

  const secret = useExistingSecret ? existingSecret : await csrf.secret();
  const token = csrf.create(secret);

  return {
    token,
    secret,
  };
}

export default createCsrfToken;
