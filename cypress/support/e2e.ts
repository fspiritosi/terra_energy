import './commands';

beforeEach(() => {
  cy.session(
    'test-session',
    () => {
      cy.login();
    },
    {
      cacheAcrossSpecs: true,
    }
  );
});
