const events = require("../events").events;
const circleAnimation = require("../circle-animation");
const mobSettings = require("../settings");
const settings = require("./settings");
const turn = require("../mob/turn");
const circle = document.getElementById("pomodoro-circle");

let pomodoroLength;
let counting = false;
let interval = null;
let takeABreak = false;
let startTime = null;

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
    pomodoroLength = mobSettings.minutesByPerson() * settings.turnsByPomodoro() * 60 * 1000.0;
    startTime = new Date();
    interval = setInterval(() => {
        const elapsedMs = new Date() - startTime;
        let ratio = (pomodoroLength - elapsedMs) / pomodoroLength;
        if (ratio <= 0) {
            ratio = 0;
            turnOff();
        }
        circleAnimation.progression(circle, ratio);
    }, 100);
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
