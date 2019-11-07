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
    if (timerStatus.lengthInMinutes === 0) {
        countDownMode.turnOff();
        mobInProgress = false;
    }
    else if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
        sound.play();
        countDownMode.turnOff();
        mobInProgress = false;
    } else if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
        sound.pick();
        countDownMode.turnOn();
        mobInProgress = true;
    }
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
    } else {
        let duration = {
            minutes: durationByPerson.value
        };
        amplitude.getInstance().logEvent('START_MOB');
        mobTimer.startMobTurn(duration, update);
    }
};
