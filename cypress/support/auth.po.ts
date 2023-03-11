import { createBrowserClient } from '@supabase/auth-helpers-remix';
import invariant from 'tiny-invariant';

// we use a namespace not to pollute the IDE with methods from the tests
const authPageObject = {
  getDefaultUserEmail: () => Cypress.env(`USER_EMAIL`) as string,
  getDefaultUserPassword: () => Cypress.env(`USER_PASSWORD`) as string,
  getDefaultUserCredentials: () => {
    return {
      email: authPageObject.getDefaultUserEmail(),
      password: authPageObject.getDefaultUserPassword(),
    };
  },
  $getEmailInput: () => cy.cyGet(`email-input`),
  $getPasswordInput: () => cy.cyGet(`password-input`),
  $getRepeatPasswordInput: () => cy.cyGet(`repeat-password-input`),
  $getSubmitButton: () => cy.cyGet(`auth-submit-button`),
  $getErrorMessage: () => cy.cyGet(`auth-error-message`),
  $getAcceptInviteSubmitButton: () => cy.cyGet(`accept-invite-submit-button`),
  signInWithEmailAndPassword(email: string, password: string) {
    cy.wait(100);

    this.$getEmailInput().clear().type(email);
    this.$getPasswordInput().clear().type(password);
    this.$getSubmitButton().click();
  },
  signUpWithEmailAndPassword(
    email: string,
    password: string,
    repeatPassword?: string
  ) {
    cy.wait(100);

    this.$getEmailInput().clear().type(email);
    this.$getPasswordInput().clear().type(password);
    this.$getRepeatPasswordInput().type(repeatPassword || password);
    this.$getSubmitButton().click();
  },
  validateSession() {
    return cy
      .wrap(getClient().auth.getSession())
      .its('data')
      .should(`have.property`, `session`);
  },
  signInProgrammatically({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    return getClient()
      .auth.signInWithPassword({
        email,
        password,
      })
      .then((response) => {
        if (response.error) {
          return Promise.reject(response.error.message);
        }
      })
      .catch((e) => {
        console.error(e);

        return Promise.reject(e);
      });
  },
};

function getClient() {
  const url = Cypress.env(`SUPABASE_URL`);
  const key = Cypress.env(`SUPABASE_ANON_KEY`);

  invariant(url, `Missing SUPABASE_URL env variable`);
  invariant(key, `Missing SUPABASE_ANON_KEY env variable`);

  return createBrowserClient(url, key);
}

export default authPageObject;
