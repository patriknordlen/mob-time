const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

var mobTimer = {
    periodInSeconds: 0,
    elapsedMs: 0,
    startTime: 0,
    currentTimer: 0,

    initTimer: function(periodInMinutes) {
        this.periodInSeconds = parseInt(periodInMinutes) * 60;
        this.startTime = new Date();

        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }

        var self = this;
        this.currentTimer = setInterval(function () {
            self.elapsedMs = new Date() - self.startTime;
        }, 100);
    }
};

app.get("/", function (req, res) {
    res.send("Mob Time Server !");
});
app.post("/start", function (req, res) {
    mobTimer.initTimer(req.query.timeLeft);
    res.sendStatus(200);
});
app.get("/timeLeft", function (req, res) {
   res.send((mobTimer.periodInSeconds * 1000 - mobTimer.elapsedMs) + "");
});

app.listen(PORT, function () {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
});
