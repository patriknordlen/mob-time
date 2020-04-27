describe("Room", () => {
    it("cannot be created from the url directly", () => {
        // If it was possible it would bypass the naming rules
        cy.request({url: "http://localhost:3000/new-room", failOnStatusCode: false})
          .its("status").should("equal", 404);
        cy.visit({url: "http://localhost:3000/new-room", failOnStatusCode: false});
        cy.contains("The new-room mob does not seem to exist. You can create it from the home page.");
    });
});