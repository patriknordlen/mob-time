export const appTitle = "Mob Time";

export function displayTimeLeft(timerStatus) {
    document.title = toPageTitle(timerStatus.timeLeftInMillis);
    const timeLeft = document.getElementById("start-pause");
    timeLeft.innerText = toButtonValue(timerStatus.timeLeftInMillis);
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
    if (time === 0) {
        return "Start"
    }
    return toHumanReadableString(time);
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
