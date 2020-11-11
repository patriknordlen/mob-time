const crate = require("./crate");
const Breaks = require("./Breaks");
const Off = require("./Off");
const allSettings = require("../settings/allSettings");
const features = require("../features/facade");

class FeatureToggle {
    on = new FeatureOn();
    off = new FeatureOff();

    async status(name) {
        return this.feature(name).status(name);
    }

    async turnStarted(name, turn) {
        return this.feature(name).turnStarted(name, turn);
    }

    feature(name) {
        return this.on;
    }
}

class FeatureOn {
    async status(name) {
        let breaks = await crate.findBy(name) || new Off();
        return breaks.status();
    }

    async turnStarted(name, turn) {
        let lastBreaks = await crate.findBy(name);
        if (lastBreaks !== null && lastBreaks.inProgress()) return;
        let breaks = new Breaks(turn.startTime, await this.length(name, turn));
        crate.save(name, breaks);
    }

    async length(name, turn) {
        let settings = await allSettings.get(name);
        let length = turn.lengthInSeconds * settings.breaks.turns / 60;

        return length;
    }

    async stop(name) {
        crate.delete(name); 
    }
}

class FeatureOff {
    async status() {
        return null;
    }

    async turnStarted() {
    }
    async stop() {}
}

const featureToggle = new FeatureToggle();

exports.featureOn = () => new FeatureOn();

exports.get = function () {
    return featureToggle;
};
