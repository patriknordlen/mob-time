let human_readable = require("./human_readable_time");

export const appTitle = "Mob Time";

export function displayTimeLeft(timerStatus) {
    document.title = toPageTitle(timerStatus.timeLeftInMillis);
    updateTheCircleText(timerStatus.timeLeftInMillis);
    displayOnCircle(timerStatus);
}

function toPageTitle(time) {
    if (time === 0) {
        return appTitle;
    } else {
        return toHumanReadableString(time) + " - " + appTitle;
    }
}

function updateTheCircleText(time) {
    let controls = document.getElementById("control-icons");
    if (time === 0) {
        controls.innerText = "\u25B6";
    } else {
        controls.innerText = "\u25A0";
    }
    let timeLeft = document.getElementById("time-left");
    timeLeft.innerText = toHumanReadableString(time);
}

function toHumanReadableString(ms) {
    let secondCountingMode = document.getElementById("second-counting-mode").checked;
    if (secondCountingMode) {
        return human_readable.extended_format(ms);
    }
    return human_readable.simple_format(ms);
}

function displayOnCircle(timerStatus) {
    const circle = document.getElementById("countdown-circle");
    if (timerStatus.timeLeftInMillis === 0) {
        circle.style.strokeDashoffset = 0;
    } else {
        const dasharray = 584;
        circle.style.strokeDashoffset = (dasharray - dasharray * (timerStatus.timeLeftInMillis / (timerStatus.lengthInMinutes * 60 * 1000))) + "px";
    }
}
