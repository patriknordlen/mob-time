const sound = require("./sound");
const display = require("./display/display");
require("./display/countDownMode");
const amplitude = require("./amplitude,").get();
const mobTimer = require("./spi/mobTimer");
const eventsModule = require("./events");

const durationByPerson = document.getElementById("minutes-by-person");
let mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(() => mobTimer.passTimeLeftTo(update), 100);

function update(timerStatus) {
    eventsModule.throwEventFor(timerStatus, mobInProgress);
    mobInProgress = timerStatus.timeLeftInMillis > 0;
    display.displayTimeLeft(timerStatus);
}

// --------------------------------------------
// Sockets
// --------------------------------------------

var socket = io();
socket.on('interrupt mob', () => { console.log("Mob interrupted"); });

// --------------------------------------------
// Setup
// --------------------------------------------
sound.init();
document.forms.container.onsubmit = function (event) {
    event.preventDefault();
    if (mobInProgress) {
        amplitude.getInstance().logEvent('STOP_MOB');
        socket.emit("interrupt mob");
        return;
    }
    if (sound.isPlaying()) {
        sound.stop();
        amplitude.getInstance().logEvent('STOP_SOUND');
        return;
    }
    mobTimer.startMobTurn({minutes: durationByPerson.value}, update);
    amplitude.getInstance().logEvent('START_MOB');
};
