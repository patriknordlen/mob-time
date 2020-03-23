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
exports.init = init;
exports.displayTimeLeft = displayTimeLeft;
exports.appTitle = void 0;

var human_readable = require("../functions/human_readable_time");

var main_button = require("./mainButton");

var settings = require("../spi/settings");

var countingMode = document.getElementById("second-counting-mode");

function init() {
  countingMode.value = settings.displaySeconds();

  countingMode.onchange = function () {
    settings.saveDisplaySeconds(this.checked);
  };
}

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
  return countingMode.checked ? human_readable.extended_format : human_readable.simple_format;
}

},{"../functions/human_readable_time":6,"../spi/settings":10,"./mainButton":4}],4:[function(require,module,exports){
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

var mobName = window.location.pathname.split("/")[1];
var durationByPerson = document.getElementById("minutes-by-person");
var mobInProgress = false;
mobTimer.timeLeftIn(mobName, update);
setInterval(function () {
  return mobTimer.timeLeftIn(mobName, update);
}, 100);

function update(timerStatus) {
  eventsModule.throwEventFor(timerStatus, mobInProgress);
  mobInProgress = timerStatus.timeLeftInMillis > 0;
  display.displayTimeLeft(timerStatus);
} // --------------------------------------------
// Sockets
// --------------------------------------------


var socket = io();
socket.emit("join", mobName);
socket.on('interrupt mob', function () {
  console.log("Mob interrupted");
});
socket.on('change length', function (length) {
  return document.getElementById("minutes-by-person").value = length;
}); // --------------------------------------------
// Setup
// --------------------------------------------

sound.init();
display.init();

document.forms.container.onsubmit = function (event) {
  event.preventDefault();

  if (mobInProgress) {
    amplitude.getInstance().logEvent('STOP_MOB');
    socket.emit("interrupt mob", mobName);
    return;
  }

  if (sound.isPlaying()) {
    sound.stop();
    amplitude.getInstance().logEvent('STOP_SOUND');
    return;
  }

  socket.emit("start mob", mobName, durationByPerson.value);
  amplitude.getInstance().logEvent('START_MOB');
};

document.getElementById("minutes-by-person").onchange = function () {
  socket.emit("change length", mobName, this.value);
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
var volume = document.getElementById("volume");
var alarmUrl = document.getElementById("alarm-url");

function init() {
  volume.value = settings.volume();
  alarm.volume = toAudioVolume(volume.value);
  var musics = settings.musics();

  if (musics) {
    alarmUrl.value = musics;
  }

  volume.oninput = function () {
    alarm.volume = toAudioVolume(this.value);
    settings.saveVolume(this.value);
  };

  alarmUrl.onchange = function () {
    settings.saveMusics(this.value);
  };
}

document.addEventListener(events.TURN_ENDED, function () {
  document.getElementById("alarm-sound").play();
});
document.addEventListener(events.TURN_STARTED, function () {
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
exports.timeLeftIn = timeLeftIn;

function timeLeftIn(name, callback) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callback(JSON.parse(this.responseText));
    }
  };

  xhttp.open("GET", "/" + name + "/status", true);
  xhttp.send();
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.volume = volume;
exports.saveVolume = saveVolume;
exports.musics = musics;
exports.saveMusics = saveMusics;
exports.displaySeconds = displaySeconds;
exports.saveDisplaySeconds = saveDisplaySeconds;

function volume() {
  var volume = get("mobTimeVolume");
  if (volume) return volume;else return 100;
}

function saveVolume(value) {
  save("mobTimeVolume", value);
}

function musics() {
  var musics = get("musics");

  if (musics) {
    return musics.replace(/\\n/g, "\n");
  }

  return null;
}

function saveMusics(value) {
  save("musics", value.replace(/\n/g, "\\n"));
}

function displaySeconds() {
  return get("displaySeconds") === "true";
}

function saveDisplaySeconds(value) {
  save("displaySeconds", value);
}

function get(key) {
  var _volumeCookie$;

  var volumeCookie = document.cookie.split(";").filter(function (value) {
    return value.match(key);
  });
  return (_volumeCookie$ = volumeCookie[0]) === null || _volumeCookie$ === void 0 ? void 0 : _volumeCookie$.split("=")[1];
}

function save(key, value) {
  document.cookie = "".concat(key, "=").concat(value, "; expires=").concat(expirationDate().toUTCString());
}

var expirationDate = function expirationDate() {
  return new Date(new Date().getTime() + inMilliseconds(1));
};

var inMilliseconds = function inMilliseconds(year) {
  return year * 365 * 24 * 60 * 60 * 1000;
};

},{}]},{},[7]);
