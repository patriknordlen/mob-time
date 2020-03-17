if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./mobTurns');
}

exports.currentTurn = function (name, currentTurn) {
    if (currentTurn === undefined) {
        return localStorage.getItem(name);
    }
    localStorage.setItem(name, currentTurn);
};
