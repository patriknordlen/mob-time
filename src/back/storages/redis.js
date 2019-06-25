var client = require('redis').createClient(process.env.REDIS_URL);

client.on("error", function (err) {
    console.log("Error " + err);
});

exports.currentTurn = function (currentTurn) {
    if (currentTurn === undefined) {
        client.get("currentTurn");
    }
    client.set("currentTurn", currentTurn);
};
