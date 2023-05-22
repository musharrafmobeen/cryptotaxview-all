describe('Sign in / Sign up', () => {
    it('Sees if frontend has loaded properly', () => {
        cy.visit(Cypress.env('web_address'))
        cy.contains('Sign in with Google')
    })
    // This email will be added to database. Therefore whole cycle needs to be written so that the user can delete it
    var email = "" + String(new Date().getTime()) + "@test.com"
    var passwd = 'tech123'
    it('Signing up', () => {
        //const email = "testing"+String(new Date().getTime()) + "@testing.com"
        if (Cypress.env('web_address') === "http://www.cryptotaxview.com:85") {
            email = "saqib@javed.com"
            passwd = "saqib"
        } else {
            cy.visit(Cypress.env('web_address') + "/signup")
            cy.get('#SignUpFirstName').type('Testing')
            cy.get('#SignUpLastName').type('Techgenix')
            cy.get('#SignUpEmailAddress').type(email)
            cy.get('#SignUpPassword').type(passwd)
            cy.get('#SignUpPasswordReEnter').type(passwd)
            cy.get('#btn-sign-up').click()
            cy.contains('Welcome to CryptoTaxView')
            cy.contains('Holdings')
        }

    })
    it("Sign in", () => {
        cy.visit(Cypress.env('web_address'))
        cy.get('#signInEmail').type(email)
        cy.get('#signInPassword').type(passwd)
        cy.get('#btn-sign-in').click()
        cy.contains('Currency')
    })
})
