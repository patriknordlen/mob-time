const store = require("../stores/stores").get();

exports.saveLength = function(name, lengthInMinutes) {
    let settings = {
        formatVersion: 1,
        lengthInMinutes: lengthInMinutes
    };
    store.save(toSettingsName(name), JSON.stringify(settings));
};

exports.getLength = async function (name) {
    let rawSettings = await store.get(toSettingsName(name));
    if (!rawSettings) return 10;
    if (!rawSettings.startsWith("{")) {
        await this.saveLength(name, rawSettings);
        return this.getLength(name);
    }
    let settings = JSON.parse(rawSettings);
    return settings.lengthInMinutes
};

function toSettingsName(name) {
    return name + "-settings";
}