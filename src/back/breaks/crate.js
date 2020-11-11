const allSettings = require("../settings/allSettings");
const store = require("../stores/stores").get();
const Breaks = require("./Breaks");

function toBreaksName(name) {
    return `${name}-breaks`;
}

exports.findBy = async function (name) {
    let breaksName = toBreaksName(name);
    let json = await store.get(breaksName);
    let raw = JSON.parse(json);
    if (!raw) return null;
    return new Breaks(new Date(raw.start), raw.length);
}


exports.save = function (name, breaks) {

    store.save(toBreaksName(name), JSON.stringify({
        formatVersion: 1,
        start: breaks.start,
        length: breaks.length
    }));
}

exports.delete = function (name) {
    store.delete(toBreaksName(name));
}
