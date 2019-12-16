(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

(function (e, t) {
  var n = e.amplitude || {
    _q: [],
    _iq: {}
  };
  var r = t.createElement("script");
  r.type = "text/javascript";
  r.integrity = "sha384-d/yhnowERvm+7eCU79T/bYjOiMmq4F11ElWYLmt0ktvYEVgqLDazh4+gW9CKMpYW";
  r.crossOrigin = "anonymous";
  r.async = true;
  r.src = "https://cdn.amplitude.com/libs/amplitude-5.2.2-min.gz.js";

  r.onload = function () {
    if (!e.amplitude.runQueuedFunctions) {
      console.log("[Amplitude] Error: could not load SDK");
    }
  };

  var i = t.getElementsByTagName("script")[0];
  i.parentNode.insertBefore(r, i);

  function s(e, t) {
    e.prototype[t] = function () {
      this._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));

      return this;
    };
  }

  var o = function o() {
    this._q = [];
    return this;
  };

  var a = ["add", "append", "clearAll", "prepend", "set", "setOnce", "unset"];

  for (var u = 0; u < a.length; u++) {
    s(o, a[u]);
  }

  n.Identify = o;

  var c = function c() {
    this._q = [];
    return this;
  };

  var l = ["setProductId", "setQuantity", "setPrice", "setRevenueType", "setEventProperties"];

  for (var p = 0; p < l.length; p++) {
    s(c, l[p]);
  }

  n.Revenue = c;
  var d = ["init", "logEvent", "logRevenue", "setUserId", "setUserProperties", "setOptOut", "setVersionName", "setDomain", "setDeviceId", "setGlobalUserProperties", "identify", "clearUserProperties", "setGroup", "logRevenueV2", "regenerateDeviceId", "groupIdentify", "onInit", "logEventWithTimestamp", "logEventWithGroups", "setSessionId", "resetSessionId"];

  function v(e) {
    function t(t) {
      e[t] = function () {
        e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
      };
    }

    for (var n = 0; n < d.length; n++) {
      t(d[n]);
    }
  }

  v(n);

  n.getInstance = function (e) {
    e = (!e || e.length === 0 ? "$default_instance" : e).toLowerCase();

    if (!n._iq.hasOwnProperty(e)) {
      n._iq[e] = {
        _q: []
      };
      v(n._iq[e]);
    }

    return n._iq[e];
  };

  e.amplitude = n;
})(window, document);

amplitude.getInstance().init("3fecdc3572189da5ba6c3caab23a486f");

function get() {
  return amplitude;
}

;

},{}],2:[function(require,module,exports){
"use strict";

var events = require("../events").events;

var container = document.getElementById("container");
document.addEventListener(events.TURN_ENDED, turnOff);
document.addEventListener(events.TURN_INTERRUPTED, turnOff);
document.addEventListener(events.TURN_STARTED, turnOn);

function turnOn() {
  container.classList.remove("counting");
  container.classList.add("counting");
}

function turnOff() {
  container.classList.remove("counting");
}

},{"../events":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTimeLeft = displayTimeLeft;
exports.appTitle = void 0;

var human_readable = require("../functions/human_readable_time");

var main_button = require("./mainButton");

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

},{"../functions/human_readable_time":6,"./mainButton":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var sound = require("../sound");

function update(timerStatus, timeFormatter) {
  icon(timerStatus);
  timeLeft(timeFormatter, timerStatus);
  progression(timerStatus);
}

function icon(timerStatus) {
  var controls = document.getElementById("control-icons");
  controls.className = iconClass(timerStatus.timeLeftInMillis);
}

function iconClass(time) {
  if (sound.isPlaying()) {
    return "fas fa-volume-mute";
  }

  if (time === 0) {
    return "fas fa-play";
  }

  return "fas fa-stop";
}

function timeLeft(timeFormatter, timerStatus) {
  var timeLeft = document.getElementById("time-left");
  timeLeft.innerText = timeFormatter(timerStatus.timeLeftInMillis);
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

},{"../sound":8}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwEventFor = throwEventFor;
exports.events = void 0;
var events = {
  TURN_ENDED: 'time ran out',
  TURN_STARTED: 'started turn',
  TURN_INTERRUPTED: 'interrupted turn',
  TIME_PASSED: 'time passed'
};
exports.events = events;

function throwEventFor(timerStatus, mobInProgress) {
  var event = detectFrom(timerStatus, mobInProgress);
  document.dispatchEvent(new Event(event));
  return event;
}

function detectFrom(timerStatus, mobInProgress) {
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";

var sound = require("./sound");

var display = require("./display/display");

require("./display/countDownMode");

var amplitude = require("./amplitude,").get();

var mobTimer = require("./spi/mobTimer");

var eventsModule = require("./events");

var durationByPerson = document.getElementById("minutes-by-person");
var mobInProgress = false;
mobTimer.passTimeLeftTo(update);
setInterval(function () {
  return mobTimer.passTimeLeftTo(update);
}, 100);

function update(timerStatus) {
  eventsModule.throwEventFor(timerStatus, mobInProgress);
  mobInProgress = timerStatus.timeLeftInMillis > 0;
  display.displayTimeLeft(timerStatus);
} // --------------------------------------------
// Sockets
// --------------------------------------------


var socket = io();
socket.on('interrupt mob', function () {
  console.log("Mob interrupted");
}); // --------------------------------------------
// Setup
// --------------------------------------------

sound.init();

document.forms.container.onsubmit = function (event) {
  event.preventDefault();

  if (mobInProgress) {
    amplitude.getInstance().logEvent('STOP_MOB');
    socket.emit("interrupt mob");
    return;
  }

  if (sound.isPlaying()) {
    sound.stop();
    amplitude.getInstance().logEvent('STOP_SOUND');
    return;
  }

  mobTimer.startMobTurn({
    minutes: durationByPerson.value
  }, update);
  amplitude.getInstance().logEvent('START_MOB');
};

},{"./amplitude,":1,"./display/countDownMode":2,"./display/display":3,"./events":5,"./sound":8,"./spi/mobTimer":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.isPlaying = isPlaying;
exports.stop = stop;

var settings = require("./spi/settings");

var events = require("./events").events;

var alarm = document.getElementById("alarm-sound");

function init() {
  var volume = document.getElementById("volume");
  volume.value = settings.volume();
  alarm.volume = toAudioVolume(volume.value);

  volume.oninput = function () {
    alarm.volume = toAudioVolume(this.value);
    settings.saveVolume(this.value);
  };
}

document.addEventListener(events.TURN_ENDED, function () {
  document.getElementById("alarm-sound").play();
});
document.addEventListener(events.TURN_STARTED, function () {
  var alarmUrl = document.getElementById("alarm-url");
  var sounds = alarmUrl.value.trim().split("\n");
  alarm.children[0].src = sounds[Math.floor(Math.random() * sounds.length)];
  alarm.load();
});

function toAudioVolume(percent) {
  return percent / 100;
}

function isPlaying() {
  return !alarm.paused;
}

function stop() {
  alarm.pause();
  alarm.fastSeek(0);
}

},{"./events":5,"./spi/settings":10}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.volume = volume;
exports.saveVolume = saveVolume;

function volume() {
  var _volumeCookie$;

  var volumeCookie = document.cookie.split(";").filter(function (value) {
    return value.match("mobTimeVolume");
  });
  var volume = (_volumeCookie$ = volumeCookie[0]) === null || _volumeCookie$ === void 0 ? void 0 : _volumeCookie$.split("=")[1];
  if (volume) return volume;else return 100;
}

function saveVolume(value) {
  document.cookie = "mobTimeVolume=" + value;
}

},{}]},{},[7]);
