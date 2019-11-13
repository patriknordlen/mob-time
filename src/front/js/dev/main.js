let sound = require("./sound");
let display = require("./display");
let countDownMode = require("./countDownMode");
let mobTimer = require("./mobTimer");

const durationByPerson = document.getElementById("minutes-by-person");

let mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(() => mobTimer.passTimeLeftTo(update), 100);
sound.init();

function update(timerStatus) {
    let event = timerStatus['event'];
    handle(event);
    mobInProgress = timerStatus.timeLeftInMillis > 0;
    display.displayTimeLeft(timerStatus);
}

function handle(event) {
    switch (event) {
        case 'turn ended':
            sound.play();
            countDownMode.turnOff();
            break;
        case 'turn started':
            sound.pick();
            countDownMode.turnOn();
            break;
        case 'turn interrupted':
            countDownMode.turnOff();
            break;
        case 'time passed':
            break;
        default:
            throw 'unknown event: ' + event;
    }
}

// --------------------------------------------
// Setup
// --------------------------------------------

document.forms.container.onsubmit = function (event) {
    event.preventDefault();
    if (mobInProgress) {
        amplitude.getInstance().logEvent('STOP_MOB');
        mobTimer.stop(update);
    } else {
        let duration = {
            minutes: durationByPerson.value
        };
        amplitude.getInstance().logEvent('START_MOB');
        mobTimer.startMobTurn(duration, update);
    }
};
