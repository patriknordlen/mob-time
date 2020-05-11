describe("Mob turns", () => {
    ["default", "pomodoro"].forEach(features => {
        describe(`with features : ${features}`, () => {
            process.env.FEATURES = features
            it("can be started", () => {
                cy.join(`${features}-start-test`);
                cy.get("#start-pause").click();
                cy.wait(200);
                isTurnStarted();
                cy.get("#start-pause").click();
            });
            it("can be interrupted", () => {
                cy.join(`${features}-interrupt-test`);
                cy.get("#start-pause").click();
                cy.wait(200);
                cy.get("#start-pause").click();
                cy.wait(200);
                isTurnStopped();
            });
            it("stops when the time runs out", () => {
                let mobName = `${features}-3`;
                cy.join(mobName);
                cy.visit(`/${mobName}?mods=faster`)
                cy.get("#start-pause").click();
                cy.wait(200);
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