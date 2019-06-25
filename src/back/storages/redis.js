const {promisify} = require('util');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

console.log("chose redis: " + process.env.REDIS_URL);

client.on("error", function (err) {
    console.log("Error " + err);
});

exports.currentTurn = async function (currentTurn) {
    if (currentTurn === undefined || currentTurn === null) {
        let currentTurn1 = await getAsync("currentTurn");
        console.log(currentTurn1);
        return currentTurn1;
    } else {
        client.set("currentTurn", currentTurn, redis.print);
    }
};
