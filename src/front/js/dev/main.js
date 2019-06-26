let sound = require("./sound");
let display = require("./display");
let countDownMode = require("./countDownMode");
let mobTimer = require("./mobTimer");

const minutesByPerson = document.getElementById("minutes-by-person");

let mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(() => mobTimer.passTimeLeftTo(update), 100);


function update(timerStatus) {
    if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
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
        mobTimer.stop(update);
        countDownMode.turnOff();
        mobInProgress = false;
    } else {
        mobTimer.startMobTurn(minutesByPerson.value, update);
    }
};
