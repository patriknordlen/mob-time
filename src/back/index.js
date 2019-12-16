let express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const mobTurns = require("./mob_turns");

let currentTurn = undefined;

app.get("/", function (req, res) {
    res.redirect("/index.html")
});

app.post("/start", function (req, res) {
    currentTurn = mobTurns.start(parseInt(req.query.lengthInMinutes));
    res.json(currentTurn.getState());
});

app.post("/stop", function (req, res) {
    currentTurn = mobTurns.stop();
    res.json(currentTurn.getState());
});

app.get("/status", function (req, res) {
    res.json(currentTurn.getState());
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('interrupt mob', function(){
        console.log('Mob interrupted');
        currentTurn = mobTurns.stop();
        socket.emit('interrupt mob');
    });
    socket.on('start mob', function(lengthInMinutes){
        console.log('Mob of length ' + lengthInMinutes + "min started");
        currentTurn = mobTurns.start(parseInt(lengthInMinutes));
        socket.emit('start mob');
    });
});

app.use(express.static('src/front'));

mobTurns.currentTurn().then(mobTurn => {
    currentTurn = mobTurn;
    http.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
});
