let sound = require("./sound");
let display = require("./display");
let countDownMode = require("./countDownMode");
let mobTimer = require("./mobTimer");

const minutesByPerson = document.getElementById("minutes-by-person");

function startCountdown() {
    mobTimer.startMobTurn(minutesByPerson.value, display.displayTimeLeft);
    sound.pick();
    countDownMode.turnOn();
    let interval = setInterval(function () {
        mobTimer.passTimeLeftTo(function (timeLeft) {
            if (timeLeft.millis <= 0) {
                clearInterval(interval);
                sound.play();
                countDownMode.turnOff();
            }
            display.displayTimeLeft(timeLeft);
        });
    }, 100);

    return false;
}

// --------------------------------------------
// Setup
// --------------------------------------------

document.forms.container.onsubmit = function (event) {
    event.preventDefault();
    startCountdown();
};
