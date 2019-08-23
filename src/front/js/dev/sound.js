export function init() {
    const alarm = document.getElementById("alarm-sound");
    const volume = document.getElementById("volume");

    volume.value = readVolume();
    alarm.volume = toAudioVolume(volume.value);

    volume.oninput = function () {
        alarm.volume = toAudioVolume(this.value);
        saveVolume(this.value);
    };
}

function toAudioVolume(percent) {
    return percent / 100;
}

function readVolume() {
    const volume = document.cookie.split("=")[1];
    if (volume)
        return volume;
    else
        return 100;
}

function saveVolume() {
    document.cookie = "mobTimeVolume=" + this.value;
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