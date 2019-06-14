const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

let periodInSeconds = undefined;
let elapsedMs = undefined;
let startTime = undefined;
let currentTimer = undefined;

app.get("/", function (req, res) {
    res.send("Ceci n'est pas un test!\n");
});
app.post("/start", function (req, res) {
    periodInSeconds = parseInt(req.query.timeLeft) * 60;
    startTime = new Date();
    if (currentTimer) {
        clearInterval(currentTimer);
    }
    currentTimer = setInterval(function () {
        elapsedMs = new Date() - startTime;
    }, 100);
    res.sendStatus(200);
});
app.get("/timeLeft", function (req, res) {
   res.send((periodInSeconds * 1000 - elapsedMs) + "");
});

app.listen(PORT, function () {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
});
