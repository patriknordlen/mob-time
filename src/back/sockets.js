const allTurns = require("./turn/allTurns");
const allSettings = require("./settings/allSettings");
const breaks = require("./breaks/facade").featureOn();
exports.setup = io => {
    io.on('connection', function (socket) {
        socket.on('join', name => socket.join(name));

        socket.on('interrupt mob', name => {
            allTurns.stop(name);
        });

        socket.on('start mob', async (name, lengthInMinutes) => {
            let mobTurn = allTurns.start(name, parseFloat(lengthInMinutes));
            await breaks.turnStarted(name, mobTurn);

            socket.to(name).emit('start mob');
        });

        socket.on('change length', async (mobName, lengthInMinutes) => {
            await allSettings.saveLength(mobName, lengthInMinutes);
            socket.to(mobName).emit('change length', lengthInMinutes);
        });

        socket.on('change members', async (mobName, members) => {
            await allSettings.saveMembers(mobName, members);
        });

        socket.on('break stop', (mobName) => {
            breaks.feature(mobName).stop(mobName);
        });

        socket.on("change turns before break", (mobName, number) => {
            allSettings.get(mobName).then(settings => {
                settings.breaks.turns = number;
                allSettings.save(mobName, settings);
            });
            socket.to(mobName).emit("change turns before break", number);
        });

        socket.on("get status", async (mobName) => {
            let turn = await allTurns.get(mobName);
            let members = await allSettings.getMembers(mobName);

            if (turn.timeLeft() == 0 && turn.lengthInSeconds != 0 && !turn.rotated) {
                if (members.length > 0) {
                    var rotatedMembers = [].concat(members.slice(1, members.length), members[0]);
                    await allSettings.saveMembers(mobName, rotatedMembers);
                    members = rotatedMembers;
                }
                turn.rotated = true;
                allTurns.save(mobName, turn);
            }

            let data = turn.getState();
            data["members"] = members;
            data["breaks"] = await breaks.status(mobName);

            socket.emit("status", data);
        });
    });
};
