const store = require("../stores/stores").get();

const defaultSettings = {
    formatVersion: 1,
    lengthInMinutes: 10
};

exports.saveLength = async function(name, lengthInMinutes) {
    let settings = {
        formatVersion: 1,
        lengthInMinutes: lengthInMinutes
    };
    await this.save(name, settings);
};

exports.save = async function(name, settings) {
    await store.save(toSettingsName(name), JSON.stringify(settings));
};

exports.getLength = async function (name) {
    return this.get(name).then(value => value.lengthInMinutes);
};

exports.get = async function (name) {
    let rawSettings = await store.get(toSettingsName(name));
    if (!rawSettings) return defaultSettings;
    if (isRawLength(rawSettings)) {
        await this.saveLength(name, rawSettings);
        return this.get(name);
    }
    return  JSON.parse(rawSettings);
};

function isRawLength(rawSettings) {
    return !rawSettings.startsWith("{");
}

function toSettingsName(name) {
    return name + "-settings";
}