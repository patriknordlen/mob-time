const appTitle = "Mob Time";
const alarm = document.getElementById("alarm-sound");
const alarmUrl = document.getElementById("alarm-url");
const timeLeft = document.getElementById("start-pause");
const minutesByPerson = document.getElementById("minutes-by-person");
const container = document.getElementById("container");

let timeLeftResponse = undefined;

function startCountdown() {
	startMobTurn(minutesByPerson.value, display);
    chooseSound();
    turnOnCountDownDisplayMode();
    let interval = setInterval(function () {
        if (timeLeftResponse.minutes <= 0 && timeLeftResponse.seconds <= 0) {
            clearInterval(interval);
            alarm.play();
            turnOffCountDownDisplayMode();
        }
        else {
        	updateTimeLeftAsync();
        }
    }, 100);

    return false;
}

function startMobTurn(lengthInMinutes, callBack) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            timeLeftResponse = JSON.parse(this.responseText);
            callBack(timeLeftResponse);
        }
    };
    xhttp.open("POST", "/start?lengthInMinutes=" + lengthInMinutes, true);
    xhttp.send();
}

function chooseSound() {
    let sounds = alarmUrl.value.trim().split("\n");
    alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
    alarm.load();
}

function turnOnCountDownDisplayMode() {
    container.classList.remove("counting");
    container.classList.add("counting");
    document.getElementsByTagName("h1")[0].innerText = "En cours";
}

function turnOffCountDownDisplayMode() {
    container.classList.remove("counting");
    document.getElementsByTagName("h1")[0].innerText = appTitle;
}

function updateTimeLeftAsync() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			timeLeftResponse = JSON.parse(this.responseText);
			display(timeLeftResponse);
		}
	};
	xhttp.open("GET", "/timeLeft", true);
    xhttp.send();
}

// --------------------------------------------
// Display Time
// --------------------------------------------

function display(time) {
    document.title = toPageTitle(time);
    timeLeft.innerText = toButtonValue(time);
}

function toPageTitle(time) {
    if (time.millis <= 0) {
        return appTitle;
    } else {
        return toHumanReadableString(time) + " - " + appTitle;
    }
}

function toButtonValue(time) {
    if (time.millis <= 0) {
        return "Start"
    }
    return toHumanReadableString(time);
}

function toHumanReadableString(time) {
    let minutes = time.millis / 1000 / 60;
    if (time.minutes <= 0) {
        return time.seconds + " s";
    }
    return Math.round(minutes) + "min";
}

// --------------------------------------------
// Setup
// --------------------------------------------

document.forms.container.onsubmit = function (event) {
   event.preventDefault();
   startCountdown();
};
