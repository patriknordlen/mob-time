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
    var memberArray = settings.membersAsArray();
    memberList.value = [].concat(memberArray.slice(1, memberArray.length), memberArray[0]).join(",");
    memberList.onchange();
  }