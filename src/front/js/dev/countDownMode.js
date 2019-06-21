const display = require("./display");

export function turnOn() {
    const container = document.getElementById("container");
    container.classList.remove("counting");
    container.classList.add("counting");
}

export function turnOff() {
    const container = document.getElementById("container");
    container.classList.remove("counting");
}