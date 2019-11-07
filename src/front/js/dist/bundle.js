(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.turnOn = turnOn;
exports.turnOff = turnOff;

function turnOn() {
  var container = document.getElementById("container");
  container.classList.remove("counting");
  container.classList.add("counting");
}

function turnOff() {
  var container = document.getElementById("container");
  container.classList.remove("counting");
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTimeLeft = displayTimeLeft;
exports.appTitle = void 0;

var human_readable = require("./human_readable_time");

var appTitle = "Mob Time";
exports.appTitle = appTitle;

function displayTimeLeft(timerStatus) {
  document.title = toPageTitle(timerStatus.timeLeftInMillis);
  updateTheCircleText(timerStatus.timeLeftInMillis);
  displayOnCircle(timerStatus);
}

function toPageTitle(time) {
  if (time === 0) {
    return appTitle;
  } else {
    return toHumanReadableString(time) + " - " + appTitle;
  }
}

function updateTheCircleText(time) {
  var controls = document.getElementById("control-icons");

  if (time === 0) {
    controls.innerText = "\u25B6";
  } else {
    controls.innerText = "\u25A0";
  }

  var timeLeft = document.getElementById("time-left");
  timeLeft.innerText = toHumanReadableString(time);
}

function toHumanReadableString(ms) {
  var secondCountingMode = document.getElementById("second-counting-mode").checked;

  if (secondCountingMode) {
    return human_readable.extended_format(ms);
  }

  return human_readable.simple_format(ms);
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

},{"./human_readable_time":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simple_format = simple_format;
exports.extended_format = extended_format;

function simple_format(milliseconds) {
  var seconds = toSeconds(milliseconds);

  if (seconds >= 60) {
    return "".concat(Math.round(seconds / 60), " min");
  }

  return seconds + " s";
}

function extended_format(milliseconds) {
  var seconds = toSeconds(milliseconds);
  var human_readable = "";

  if (seconds >= 60) {
    human_readable += "".concat(Math.floor(seconds / 60), " min");
  }

  return "".concat(human_readable, " ").concat(seconds % 60, " s");
}

function toSeconds(milliseconds) {
  return Math.round(milliseconds / 1000);
}

},{}],4:[function(require,module,exports){
"use strict";

var sound = require("./sound");

var display = require("./display");

var countDownMode = require("./countDownMode");

var mobTimer = require("./mobTimer");

var durationByPerson = document.getElementById("minutes-by-person");
var mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(function () {
  return mobTimer.passTimeLeftTo(update);
}, 100);
sound.init();

function update(timerStatus) {
  if (timerStatus.lengthInMinutes === 0) {
    countDownMode.turnOff();
    mobInProgress = false;
  } else if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
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


document.forms.container.onsubmit = function (event) {
  event.preventDefault();

  if (mobInProgress) {
    amplitude.getInstance().logEvent('STOP_MOB');
    mobTimer.stop(update);
  } else {
    var duration = {
      minutes: durationByPerson.value
    };
    amplitude.getInstance().logEvent('START_MOB');
    mobTimer.startMobTurn(duration, update);
  }
};

},{"./countDownMode":1,"./display":2,"./mobTimer":5,"./sound":7}],5:[function(require,module,exports){
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

function startMobTurn(duration, callBack) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callBack(JSON.parse(this.responseText));
    }
  };

  xhttp.open("POST", "/start?lengthInMinutes=" + duration.minutes, true);
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.volume = volume;
exports.saveVolume = saveVolume;

function volume() {
  var volume = document.cookie.split("=")[1];
  if (volume) return volume;else return 100;
}

function saveVolume(value) {
  document.cookie = "mobTimeVolume=" + value;
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.pick = pick;
exports.play = play;

var settings = require("./settings");

function init() {
  var alarm = document.getElementById("alarm-sound");
  var volume = document.getElementById("volume");
  volume.value = settings.volume();
  alarm.volume = toAudioVolume(volume.value);

  volume.oninput = function () {
    alarm.volume = toAudioVolume(this.value);
    settings.saveVolume(this.value);
  };
}

function toAudioVolume(percent) {
  return percent / 100;
}

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

},{"./settings":6}]},{},[4]);
