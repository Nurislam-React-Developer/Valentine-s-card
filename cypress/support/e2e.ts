// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  // Stub console methods to reduce noise in tests
  cy.stub(win.console, 'log')
  cy.stub(win.console, 'warn')
  cy.stub(win.console, 'error')
})

// Add custom commands for audio testing
Cypress.Commands.add('mockAudio', () => {
  cy.window().then((win) => {
    // Mock Howler.js
    ;(win as any).Howl = class MockHowl {
      constructor() {}
      play() { return this }
      pause() { return this }
      stop() { return this }
      volume() { return this }
      seek() { return this }
      duration() { return 180 }
      on() { return this }
      off() { return this }
      state() { return 'loaded' }
    }
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      mockAudio(): Chainable<void>
    }
  }
}