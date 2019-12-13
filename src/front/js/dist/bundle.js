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

var human_readable = require("../functions/human_readable_time");

var main_button = require("./main_button");

var appTitle = "Mob Time";
exports.appTitle = appTitle;

function displayTimeLeft(timerStatus) {
  document.title = toPageTitle(timerStatus.timeLeftInMillis, timeFormatter());
  main_button.update(timerStatus, timeFormatter());
}

function toPageTitle(time, timeFormatter) {
  if (time === 0) return appTitle;
  return timeFormatter(time) + " - " + appTitle;
}

function timeFormatter() {
  if (document.getElementById("second-counting-mode").checked) {
    return human_readable.extended_format;
  }

  return human_readable.simple_format;
}

},{"../functions/human_readable_time":4,"./main_button":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

function update(timerStatus, timeFormatter) {
  text(timerStatus.timeLeftInMillis, timeFormatter);
  progression(timerStatus);
}

function text(time, formatter) {
  var controls = document.getElementById("control-icons");

  if (time === 0) {
    controls.innerText = "\u25B6";
  } else {
    controls.innerText = "\u25A0";
  }

  var timeLeft = document.getElementById("time-left");
  timeLeft.innerText = formatter(time);
}

function progression(timerStatus) {
  var circle = document.getElementById("countdown-circle");

  if (timerStatus.timeLeftInMillis === 0) {
    circle.style.strokeDashoffset = 0;
  } else {
    var dasharray = 584;
    circle.style.strokeDashoffset = dasharray - dasharray * (timerStatus.timeLeftInMillis / (timerStatus.lengthInMinutes * 60 * 1000)) + "px";
  }
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

var sound = require("./sound");

var display = require("./display/display");

var countDownMode = require("./display/countDownMode");

var mobTimer = require("./spi/mobTimer");

var durationByPerson = document.getElementById("minutes-by-person");
var mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(function () {
  return mobTimer.passTimeLeftTo(update);
}, 100);
sound.init();
var events = {
  TURN_ENDED: 'time ran out',
  TURN_STARTED: 'started turn',
  TURN_INTERRUPTED: 'interrupted turn',
  TIME_PASSED: 'time passed'
};

function update(timerStatus) {
  var event = detectEvent(timerStatus);
  handle(event);
  mobInProgress = timerStatus.timeLeftInMillis > 0;
  display.displayTimeLeft(timerStatus);
}

function detectEvent(timerStatus) {
  var event = events.TIME_PASSED;

  if (timerStatus.lengthInMinutes === 0) {
    event = events.TURN_INTERRUPTED;
  } else if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
    event = events.TURN_ENDED;
  } else if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
    event = events.TURN_STARTED;
  }

  return event;
}

function handle(event) {
  switch (event) {
    case events.TURN_ENDED:
      sound.play();
      countDownMode.turnOff();
      break;

    case events.TURN_STARTED:
      sound.pick();
      countDownMode.turnOn();
      break;

    case events.TURN_INTERRUPTED:
      countDownMode.turnOff();
      break;

    case events.TIME_PASSED:
      break;

    default:
      throw 'unknown event: ' + event;
  }
} // --------------------------------------------
// Setup
// --------------------------------------------


document.forms.container.onsubmit = function (event) {
  event.preventDefault();

  if (mobInProgress) {
    amplitude.getInstance().logEvent('STOP_MOB');
    mobTimer.stop(update);
    return;
  }

  if (sound.isPlaying()) {// todo
  }

  var duration = {
    minutes: durationByPerson.value
  };
  amplitude.getInstance().logEvent('START_MOB');
  mobTimer.startMobTurn(duration, update);
}; // --------------------------------------------
// Sockets
// --------------------------------------------


var socket = io();

},{"./display/countDownMode":1,"./display/display":2,"./sound":6,"./spi/mobTimer":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.pick = pick;
exports.play = play;
exports.isPlaying = isPlaying;

var settings = require("./spi/settings");

function init() {
  var alarm = audioElement();
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
  var alarm = audioElement();
  var alarmUrl = document.getElementById("alarm-url");
  var sounds = alarmUrl.value.trim().split("\n");
  alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
  alarm.load();
}

function play() {
  var alarm = audioElement();
  alarm.play();
}

function isPlaying() {
  return !audioElement().ended;
}

function audioElement() {
  return document.getElementById("alarm-sound");
}

},{"./spi/settings":8}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}]},{},[5]);
