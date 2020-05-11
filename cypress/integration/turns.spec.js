const {withMods} = require("../support/mods");

describe("Mob turns", () => {
    ["default", "pomodoro"].forEach(features => {
        describe(`with features : ${features}`, () => {
            it("can be started", () => {
                cy.join(`${features}-start-test`);
                withMods(features, () => {
                    cy.get("#start-pause").click();
                    cy.wait(200);
                    isTurnStarted();
                });
            });
            it("can be interrupted", () => {
                cy.join(`${features}-interrupt-test`);
                withMods(features, () => {
                    cy.get("#start-pause").click();
                    cy.wait(200);
                    cy.get("#start-pause").click();
                    cy.wait(200);
                    isTurnStopped();
                });
            });
            it("stops when the time runs out", () => {
                let mobName = `${features}-time-run-out`;
                cy.join(mobName);
                withMods(features + ",faster", () => {
                    cy.get("#start-pause").click();
                    cy.wait(200);
                    isTurnStopped();
                });
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