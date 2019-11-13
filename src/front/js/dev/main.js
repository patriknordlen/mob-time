let sound = require("./sound");
let display = require("./display");
let countDownMode = require("./countDownMode");
let mobTimer = require("./mobTimer");

const durationByPerson = document.getElementById("minutes-by-person");

let mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(() => mobTimer.passTimeLeftTo(update), 100);
sound.init();

const events = {
    TURN_ENDED: 'time ran out',
    TURN_STARTED: 'started turn',
    TURN_INTERRUPTED: 'interrupted turn',
    TIME_PASSED: 'time passed'
};

function update(timerStatus) {
    let event = detectEvent(timerStatus);
    handle(event);
    mobInProgress = timerStatus.timeLeftInMillis > 0;
    display.displayTimeLeft(timerStatus);
}

function detectEvent(timerStatus) {
    let event = events.TIME_PASSED;
    if (timerStatus.lengthInMinutes === 0) {
        event = events.TURN_INTERRUPTED;
    } else if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
        event = events.TURN_ENDED;
    } else if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
        event = events.TURN_STARTED;
    }
    return event;
}

function handle(event) {
    switch (event) {
        case events.TURN_ENDED:
            sound.play();
            countDownMode.turnOff();
            break;
        case events.TURN_STARTED:
            sound.pick();
            countDownMode.turnOn();
            break;
        case events.TURN_INTERRUPTED:
            countDownMode.turnOff();
            break;
        case events.TIME_PASSED:
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
