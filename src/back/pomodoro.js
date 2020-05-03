const store = require("./stores/stores").get();
const allSettings = require("./mob/settings");

exports.get = function () {
    const features = process.env.FEATURES || "";
    if (features.includes("pomodoro")) return new Pomodoro();
    return new Off();
};

class Pomodoro {
    status() {
        return {};
    }

    async turnStarted(name, start) {
        let settings = await allSettings.get(name);

        if (!settings.pomodoro.active) return;

        let pomodoroName = `${name}-pomodoro`;
        let currentPomodoro = await store.get(pomodoroName);
        if (currentPomodoro) return;

        store.save(pomodoroName, JSON.stringify({
            formatVersion: 1,
            start: start,
            length: settings.lengthInMinutes * settings.pomodoro.turns
        }));
    }
}

class Off {
    status() {
        return null;
    }

    turnStarted() {
    }
}