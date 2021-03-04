describe('My First Test', () => {
  it('Does not do much!', () => {
    cy.visit('https://raulgsalguero82.github.io/')
    expect(true).to.equal(true)
	cy.wait(1000)
  })
})