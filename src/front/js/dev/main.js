let sound = require("./sound");
let display = require("./display/display");
let countDownMode = require("./display/countDownMode");
let amplitude = require("./amplitude,").get();
let mobTimer = require("./spi/mobTimer");
const eventsModule = require("./events");
const events = eventsModule.events;

const durationByPerson = document.getElementById("minutes-by-person");
let mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(() => mobTimer.passTimeLeftTo(update), 100);

sound.init();

function update(timerStatus) {
    eventsModule.throwEventFor(timerStatus, mobInProgress);
    mobInProgress = timerStatus.timeLeftInMillis > 0;
    display.displayTimeLeft(timerStatus);
}

// --------------------------------------------
// Setup
// --------------------------------------------

document.forms.container.onsubmit = function (event) {
    event.preventDefault();
    if (mobInProgress) {
        amplitude.getInstance().logEvent('STOP_MOB');
        mobTimer.stop(update);
        return;
    }
    if (sound.isPlaying()) {
        // todo
    }
    let duration = {
        minutes: durationByPerson.value
    };
    amplitude.getInstance().logEvent('START_MOB');
    mobTimer.startMobTurn(duration, update);
};

// --------------------------------------------
// Sockets
// --------------------------------------------

var socket = io();
