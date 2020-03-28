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

const circle = document.getElementById("countdown-circle");
const dasharray = window.getComputedStyle(circle).getPropertyValue("stroke-dasharray").replace("px", "");
function progression(timerStatus) {
    if (timerStatus.timeLeftInMillis === 0) {
        circle.style.strokeDashoffset = "0";
    } else {
        circle.style.strokeDashoffset = (dasharray - dasharray * (timerStatus.timeLeftInMillis / (timerStatus.lengthInMinutes * 60 * 1000))) + "px";
    }
}
