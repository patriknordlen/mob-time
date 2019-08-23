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
    volume.onchange = function() {
        alarm.volume = this.value / 100;
    };
}

export function play() {
    const alarm = document.getElementById("alarm-sound");
    alarm.play();
}