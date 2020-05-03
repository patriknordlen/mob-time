const mobTurns = require("./mob/turns");
const mobSettings = require("./mob/settings");
const pomodoro = require("./pomodoro/pomodoro").get();
exports.setup = io => {
    io.on('connection', function (socket) {
        socket.on('join', name => socket.join(name));

        socket.on('interrupt mob', name => {
            console.log(`Mob "${name}" interrupted`);
            mobTurns.stop(name);
        });

        socket.on('start mob', (name, lengthInMinutes) => {
            console.log(`Mob "${name}", of length ${lengthInMinutes}min started`);
            let mobTurn = mobTurns.start(name, parseInt(lengthInMinutes));
            pomodoro.turnStarted(name, mobTurn.startTime).then(console.debug);
        });

        socket.on('change length', (mobName, lengthInMinutes) => {
            mobSettings.saveLength(mobName, lengthInMinutes);
            socket.to(mobName).emit('change length', lengthInMinutes);
        });

        socket.on('pomodoro activation change', (mobName, status) => {
            mobSettings.get(mobName).then(settings => {
                settings.pomodoro.active = status;
                mobSettings.save(mobName, settings);
            });
            socket.to(mobName).emit('pomodoro activation change', status);
        });

        socket.on("change turns by pomodoro", (mobName, number) => {
            mobSettings.get(mobName).then(settings => {
                settings.pomodoro.turns = number;
                mobSettings.save(mobName, settings);
            });
            socket.to(mobName).emit("change turns by pomodoro", number);
        });
    });
};