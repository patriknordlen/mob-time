const circleAnimation = require("../circle-animation");

export function setup() {
    const circle = document.getElementById("pomodoro-circle");
    if (!circle) return;
    const pomodoroLength = 24 * 60;
    let ttl = pomodoroLength;
    circleAnimation.animate(circle,
        () => (ttl--) / pomodoroLength,
        1000,
        circleAnimation.dasharray(circle));
}