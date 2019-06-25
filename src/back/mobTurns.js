const MobTurn = require("./MobTurn");

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./mobTurns');
}

exports.currentTurn = function () {
    let data = JSON.parse(localStorage.getItem('currentTurn'));
    if (data !== undefined) {
        return new MobTurn(data.lengthInSeconds, new Date(data.startTime));
    }
    let currentTurn = new MobTurn();
    localStorage.setItem('currentTurn', JSON.stringify(currentTurn));
    return currentTurn;
};

exports.start = function (lengthInMinutes) {
    let mobTurn = new MobTurn(lengthInMinutes * 60);
    localStorage.setItem('currentTurn', JSON.stringify(mobTurn));
    return mobTurn;
};
