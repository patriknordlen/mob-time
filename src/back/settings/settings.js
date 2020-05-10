exports.toSettings = function (data) {
    return new Settings(
        data.lengthInMinutes || 10,
        toPomodoroSettings(data)
    );
}

function toPomodoroSettings(data) {
    if (!data.pomodoro) return new PomodoroSettings(false)
    return new PomodoroSettings(data.pomodoro.active, data.pomodoro.turns || 3);
}

class Settings {
    constructor(lengthInMinutes, pomodoroSettings) {
        this.lengthInMinutes = lengthInMinutes;
        this.pomodoro = pomodoroSettings;
    }
}

class PomodoroSettings {
    turns;

    constructor(active, turns) {
        this.active = active
        this.turns = turns;
    }
}