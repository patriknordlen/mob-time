const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mobTurns = require("./mob_turns");

let currentTurn = undefined;

app.get("/", function (req, res) {
    res.redirect("/index.html")
});

app.post("/start", function (req, res) {
    currentTurn = mobTurns.start(parseInt(req.query.lengthInMinutes));
    let state = currentTurn.getState();
    state['event'] = 'turn started';
    res.json(state);
});

app.post("/stop", function (req, res) {
    currentTurn = mobTurns.stop();
    let state = currentTurn.getState();
    state['event'] = 'turn interrupted';
    res.json(state);
});

app.get("/status", function (req, res) {
    let state = currentTurn.getState();
    if (state['timeLeftInMillis'] === 0) {
        state['event'] = 'turn ended';
    } else {
        state['event'] = 'time passed';
    }
    res.json(state);
});

app.use(express.static('src/front'));

mobTurns.currentTurn().then(mobTurn => {
    currentTurn = mobTurn;
    app.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
});
