exports.withMods = (mods, func) => {
    cy.url().then($url => {
        cy.visit(`${$url}?mods=${mods}`);
        func();
    });
}