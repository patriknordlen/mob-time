exports.toSettings = function (data) {
    return new Settings(
        data.lengthInMinutes || 10,
        data.members || [],
        toPomodoroSettings(data),
        data.features || ""
    );
}

function toPomodoroSettings(data) {
    if (!data.pomodoro) return new PomodoroSettings(false)
    return new PomodoroSettings(data.pomodoro.active, data.pomodoro.turns || 3);
}

class Settings {
    constructor(lengthInMinutes, members, pomodoroSettings, features) {
        this.lengthInMinutes = lengthInMinutes;
        this.members = members;
        this.pomodoro = pomodoroSettings;
        this.features = features;
    }
}

class PomodoroSettings {
    constructor(active, turns) {
        this.active = active;
        this.turns = turns;
    }
}