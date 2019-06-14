var express = require("express");
var app = express();

const PORT = process.env.PORT || 3000;

app.get("/", function (req, res) {
    res.send("Ceci n'est pas un test!\n");
});

app.post("/", function (req, res) {
    res.sendStatus(200);
});

app.listen(PORT);
