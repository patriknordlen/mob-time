const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const MobTurn = require("./MobTurn");
const mobTurns = require("./mobTurns");
const Settings = require("./Settings");

let settings = new Settings();
let currentTurn = mobTurns.currentTurn();

app.get("/", function (req, res) {
    res.redirect("/index.html")
});

app.post("/start", function (req, res) {
    currentTurn = mobTurns.start(parseInt(req.query.lengthInMinutes));
    res.json(currentTurn.getState());
});

app.get("/status", function (req, res) {
    res.json(currentTurn.getState());
});

app.put("/settings", function (req, res) {
    settings = new Settings(JSON.parse(req.body));
});

app.use(express.static('src/front'));

app.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
