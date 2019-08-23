let settings = require("./settings");

export function init() {
    const alarm = document.getElementById("alarm-sound");
    const volume = document.getElementById("volume");

    volume.value = settings.volume();
    alarm.volume = toAudioVolume(volume.value);

    volume.oninput = function () {
        alarm.volume = toAudioVolume(this.value);
        settings.saveVolume(this.value);
    };
}

function toAudioVolume(percent) {
    return percent / 100;
}

export function pick() {
    const alarm = document.getElementById("alarm-sound");
    const alarmUrl = document.getElementById("alarm-url");
    let sounds = alarmUrl.value.trim().split("\n");
    alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
    alarm.load();
}

export function play() {
    const alarm = document.getElementById("alarm-sound");
    alarm.play();
}