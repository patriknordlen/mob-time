const events = require("../events").events;
const circleAnimation = require("../circle-animation");
const mobSettings = require("../settings");
const settings = require("./settings");
const circle = document.getElementById("pomodoro-circle");

let pomodoroLength = mobSettings.minutesByPerson() * settings.turnsByPomodoro() * 60;
let counting = false;
let interval = null;

export function setup() {
    if (!circle) return;
    document.addEventListener(events.TURN_STARTED, () => {
        if (!counting) turnOn();
    });
}

function turnOn() {
    counting = true;
    pomodoroLength = mobSettings.minutesByPerson() * settings.turnsByPomodoro() * 60;
    let ttl = pomodoroLength;
    let refreshPeriod = 1000;
    circle.style.transitionDuration = refreshPeriod + "ms";

    interval = setInterval(() => {
        let ratio = (ttl--) / pomodoroLength;
        circleAnimation.progression(circle, ratio);
        if (ratio <= 0) turnOff();
    }, refreshPeriod);
}

function turnOff() {
    counting = false;
    clearInterval(interval);
}
