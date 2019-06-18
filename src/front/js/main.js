let sound = require("./sound");
let display = require("./display");
let countDownMode = require("./countDownMode");

const minutesByPerson = document.getElementById("minutes-by-person");

function startCountdown() {
    startMobTurn(minutesByPerson.value, display.displayTimeLeft);
    sound.pick();
    countDownMode.turnOn();
    let interval = setInterval(function () {
        getTimeLeft(function (timeLeft) {
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

function startMobTurn(lengthInMinutes, callBack) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callBack(JSON.parse(this.responseText));
        }
    };
    xhttp.open("POST", "/start?lengthInMinutes=" + lengthInMinutes, true);
    xhttp.send();
}

function getTimeLeft(callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", "/timeLeft", true);
    xhttp.send();
}



// --------------------------------------------
// Setup
// --------------------------------------------

document.forms.container.onsubmit = function (event) {
    event.preventDefault();
    startCountdown();
};
