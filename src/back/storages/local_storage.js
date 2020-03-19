if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./mobTurns');
}

exports.get = name => localStorage.getItem(name);
exports.save = (name, turn) => localStorage.setItem(name, turn);
