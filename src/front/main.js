const appTitle = "Mob Time";
const alarm = document.getElementById("alarm-sound");
const alarmUrl = document.getElementById("alarm-url");
const timeLeft = document.getElementById("start-pause");
const minutesByPerson = document.getElementById("minutes-by-person");
const container = document.getElementById("container");

function startCountdown() {
    let sounds = alarmUrl.value.trim().split("\n");
    let chozenSound = sounds[Math.floor(Math.random()*sounds.length)]
    alarm.children[0].src = chozenSound;
    alarm.load();

    container.classList.remove("counting");
    container.classList.add("counting");
    document.getElementsByTagName("h1")[0].innerText = "En cours";
    let timeLeftInMinutes = minutesByPerson.value;
    display(timeLeftInMinutes);
    let interval = setInterval(function () {
        timeLeftInMinutes--;
        if (timeLeftInMinutes <= 0) {
            alarm.play();
            console.log(chozenSound);
            clearInterval(interval);
            container.classList.remove("counting");
            document.getElementsByTagName("h1")[0].innerText = appTitle;
        }
        display(timeLeftInMinutes)
    }, toMilliseconds(1));

    return false;
}

function display(time) {
    document.title = toPageTitle(time);
    timeLeft.innerText = toButtonValue(time);
}

function toButtonValue(time) {
    if (time <= 0) {
        return "Start"
    }
    return toHumanReadableString(time);
}

function toPageTitle(time) {
    if (time <= 0) {
        return appTitle;
    } else {
        return toHumanReadableString(time) + " - " + appTitle;
    }
}

function toHumanReadableString(time) {
    return time + " min";

}

function toMilliseconds(minutes) {
    return minutes * 1000 * 60;
}