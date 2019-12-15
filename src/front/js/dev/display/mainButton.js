const sound = require("../sound");
export function update(timerStatus, timeFormatter) {
    text(timerStatus.timeLeftInMillis, timeFormatter);
    progression(timerStatus);
}

function text(time, formatter) {
    let controls = document.getElementById("control-icons");
    controls.className = "";
    if (time === 0) {
        if (sound.isPlaying()) {
            controls.classList.add("fas", "fa-volume-mute");
        } else {
            controls.classList.add("fas", "fa-play");
        }
    } else {
        controls.classList.add("fas", "fa-stop");
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
