describe("Pomodoro", () => {
    process.env.FEATURES = "pomodoro"
    it("is off by default", () => {
        cy.join(`off-by-default`);
        activatePomodoro();
        isPomodoroStopped();
    });
    it("is on when turn is started", () => {
        let mobName = `on-when-started`;
        cy.join(mobName);
        withFasterMod(() => {
            activatePomodoro();
            cy.get("#start-pause").click();
            cy.wait(200);
            isPomodoroStarted();
        });
    });
    it("turns off when the time runs out", () => {
        let mobName = `pomodoro-time-out`;
        cy.join(mobName);
        withFasterMod(() => {
            activatePomodoro();
            cy.get("#start-pause").click();
            cy.wait(100);
            isPomodoroStarted();
            cy.wait(500);
            isPomodoroStopped();
        });
    });
});

function withFasterMod(func) {
    cy.url().then($url => {
        cy.log($url);
        cy.visit(`${$url}?mods=faster`);
        func();
    });
}

function activatePomodoro() {
    cy.get(".settings-button").click();
    cy.wait(200);
    cy.get("#pomodoro-active").check();
}

function isPomodoroStarted() {
    cy.get("#pomodoro-circle")
      .should('not.have.css', 'stroke-dashoffset', '0px');
}

function isPomodoroStopped() {
    cy.get("#pomodoro-circle")
      .should('have.css', 'stroke-dashoffset', '0px');
}