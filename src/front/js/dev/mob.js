const sound = require("./sound");
const display = require("./display/display");
require("./display/countDownMode");
const amplitude = require("./amplitude,").get();
const mobTimer = require("./spi/mobTimer");
const eventsModule = require("./events");

const mobName = window.location.pathname.split("/")[1];
const durationByPerson = document.getElementById("minutes-by-person");
let mobInProgress = false;
mobTimer.timeLeftIn(mobName, update);
setInterval(() => mobTimer.timeLeftIn(mobName, update), 100);

function update(timerStatus) {
    eventsModule.throwEventFor(timerStatus, mobInProgress);
    mobInProgress = timerStatus.timeLeftInMillis > 0;
    display.displayTimeLeft(timerStatus);
}

// --------------------------------------------
// Sockets
// --------------------------------------------

let socket = io();
socket.on('interrupt mob', () => { console.log("Mob interrupted"); });

// --------------------------------------------
// Setup
// --------------------------------------------
sound.init();
display.init();
document.forms.container.onsubmit = function (event) {
    event.preventDefault();
    if (mobInProgress) {
        amplitude.getInstance().logEvent('STOP_MOB');
        socket.emit("interrupt mob", mobName);
        return;
    }
    if (sound.isPlaying()) {
        sound.stop();
        amplitude.getInstance().logEvent('STOP_SOUND');
        return;
    }
    socket.emit("start mob", mobName, durationByPerson.value);
    amplitude.getInstance().logEvent('START_MOB');
};
