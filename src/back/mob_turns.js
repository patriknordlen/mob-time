const MobTurn = require("./MobTurn");
const Mob = require("./Mob");
const store = process.env.REDIS_URL === undefined ? require("./storages/local_storage") : require("./storages/redis");

exports.currentTurn = async function () {
    let json = await store.get('currentTurn');
    if (json != null) {
        let data = JSON.parse(json);
        let mobTurn = new MobTurn(data.lengthInSeconds, new Date(data.startTime));
        return new Mob(mobTurn);
    }
    let currentTurn = new MobTurn();
    store.save('currentTurn', JSON.stringify(currentTurn));
    return new Mob(currentTurn);
};
exports.start = function (lengthInMinutes) {
    let mobTurn = new MobTurn(lengthInMinutes * 60);
    store.save('currentTurn', JSON.stringify(mobTurn));
    return new Mob(mobTurn);
};
exports.stop = function () {
    let currentTurn = new MobTurn();
    store.save('currentTurn', JSON.stringify(currentTurn));
    return new Mob(currentTurn);
};
