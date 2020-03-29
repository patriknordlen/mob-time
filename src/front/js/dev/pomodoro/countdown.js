const events = require("../events").events;
const circleAnimation = require("../circle-animation");
const circle = document.getElementById("pomodoro-circle");
const pomodoroLength = 24 * 60;
let counting = false;

export function setup() {
    if (!circle) return;
    document.addEventListener(events.TURN_STARTED, () => {
        if (!counting) turnOn();
    });
}

function turnOn() {
    counting = true;
    let ttl = pomodoroLength;
    circleAnimation.animate(circle,
        () => (ttl--) / pomodoroLength,
        1000,
        circleAnimation.dasharray(circle));
}
