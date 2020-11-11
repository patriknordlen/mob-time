const events = require("../events").events;
const settings = require("../settings");
const container = document.getElementById("container");

document.addEventListener(events.TURN_ENDED, turnOff);
document.addEventListener(events.TURN_ENDED, showNotification);
document.addEventListener(events.TURN_INTERRUPTED, turnOff);
document.addEventListener(events.TURN_STARTED, turnOn);

function turnOn() {
    container.classList.remove("counting");
    container.classList.add("counting");
}

function turnOff() {
    container.classList.remove("counting");
}

function showNotification(evt) {
    if (evt.detail.breaks.ratio < 1) {
        var notify = new Notification("Turn ended, time to switch!", { body: "Next up: " + settings.membersAsArray()[0]});
    }
}