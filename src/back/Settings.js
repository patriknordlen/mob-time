class Settings {
    constructor(prototype) {
        prototype = prototype || {};
        this.turnLengthInMinutes = prototype.turnLengthInMinutes || 10;
    }
}

module.exports = Settings;