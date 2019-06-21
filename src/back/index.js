const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const MobTurn = require("./MobTurn");
const Settings = require("./Settings");

let settings = new Settings();
let currentTurn = new MobTurn(0);

app.get("/", function (req, res) {
    res.redirect("/index.html")
});

app.post("/start", function (req, res) {
    currentTurn = new MobTurn(parseInt(req.query.lengthInMinutes));
    res.json(getState(currentTurn));
});

app.get("/status", function (req, res) {
    res.json(getState(currentTurn));
});

app.put("/settings", function (req, res) {
    settings = new Settings(JSON.parse(req.body));
});

function getState(turn) {
    return {
        lengthInMinutes: turn.lengthInMinutes,
        timeLeftInMillis: turn.timeLeft()
    };
}

app.use(express.static('src/front'));

app.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
