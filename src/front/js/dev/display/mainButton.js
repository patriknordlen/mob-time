const sound = require("../sound");

export function update(timerStatus, timeFormatter) {
    icon(timerStatus);
    timeLeft(timeFormatter, timerStatus);
    progression(timerStatus);
}

function icon(timerStatus) {
    let controls = document.getElementById("control-icons");
    controls.className = iconClass(timerStatus.timeLeftInMillis);
}

function iconClass(time) {
    if (sound.isPlaying()) {
        return "fas fa-volume-mute";
    }
    if (time === 0) {
        return "fas fa-play";
    }
    return "fas fa-stop";
}

function timeLeft(timeFormatter, timerStatus) {
    let timeLeft = document.getElementById("time-left");
    timeLeft.innerText = timeFormatter(timerStatus.timeLeftInMillis);
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
