const store = process.env.REDIS_URL === undefined ? require("./storages/local_storage") : require("./storages/redis");

exports.saveLength = function(name, lengthInMinutes) {
    store.save(toSettingsName(name), lengthInMinutes);
};

exports.getLength = async function (name) {
    return await store.get(toSettingsName(name)) || 10;
};

function toSettingsName(name) {
    return name + "-settings";
}