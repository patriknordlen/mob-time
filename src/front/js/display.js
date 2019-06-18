export const appTitle = "Mob Time";
export function displayTimeLeft(time) {
    document.title = toPageTitle(time);
    const timeLeft = document.getElementById("start-pause");
    timeLeft.innerText = toButtonValue(time);
}

function toPageTitle(time) {
    if (time.millis <= 0) {
        return appTitle;
    } else {
        return toHumanReadableString(time) + " - " + appTitle;
    }
}

function toButtonValue(time) {
    if (time.millis <= 0) {
        return "Start"
    }
    return toHumanReadableString(time);
}

function toHumanReadableString(time) {
    let seconds = time.millis / 1000;
    let minutes = seconds / 60;
    if (time.minutes <= 0) {
        return Math.ceil(seconds) + " s";
    }
    return Math.round(minutes) + " min";
}