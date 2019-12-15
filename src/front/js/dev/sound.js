let settings = require("./spi/settings");
const events = require("./events").events;
const alarm = document.getElementById("alarm-sound");

export function init() {
    const volume = document.getElementById("volume");
    volume.value = settings.volume();
    alarm.volume = toAudioVolume(volume.value);

    volume.oninput = function () {
        alarm.volume = toAudioVolume(this.value);
        settings.saveVolume(this.value);
    };
}

document.addEventListener(events.TURN_ENDED, function() {
    document.getElementById("alarm-sound").play();
});
document.addEventListener(events.TURN_STARTED, function() {
    const alarmUrl = document.getElementById("alarm-url");
    let sounds = alarmUrl.value.trim().split("\n");
    alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
    alarm.load();
});

function toAudioVolume(percent) {
    return percent / 100;
}

export function isPlaying() {
    return !alarm.ended;
}
