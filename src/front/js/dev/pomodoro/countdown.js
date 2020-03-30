const events = require("../events").events;
const circleAnimation = require("../circle-animation");
const mobSettings = require("../settings");
const settings = require("./settings");
const circle = document.getElementById("pomodoro-circle");

let pomodoroLength = mobSettings.minutesByPerson() * settings.turnsByPomodoro() * 60;
let counting = false;

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
    circleAnimation.animate(circle,
        () => (ttl--) / pomodoroLength,
        1000,
        circleAnimation.dasharray(circle));
}
