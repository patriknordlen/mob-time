const MobTurn = require("./MobTurn");
const store = process.env.REDIS_URL === undefined ? require("./storages/local_storage") : require("./storages/redis");

exports.get = async name => {
    let json = await store.get(name);
    if (json == null) return new MobTurn();
    let data = JSON.parse(json);
    return new MobTurn(data.lengthInSeconds, new Date(data.startTime));
};
exports.start = (name, lengthInMinutes) => {
    let mobTurn = new MobTurn(lengthInMinutes * 60);
    store.save(name, JSON.stringify(mobTurn));
};
exports.stop = name => store.delete(name);
