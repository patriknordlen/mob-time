const events = require("../events").events;
const circleAnimation = require("../circle-animation");
const mobSettings = require("../settings");
const settings = require("./settings");
const turn = require("../mob/turn");
const circle = document.getElementById("pomodoro-circle");

let pomodoroLength = mobSettings.minutesByPerson() * settings.turnsByPomodoro() * 60;
let counting = false;
let interval = null;
let takeABreak = false;

export function setup() {
    if (!circle) return;
    document.addEventListener(events.TURN_STARTED, () => {
        if (!counting) turnOn();
    });
    document.addEventListener(events.TURN_ENDED, signalBreak);
    document.addEventListener(events.TURN_STARTED, signalBreak);
}

function turnOn() {
    counting = true;
    pomodoroLength = mobSettings.minutesByPerson() * settings.turnsByPomodoro() * 60;
    let ttl = pomodoroLength;
    interval = setInterval(() => {
        let ratio = (ttl--) / pomodoroLength;
        circleAnimation.progression(circle, ratio);
        if (ratio <= 0) turnOff();
    }, 1000);
}

function turnOff() {
    counting = false;
    clearInterval(interval);
    takeABreak = true;
    if (!turn.isInProgress()) signalBreak();
}

function signalBreak() {
    if (takeABreak) {
        alert("Take a break");
        takeABreak = false;
    }
}
