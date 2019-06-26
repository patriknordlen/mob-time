(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.turnOn = turnOn;
exports.turnOff = turnOff;

var display = require("./display");

function turnOn() {
  var container = document.getElementById("container");
  container.classList.remove("counting");
  container.classList.add("counting");
}

function turnOff() {
  var container = document.getElementById("container");
  container.classList.remove("counting");
}

},{"./display":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTimeLeft = displayTimeLeft;
exports.appTitle = void 0;
var appTitle = "Mob Time";
exports.appTitle = appTitle;

function displayTimeLeft(timerStatus) {
  document.title = toPageTitle(timerStatus.timeLeftInMillis);
  toButtonValue(timerStatus.timeLeftInMillis);
  displayOnCircle(timerStatus);
}

function toPageTitle(time) {
  if (time === 0) {
    return appTitle;
  } else {
    return toHumanReadableString(time) + " - " + appTitle;
  }
}

function toButtonValue(time) {
  var controls = document.getElementById("control-icons");

  if (time === 0) {
    controls.innerText = "\u25B6";
  } else {
    controls.innerText = "\u25A0";
  }

  var timeLeft = document.getElementById("time-left");
  timeLeft.innerText = toHumanReadableString(time);
}

function toHumanReadableString(time) {
  var seconds = time / 1000;
  var minutes = seconds / 60;

  if (Math.floor(minutes) === 0) {
    return Math.round(seconds) + " s";
  }

  return Math.round(minutes) + " min";
}

function displayOnCircle(timerStatus) {
  var circle = document.getElementById("countdown-circle");

  if (timerStatus.timeLeftInMillis === 0) {
    circle.style.strokeDashoffset = 0;
  } else {
    var dasharray = 584;
    circle.style.strokeDashoffset = dasharray - dasharray * (timerStatus.timeLeftInMillis / (timerStatus.lengthInMinutes * 60 * 1000)) + "px";
  }
}

},{}],3:[function(require,module,exports){
"use strict";

var sound = require("./sound");

var display = require("./display");

var countDownMode = require("./countDownMode");

var mobTimer = require("./mobTimer");

var minutesByPerson = document.getElementById("minutes-by-person");
var mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(function () {
  return mobTimer.passTimeLeftTo(update);
}, 100);

function update(timerStatus) {
  if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
    sound.play();
    countDownMode.turnOff();
    mobInProgress = false;
  } else if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
    sound.pick();
    countDownMode.turnOn();
    mobInProgress = true;
  }

  display.displayTimeLeft(timerStatus);
} // --------------------------------------------
// Setup
// --------------------------------------------


function preventSoundFromPlaying() {
  countDownMode.turnOff();
  mobInProgress = false;
}

document.forms.container.onsubmit = function (event) {
  event.preventDefault();

  if (mobInProgress) {
    mobTimer.stop(update);
    preventSoundFromPlaying();
  } else {
    mobTimer.startMobTurn(minutesByPerson.value, update);
  }
};

},{"./countDownMode":1,"./display":2,"./mobTimer":4,"./sound":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = stop;
exports.startMobTurn = startMobTurn;
exports.passTimeLeftTo = passTimeLeftTo;

function stop(callBack) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callBack(JSON.parse(this.responseText));
    }
  };

  xhttp.open("POST", "/stop", true);
  xhttp.send();
}

function startMobTurn(lengthInMinutes, callBack) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callBack(JSON.parse(this.responseText));
    }
  };

  xhttp.open("POST", "/start?lengthInMinutes=" + lengthInMinutes, true);
  xhttp.send();
}

function passTimeLeftTo(callback) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callback(JSON.parse(this.responseText));
    }
  };

  xhttp.open("GET", "/status", true);
  xhttp.send();
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = pick;
exports.play = play;

function pick() {
  var alarm = document.getElementById("alarm-sound");
  var alarmUrl = document.getElementById("alarm-url");
  var sounds = alarmUrl.value.trim().split("\n");
  alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
  alarm.load();
}

function play() {
  var alarm = document.getElementById("alarm-sound");
  alarm.play();
}

},{}]},{},[3]);
