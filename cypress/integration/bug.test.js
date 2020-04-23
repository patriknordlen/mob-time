describe("Mob name with spaces", () => {
    it("can have a turn started", () => {
        cy.join("with spaces");
        cy.get("#start-pause").click();
        cy.get("#container").should('have.class', 'counting');
        cy.get("#time-left")
          .should('have.css', 'display', 'inline-block')
          .and('not.contain.text', '0 s');
        cy.get("#start-pause").click();
    });
});