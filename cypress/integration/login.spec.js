/// <reference types="cypress" />

context('login page', () => {
  beforeEach(() => {
    cy.visit('https://ana.myika.co')
  })

  it('should show signin and register btns', () => {
    cy.get('[type="submit"]')
      .should('have.text', 'Sign In')
    cy.get('[href="/register"]')
      .should('have.text', 'Register')
  })

  it('should show active bots after login', () => {
    cy.intercept('/login', { fixture: 'loginSuccess.json' }).as('loginUser')
    cy.intercept('/bots?*', { fixture: 'getAllBots.json' }).as('getBots')
    cy.intercept('/webhooks*', { fixture: 'getPublicWebhookConns.json' })
      .as('getPublicWebhookConns')
    cy.intercept('/webhook*', { fixture: 'getPrivateWebhookConns.json' })
      .as('getPrivateWebhookConns')

    cy.get('[type="email"]')
      .type('t@trader.com').should('have.value', 't@trader.com')
    cy.get('[type="password"]')
      .type('trader')
    cy.get('[type="submit"]').click()

    cy.wait('@loginUser').then((interception) => {
      assert.strictEqual(interception.response.statusCode, 200)
      console.log(interception.response.body)
    })
    cy.wait('@getBots').then((interception) => {
      assert.strictEqual(interception.response.statusCode, 200)
      console.log(interception.response.body)
    })
  })
})
