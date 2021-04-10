/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('https://ana.myika.co')
  })

  it('should show signin and register btns', () => {
    cy.get('[type="submit"]')
      .should('have.text', 'Sign In')
    cy.get('[href="/register"]')
      .should('have.text', 'Register')
  })
})
