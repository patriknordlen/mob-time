export function update(timerStatus, timeFormatter) {
    text(timerStatus.timeLeftInMillis, timeFormatter);
    progression(timerStatus);
}

function text(time, formatter) {
    let controls = document.getElementById("control-icons");
    if (time === 0) {
        controls.innerText = "\u25B6";
    } else {
        controls.innerText = "\u25A0";
    }
    let timeLeft = document.getElementById("time-left");
    timeLeft.innerText = formatter(time);
}

function progression(timerStatus) {
    const circle = document.getElementById("countdown-circle");
    if (timerStatus.timeLeftInMillis === 0) {
        circle.style.strokeDashoffset = 0;
    } else {
        const dasharray = 584;
        circle.style.strokeDashoffset = (dasharray - dasharray * (timerStatus.timeLeftInMillis / (timerStatus.lengthInMinutes * 60 * 1000))) + "px";
    }
}
