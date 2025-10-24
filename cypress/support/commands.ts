declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email?: string, password?: string) => {
  const user = email ?? (Cypress.env('TEST_EMAIL') as string) ?? 'test@test.com';
  const pass = password ?? (Cypress.env('TEST_PASSWORD') as string) ?? '123456';

  cy.visit('/auth/login');
  cy.get('input#email').clear().type(user, { log: false });
  cy.get('input#password').clear().type(pass, { log: false });
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 15000 }).should('include', '/dashboard');
});

export {};
