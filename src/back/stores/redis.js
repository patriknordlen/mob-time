const {promisify} = require('util');
const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL
});
client.connect();

console.log("chose redis: " + process.env.REDIS_URL);

client.on("error", function (err) {
    console.log("Error " + err);
});

exports.get = (name) => client.get(name);
exports.save = (name, turn) => client.set(name, turn, redis.print);
exports.delete = name => client.del(name);