const appTitle = "Mob Time";
const alarm = document.getElementById("alarm-sound");
const alarmUrl = document.getElementById("alarm-url");
const timeLeft = document.getElementById("start-pause");
const minutesByPerson = document.getElementById("minutes-by-person");
const container = document.getElementById("container");

let timeLeftResponse = undefined;

function startCountdown() {
	resetTimeLeftAsync();
	
	let sounds = alarmUrl.value.trim().split("\n");
    let chozenSound = sounds[Math.floor(Math.random()*sounds.length)]
    alarm.children[0].src = chozenSound;
    alarm.load();

    container.classList.remove("counting");
    container.classList.add("counting");
    document.getElementsByTagName("h1")[0].innerText = "En cours";

	updateTimeLeftAsync();
    let interval = setInterval(function () {
        if (timeLeftResponse.minutes <= 0 && timeLeftResponse.seconds <= 0) {
            alarm.play();
            console.log(chozenSound);
            clearInterval(interval);
            container.classList.remove("counting");
            document.getElementsByTagName("h1")[0].innerText = appTitle;
        }
        else {
        	updateTimeLeftAsync();
        }
    }, 100);

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
    return time.minutes + "min " + time.seconds;

}

function updateTimeLeftAsync() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			timeLeftResponse = JSON.parse(this.responseText);
			display(timeLeftResponse);
		}
	};
	xhttp.open("GET", "/timeLeft", true);
    xhttp.send();
}

function resetTimeLeftAsync() {
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/start?lengthInMinutes=" + minutesByPerson.value, true);
    xhttp.send();
}

