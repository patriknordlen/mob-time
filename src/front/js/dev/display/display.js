let human_readable = require("../functions/human_readable_time");
let main_button = require("./main_button");

export const appTitle = "Mob Time";

export function displayTimeLeft(timerStatus) {
    document.title = toPageTitle(timerStatus.timeLeftInMillis, timeFormatter());
    main_button.update(timerStatus, timeFormatter());
}

function toPageTitle(time, timeFormatter) {
    if (time === 0) return appTitle;
    return timeFormatter(time) + " - " + appTitle;
}

function timeFormatter() {
    if (document.getElementById("second-counting-mode").checked) {
        return human_readable.extended_format;
    }
    return human_readable.simple_format;
}
