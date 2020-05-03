const crate = require("./crate");
const Pomodoro = require("./Pomodoro");
const Off = require("./Off");
const allSettings = require("../mob/settings");

exports.get = function () {
    const features = process.env.FEATURES || "";
    if (features.includes("pomodoro")) return new FeatureOn();
    return new FeatureOff();
};

class FeatureOn {
    async status(name) {
        let pomodoro = await crate.findBy(name) || new Off();
        return pomodoro.status();
    }

    async turnStarted(name, start) {
        if (await crate.contains(name)) return;
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