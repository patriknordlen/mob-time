const MobTurn = require("./MobTurn");
const store = process.env.REDIS_URL === undefined ? require("./storages/local_storage") : require("./storages/redis");
exports.currentTurn = async function () {
    let json = await store.currentTurn();
    if (json != null) {
        let data = JSON.parse(json);
        return new MobTurn(data.lengthInSeconds, new Date(data.startTime));
    }
    let currentTurn = new MobTurn();
    store.currentTurn(JSON.stringify(currentTurn));
    return currentTurn;
};
exports.start = function (lengthInMinutes) {
    let mobTurn = new MobTurn(lengthInMinutes * 60);
    store.currentTurn(JSON.stringify(mobTurn));
    return mobTurn;
};
