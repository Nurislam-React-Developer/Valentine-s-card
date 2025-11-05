/// <reference types="cypress" />

// Custom commands for Valentine Card testing

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('waitForAudioLoad', () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      // Wait for audio to be ready
      setTimeout(resolve, 1000)
    })
  })
})

Cypress.Commands.add('checkAccessibility', () => {
  // Basic accessibility checks
  cy.get('button').should('have.attr', 'type')
  cy.get('img').should('have.attr', 'alt')
  cy.get('input').should('have.attr', 'aria-label').or('have.attr', 'placeholder')
})

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      waitForAudioLoad(): Chainable<void>
      checkAccessibility(): Chainable<void>
    }
  }
}