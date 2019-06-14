const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const MobTurn = require("./MobTurn");

let currentTurn = undefined;

app.get("/", function (req, res) {
    res.send("Mob Time Server !");
});
app.post("/start", function (req, res) {
    currentTurn = new MobTurn(parseInt(req.query.lengthInMinutes));
    res.send(currentTurn.toString());
});
app.get("/timeLeft", function (req, res) {
    res.send(currentTurn.toString());
});

app.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
