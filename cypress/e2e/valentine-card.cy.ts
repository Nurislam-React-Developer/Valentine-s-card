describe('Valentine Card', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the main valentine card', () => {
    cy.get('[data-testid="valentine-card"]').should('be.visible')
    cy.contains('Ты моё сердечко, ❤️').should('be.visible')
  })

  it('shows heart animation', () => {
    cy.get('[data-testid="heart-animation"]').should('be.visible')
    cy.get('[data-testid="heart-icon"]').should('be.visible')
  })

  it('displays audio player', () => {
    cy.get('[data-testid="audio-player"]').should('be.visible')
    cy.get('[data-testid="play-button"]').should('be.visible')
  })

  it('can open settings modal', () => {
    cy.get('[data-testid="settings-button"]').click()
    cy.get('[data-testid="theme-modal"]').should('be.visible')
    cy.contains('Выберите тему').should('be.visible')
  })

  it('can change theme', () => {
    cy.get('[data-testid="settings-button"]').click()
    cy.get('[data-testid="theme-option-romantic"]').click()
    cy.get('[data-testid="valentine-card"]').should('have.class', 'romantic')
  })

  it('can edit message', () => {
    cy.get('[data-testid="edit-message-button"]').click()
    cy.get('[data-testid="message-modal"]').should('be.visible')
    
    cy.get('[data-testid="message-input"]')
      .clear()
      .type('Новое сообщение любви')
    
    cy.get('[data-testid="save-message-button"]').click()
    cy.contains('Новое сообщение любви').should('be.visible')
  })

  it('can interact with audio player', () => {
    cy.get('[data-testid="play-button"]').click()
    cy.get('[data-testid="pause-button"]').should('be.visible')
    
    cy.get('[data-testid="volume-slider"]').should('be.visible')
    cy.get('[data-testid="progress-bar"]').should('be.visible')
  })

  it('displays floating particles', () => {
    cy.get('[data-testid="floating-particle"]').should('have.length.at.least', 1)
  })

  it('is responsive on mobile', () => {
    cy.viewport('iphone-x')
    cy.get('[data-testid="valentine-card"]').should('be.visible')
    cy.get('[data-testid="heart-animation"]').should('be.visible')
    cy.get('[data-testid="audio-player"]').should('be.visible')
  })
})