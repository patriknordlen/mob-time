const MobTurn = require("./MobTurn");
const Mob = require("./Mob");
const store = process.env.REDIS_URL === undefined ? require("./storages/local_storage") : require("./storages/redis");

exports.get = async name => {
    let json = await store.get(name);
    if (json != null) {
        let data = JSON.parse(json);
        let mobTurn = new MobTurn(data.lengthInSeconds, new Date(data.startTime));
        return new Mob(mobTurn);
    }
    let currentTurn = new MobTurn();
    store.save(name, JSON.stringify(currentTurn));
    return new Mob(currentTurn);
};
exports.start = (name, lengthInMinutes) => {
    let mobTurn = new MobTurn(lengthInMinutes * 60);
    store.save(name, JSON.stringify(mobTurn));
    return new Mob(mobTurn);
};
exports.stop = name => {
    let currentTurn = new MobTurn();
    store.save(name, JSON.stringify(currentTurn));
    return new Mob(currentTurn);
};
