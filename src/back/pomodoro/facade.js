const crate = require("./crate");
const Pomodoro = require("./Pomodoro");
const Off = require("./Off");
const allSettings = require("../allSettings");

exports.featureOn = () => {
    const features = process.env.FEATURES || "";
    return features.includes("pomodoro");
}

exports.get = function () {
    return this.featureOn()
        ? new FeatureOn()
        : new FeatureOff();
};

class FeatureOn {
    async status(name) {
        let pomodoro = await crate.findBy(name) || new Off();
        return pomodoro.status();
    }

    async turnStarted(name, start) {
        let lastPomodoro = await crate.findBy(name);
        if (lastPomodoro !== null && lastPomodoro.inProgress()) return;
        let pomodoro = new Pomodoro(start, await this.length(name));
        crate.save(name, pomodoro);
    }

    async length(name) {
        let settings = await allSettings.get(name);
        return settings.lengthInMinutes * settings.pomodoro.turns;
    }
}

class FeatureOff {
    async status() {
        return null;
    }

    async turnStarted() {
    }
}