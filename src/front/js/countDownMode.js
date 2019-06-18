const display = require("./display");

export function turnOn() {
    const container = document.getElementById("container");
    container.classList.remove("counting");
    container.classList.add("counting");
    document.getElementsByTagName("h1")[0].innerText = "En cours";
}

export function turnOff() {
    const container = document.getElementById("container");
    container.classList.remove("counting");
    document.getElementsByTagName("h1")[0].innerText = display.appTitle;
}