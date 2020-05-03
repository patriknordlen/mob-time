describe("Mob turns", () => {
    ["", "pomodoro"].forEach(features => {
        describe(`with features : ${features}`, () => {
            process.env.FEATURES = features
            it("can be started", () => {
                cy.join("cypress-test-mob");
                cy.get("#start-pause").click();
                isTurnStarted();
                cy.get("#start-pause").click();
            });
            it("can be interrupted", () => {
                cy.join("cypress-test-mob");
                cy.get("#start-pause").click();
                cy.get("#start-pause").click();
                isTurnStopped();
            });
        });
    });
});

function isTurnStarted() {
    cy.get("#container").should('have.class', 'counting');
    cy.get("#time-left")
      .should('have.css', 'display', 'inline-block')
      .and('not.contain.text', '0 s');
}
function isTurnStopped() {
    cy.get("#container").should('not.have.class', 'counting');
    cy.get("#time-left")
      .should('have.css', 'display', 'none');
}