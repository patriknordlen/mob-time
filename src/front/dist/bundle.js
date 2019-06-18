(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var sound = require("./js/sound");

var appTitle = "Mob Time";
var timeLeft = document.getElementById("start-pause");
var minutesByPerson = document.getElementById("minutes-by-person");
var container = document.getElementById("container");
var timeLeftResponse = undefined;

function startCountdown() {
  startMobTurn(minutesByPerson.value, displayTimeLeft);
  sound.pick();
  turnOnCountDownDisplayMode();
  var interval = setInterval(function () {
    getTimeLeft(function (timeLeft) {
      if (timeLeft.millis <= 0) {
        clearInterval(interval);
        sound.play();
        turnOffCountDownDisplayMode();
      } else {
        displayTimeLeft(timeLeft);
      }
    });
  }, 100);
  return false;
}

function startMobTurn(lengthInMinutes, callBack) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      timeLeftResponse = JSON.parse(this.responseText);
      callBack(timeLeftResponse);
    }
  };

  xhttp.open("POST", "/start?lengthInMinutes=" + lengthInMinutes, true);
  xhttp.send();
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

function getTimeLeft(callback) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      timeLeftResponse = JSON.parse(this.responseText);
      callback(timeLeftResponse);
    }
  };

  xhttp.open("GET", "/timeLeft", true);
  xhttp.send();
} // --------------------------------------------
// Display Time
// --------------------------------------------


function displayTimeLeft(time) {
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
    return "Start";
  }

  return toHumanReadableString(time);
}

function toHumanReadableString(time) {
  var minutes = time.millis / 1000 / 60;

  if (time.minutes <= 0) {
    return time.seconds + " s";
  }

  return Math.round(minutes) + " min";
} // --------------------------------------------
// Setup
// --------------------------------------------


document.forms.container.onsubmit = function (event) {
  event.preventDefault();
  startCountdown();
};

},{"./sound":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
