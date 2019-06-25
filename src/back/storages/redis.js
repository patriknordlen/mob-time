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
        return await getAsync("currentTurn");
    } else {
        client.set("currentTurn", currentTurn, redis.print);
    }
};
