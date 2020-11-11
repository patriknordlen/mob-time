exports.toSettings = function (data) {
    return new Settings(
        data.lengthInMinutes || 10,
        data.members || [],
        toBreaksSettings(data),
        data.features || ""
    );
}

function toBreaksSettings(data) {
    if (!data.breaks) return new BreaksSettings(3)
    return new BreaksSettings(data.breaks.turns || 3);
}

class Settings {
    constructor(lengthInMinutes, members, breaksSettings, features) {
        this.lengthInMinutes = lengthInMinutes;
        this.members = members;
        this.breaks = breaksSettings;
        this.features = features;
    }
}

class BreaksSettings {
    constructor(turns) {
        this.turns = turns;
    }
}