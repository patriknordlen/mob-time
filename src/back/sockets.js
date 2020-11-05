const allTurns = require("./turn/allTurns");
const allSettings = require("./settings/allSettings");
const pomodoro = require("./pomodoro/facade").get();
exports.setup = io => {
    io.on('connection', function (socket) {
        socket.on('join', name => socket.join(name));

        socket.on('interrupt mob', name => {
            allTurns.stop(name);
        });

        socket.on('start mob', async (name, members, lengthInMinutes) => {
            let mobTurn = allTurns.start(name, members, parseFloat(lengthInMinutes));
            await pomodoro.turnStarted(name, mobTurn);

            if (members.length > 0) {
                socket.to(mobName).emit('start mob', members[0]);
            }
        });

        socket.on('change length', async (mobName, lengthInMinutes) => {
            await allSettings.saveLength(mobName, lengthInMinutes);
            socket.to(mobName).emit('change length', lengthInMinutes);
        });

        socket.on('change members', async (mobName, members) => {
            await allSettings.saveMembers(mobName, members);
            socket.to(mobName).emit('change members', members);
        });

        socket.on('pomodoro activation change', (mobName, status) => {
            allSettings.get(mobName).then(settings => {
                settings.pomodoro.active = status;
                allSettings.save(mobName, settings);
            });
            socket.to(mobName).emit('pomodoro activation change', status);
        });

        socket.on('pomodoro stop', (mobName) => {
            pomodoro.feature(mobName).stop(mobName);
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
