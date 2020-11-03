const events = require("../events").events;
const settings = require("../settings");
const container = document.getElementById("container");
const memberList = document.getElementById("memberList");

document.addEventListener(events.TURN_ENDED, turnOff);
document.addEventListener(events.TURN_ENDED, rotateMembers);
document.addEventListener(events.TURN_INTERRUPTED, turnOff);
document.addEventListener(events.TURN_STARTED, turnOn);

function turnOn() {
    container.classList.remove("counting");
    container.classList.add("counting");
}

function turnOff() {
    container.classList.remove("counting");
}

function rotateMembers() {
    const memberArray = settings.membersAsArray();
    memberList.value = [].concat(memberArray[memberArray.length - 1], memberArray.slice(0, memberArray.length - 1)).join(",");
    memberList.onchange();
}