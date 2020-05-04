const allTurns = require("./turn/allTurns");
const allSettings = require("./allSettings");
const pomodoro = require("./pomodoro/pomodoro").get();
exports.setup = io => {
    io.on('connection', function (socket) {
        socket.on('join', name => socket.join(name));

        socket.on('interrupt mob', name => {
            console.log(`Mob "${name}" interrupted`);
            allTurns.stop(name);
        });

        socket.on('start mob', (name, lengthInMinutes) => {
            console.log(`Mob "${name}", of length ${lengthInMinutes}min started`);
            let mobTurn = allTurns.start(name, parseInt(lengthInMinutes));
            pomodoro.turnStarted(name, mobTurn.startTime).then(console.debug);
        });

        socket.on('change length', (mobName, lengthInMinutes) => {
            allSettings.saveLength(mobName, lengthInMinutes);
            socket.to(mobName).emit('change length', lengthInMinutes);
        });

        socket.on('pomodoro activation change', (mobName, status) => {
            allSettings.get(mobName).then(settings => {
                settings.pomodoro.active = status;
                allSettings.save(mobName, settings);
            });
            socket.to(mobName).emit('pomodoro activation change', status);
        });

        socket.on("change turns by pomodoro", (mobName, number) => {
            allSettings.get(mobName).then(settings => {
                settings.pomodoro.turns = number;
                allSettings.save(mobName, settings);
            });
            socket.to(mobName).emit("change turns by pomodoro", number);
        });
    });
};