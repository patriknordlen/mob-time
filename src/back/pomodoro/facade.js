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

    async turnStarted(name, turn) {
        let lastPomodoro = await crate.findBy(name);
        if (lastPomodoro !== null && lastPomodoro.inProgress()) return;
        let pomodoro = new Pomodoro(turn.startTime, await this.length(name, turn));
        crate.save(name, pomodoro);
    }

    async length(name, turn) {
        let settings = await allSettings.get(name);
        let length = turn.lengthInSeconds * settings.pomodoro.turns / 60;
        console.log(`Pomodoro of length ${length} min started`)
        return length;
    }
}

class FeatureOff {
    async status() {
        return null;
    }

    async turnStarted() {
    }
}