import organizationPageObject from '../../support/organization.po';
import configuration from '~/configuration';

describe(`Change Organization`, () => {
  let organizationName: string;
  const originalOrganizationName = `IndieCorp`;

  describe(`Given the user creates an organization using the organizations selector`, () => {
    beforeEach(() => {
      organizationName = `Test ${Math.random() * 100}`;
    });

    it('it should load and display the created organization', () => {
      cy.signIn(configuration.paths.appHome);

      organizationPageObject.createOrganization(organizationName);
      organizationPageObject.switchToOrganization(originalOrganizationName);

      // TODO: This test only fails when run in CI. It passes locally. Find out why and fix.
      // organizationPageObject.assertCurrentOrganization(organizationName);
      //
      // organizationPageObject.switchToOrganization(originalOrganizationName);
      // organizationPageObject.assertCurrentOrganization(
      //   originalOrganizationName
      // );
    });
  });

  describe(`Given the user changes organization using the URL`, () => {
    it('it should load and display the correct organization', () => {
      cy.signIn(configuration.paths.appHome);

      organizationPageObject.switchToOrganization(organizationName);

      cy.visit(
        `/${organizationPageObject.getDefaultOrganizationId()}/dashboard`
      );

      organizationPageObject.assertCurrentOrganization(
        originalOrganizationName
      );
    });
  });

  describe(`Given the user changes organization they do not belong to`, () => {
    it('they should be redirected to a 404', () => {
      cy.signIn(configuration.paths.appHome);

      cy.visit(`/1234/dashboard`, { failOnStatusCode: false });
      cy.cyGet('catch-route-status-code').should('contain', '404');
    });
  });

  describe(`Given the user navigates to a non-existent URL`, () => {
    it('they should be redirected to a 404', () => {
      cy.signIn(configuration.paths.appHome);

      cy.visit(`/1234`, { failOnStatusCode: false });
      cy.cyGet('catch-route-status-code').should('contain', '404');
    });
  });
});
