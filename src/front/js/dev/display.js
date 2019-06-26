export const appTitle = "Mob Time";

export function displayTimeLeft(timerStatus) {
    document.title = toPageTitle(timerStatus.timeLeftInMillis);
    toButtonValue(timerStatus.timeLeftInMillis);
    displayOnCircle(timerStatus);
}

function toPageTitle(time) {
    if (time === 0) {
        return appTitle;
    } else {
        return toHumanReadableString(time) + " - " + appTitle;
    }
}

function toButtonValue(time) {
    let controls = document.getElementById("control-icons");
    if (time === 0) {
        controls.innerText = "\u25B6";
    }
    else {
        controls.innerText = "\u25A0";
    }
    let timeLeft = document.getElementById("time-left");
    timeLeft.innerText = toHumanReadableString(time);
}

function toHumanReadableString(time) {
    let seconds = time / 1000;
    let minutes = seconds / 60;
    if (Math.floor(minutes) === 0) {
        return Math.round(seconds) + " s";
    }
    return Math.round(minutes) + " min";
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
