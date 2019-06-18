(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var appTitle = "Mob Time";
var alarm = document.getElementById("alarm-sound");
var alarmUrl = document.getElementById("alarm-url");
var timeLeft = document.getElementById("start-pause");
var minutesByPerson = document.getElementById("minutes-by-person");
var container = document.getElementById("container");
var timeLeftResponse = undefined;

function startCountdown() {
  resetTimeLeftAsync();
  var sounds = alarmUrl.value.trim().split("\n");
  var chozenSound = sounds[Math.floor(Math.random() * sounds.length)];
  alarm.children[0].src = chozenSound;
  alarm.load();
  container.classList.remove("counting");
  container.classList.add("counting");
  document.getElementsByTagName("h1")[0].innerText = "En cours";
  updateTimeLeftAsync();
  var interval = setInterval(function () {
    if (timeLeftResponse.minutes <= 0 && timeLeftResponse.seconds <= 0) {
      alarm.play();
      console.log(chozenSound);
      clearInterval(interval);
      container.classList.remove("counting");
      document.getElementsByTagName("h1")[0].innerText = appTitle;
    } else {
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
    return "Start";
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
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      timeLeftResponse = JSON.parse(this.responseText);
      display(timeLeftResponse);
    }
  };

  xhttp.open("GET", "/timeLeft", true);
  xhttp.send();
}

function resetTimeLeftAsync() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/start?lengthInMinutes=" + minutesByPerson.value, true);
  xhttp.send();
}

document.forms.container.onsubmit = function (event) {
  event.preventDefault();
  startCountdown();
};

},{}]},{},[1]);
