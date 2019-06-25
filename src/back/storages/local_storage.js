if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./mobTurns');
}

exports.currentTurn = function (currentTurn) {
    if (currentTurn === undefined) {
        return localStorage.getItem('currentTurn');
    }
    localStorage.setItem("currentTurn", currentTurn);
};
