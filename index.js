const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

class MobTurn {
    constructor(lengthInMinutes) {
        this.lengthInSeconds = lengthInMinutes * 60;
        this.elapsedMs = 0;
        this.startTime = new Date();
        let self = this;
        this.timer = setInterval(function () {
            self.elapsedMs = new Date() - self.startTime;
        }, 100);
    }

    timeLeftInMillis() {
        return this.lengthInSeconds * 1000 - this.elapsedMs;
    }
}

let currentTurn = undefined;

app.get("/", function (req, res) {
    res.send("Mob Time Server !");
});
app.post("/start", function (req, res) {
    currentTurn = new MobTurn(parseInt(req.query.lengthInMinutes));
    res.sendStatus(200);
});
app.get("/timeLeft", function (req, res) {
    let millis = currentTurn.timeLeftInMillis();
    let seconds = millis / 1000;
    res.send(JSON.stringify({
        millis: millis,
        minutes: Math.floor(seconds / 60),
        seconds: Math.floor(seconds % 60),
    }));
});

app.listen(PORT, function () {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
});
