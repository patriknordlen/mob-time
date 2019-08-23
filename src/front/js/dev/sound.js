export function pick() {
    const alarm = document.getElementById("alarm-sound");
    const alarmUrl = document.getElementById("alarm-url");
    let sounds = alarmUrl.value.trim().split("\n");
    alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
    alarm.load();
}

export function init() {
    const alarm = document.getElementById("alarm-sound");
    const volume = document.getElementById("volume");

    volume.value = document.cookie.split("=")[1];
    alarm.volume = volume.value / 100;

    volume.oninput = function() {
        alarm.volume = this.value / 100;
        document.cookie = "mobTimeVolume=" + this.value;
    };
}

export function play() {
    const alarm = document.getElementById("alarm-sound");
    alarm.play();
}