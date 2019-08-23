export function pick() {
    const alarm = document.getElementById("alarm-sound");
    const alarmUrl = document.getElementById("alarm-url");
    let sounds = alarmUrl.value.trim().split("\n");
    alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
    alarm.load();
}

export function init() {
    const volume = document.getElementById("volume");
}

export function play() {
    const alarm = document.getElementById("alarm-sound");
    alarm.play();
}