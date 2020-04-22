describe("Mob name with spaces", () => {
    it("can have a turn started", () => {
        cy.visit("http://localhost:3000/");
        cy.get("#mob-name").type("with spaces");
        cy.get("#submit").click();
        cy.get("#start-pause").click();
        cy.get("#container").should('have.class', 'counting');
        cy.get("#time-left")
          .should('have.css', 'display', 'inline-block')
          .and('not.contain.text', '0 s');
    })
})