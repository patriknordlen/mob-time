let express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const mobTurns = require("./mob_turns");
const fs = require("fs");
const path = require("path");

let currentTurn = undefined;

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/status", function (req, res) {
    res.json(currentTurn.getState());
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('interrupt mob', () => {
        console.log('Mob interrupted');
        currentTurn = mobTurns.stop('currentTurn');
        socket.emit('interrupt mob');
    });

    socket.on('start mob', lengthInMinutes => {
        console.log('Mob of length ' + lengthInMinutes + "min started");
        currentTurn = mobTurns.start('currentTurn', parseInt(lengthInMinutes));
    });
});

app.use(express.static('src/front'));
app.set('views', path.join(__dirname, '../front'));
app.set('view engine', 'pug');

mobTurns.get("currentTurn").then(mobTurn => {
    currentTurn = mobTurn;
    http.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
});
