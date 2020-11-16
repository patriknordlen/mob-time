(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = handle;

function handle(data, displayTimeLeftRatio, breakSignal) {
  if (!data.ratio) {
    displayTimeLeftRatio(0);
    return data.state;
  }

  displayTimeLeftRatio(Math.max(0, 1 - data.ratio));

  if (isBreakOver(data) && canSignalBreak(data)) {
    breakSignal();
    return {
      breakSignaled: true
    };
  }

  return {
    breakSignaled: data.state.breakSignaled && isBreakOver(data)
  };
}

function canSignalBreak(data) {
  return !data.state.breakSignaled && !data.turnInProgress;
}

function isBreakOver(data) {
  return data.ratio >= 1;
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var events = require("../events").events;

var circleAnimation = require("../circle-animation");

var core = require("./core");

var circle = document.getElementById("breaks-circle");
var state = {
  breakSignaled: true
};

function handle(evt) {
  state = core.handle({
    "ratio": evt.detail.breaks.ratio,
    "turnInProgress": evt.detail.turn.active,
    "state": state
  }, function (leftRatio) {
    return circleAnimation.progression(circle, leftRatio);
  }, function () {
    new Notification("Time to take a break!");
    alert("Time to take a break!");
  });
}

function setup() {
  document.addEventListener(events.TURN_ENDED, handle);
  document.addEventListener(events.TIME_PASSED, handle);
}

},{"../circle-animation":4,"../events":8,"./core":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;
exports.turnsBeforeBreak = turnsBeforeBreak;

function setup(socket, mobName) {
  var fieldset = document.getElementById("turns-before-break-fieldset");
  var circle = document.getElementById("breaks");
  fieldset.style.display = "block";
  circle.style.display = "block"; // ---------------------------------
  // Turns before break
  // ---------------------------------

  var field = document.getElementById("turns-before-break");

  field.onchange = function () {
    return socket.emit("change turns before break", mobName, field.value);
  };

  socket.on("change turns before break", function (number) {
    return field.value = number;
  });
}

function turnsBeforeBreak() {
  return parseInt(document.getElementById("turns-before-break").value);
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progression = progression;
exports.dasharray = dasharray;

function progression(circle, ratio, dash) {
  if (ratio === 0) {
    circle.style.strokeDashoffset = "0";
  } else {
    dash = dash || dasharray(circle);
    circle.style.strokeDashoffset = dash - dash * ratio + "px";
  }
}

function dasharray(circle) {
  return window.getComputedStyle(circle).getPropertyValue("stroke-dasharray").replace("px", "");
}

},{}],5:[function(require,module,exports){
"use strict";

var events = require("../events").events;

var settings = require("../settings");

var container = document.getElementById("container");
document.addEventListener(events.TURN_ENDED, turnOff);
document.addEventListener(events.TURN_ENDED, showNotification);
document.addEventListener(events.TURN_INTERRUPTED, turnOff);
document.addEventListener(events.TURN_STARTED, turnOn);

function turnOn() {
  container.classList.remove("counting");
  container.classList.add("counting");
}

function turnOff() {
  container.classList.remove("counting");
}

function showNotification(evt) {
  if (evt.detail.breaks.ratio < 1) {
    var notify = new Notification("Turn ended, time to switch!", {
      body: "Next up: " + settings.membersAsArray()[0]
    });
  }
}

},{"../events":8,"../settings":12}],6:[function(require,module,exports){
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

},{"../functions/human_readable_time":9,"../spi/settings":14,"./mainButton":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var sound = require("../sound");

var circleAnimation = require("../circle-animation");

var circle = document.getElementById("countdown-circle");
var dasharray = circleAnimation.dasharray(circle);

function update(timerStatus, timeFormatter) {
  icon(timerStatus);
  timeLeft(timeFormatter, timerStatus);
  circleAnimation.progression(circle, ratio(timerStatus), dasharray);
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

function ratio(timerStatus) {
  if (timerStatus.lengthInMinutes === 0) return 0;
  return timerStatus.timeLeftInMillis / (timerStatus.lengthInMinutes * 60 * 1000);
}

},{"../circle-animation":4,"../sound":13}],8:[function(require,module,exports){
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
  return detectFrom(timerStatus, mobInProgress);
}

function detectFrom(timerStatus, mobInProgress) {
  if (timerStatus.lengthInMinutes === 0 && mobInProgress === true) {
    var _event = events.TURN_INTERRUPTED;
    send(_event, timerStatus, mobInProgress);
    return _event;
  }

  if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
    var _event2 = events.TURN_ENDED;
    send(_event2, timerStatus, mobInProgress);
    return _event2;
  }

  if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
    var _event3 = events.TURN_STARTED;
    send(_event3, timerStatus, mobInProgress);
    return _event3;
  }

  var event = events.TIME_PASSED;
  send(event, timerStatus, mobInProgress);
  return event;
}

function send(event, timerStatus, mobInProgress) {
  document.dispatchEvent(new CustomEvent(event, details(timerStatus, mobInProgress)));
}

function details(timerStatus, mobInProgress) {
  var _timerStatus$breaks;

  return {
    detail: {
      "turn": {
        "active": mobInProgress
      },
      "breaks": {
        "ratio": (_timerStatus$breaks = timerStatus.breaks) === null || _timerStatus$breaks === void 0 ? void 0 : _timerStatus$breaks.ratio
      }
    }
  };
}

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

var sound = require("./sound");

var display = require("./display/display");

require("./display/countDownMode");

var eventsModule = require("./events");

var settings = require("./settings");

var turn = require("./mob/turn");

var breaks = require("./breaks/countdown"); // --------------------------------------------
// Sockets
// --------------------------------------------


var socket = io();
socket.emit("join", mobName); // --------------------------------------------
// Setup
// --------------------------------------------

sound.init();
display.init();

document.forms.container.onsubmit = function (event) {
  event.preventDefault();

  if (Notification.permission != "granted") {
    Notification.requestPermission();
  }

  if (turn.isInProgress()) {
    socket.emit("interrupt mob", mobName);
    return;
  }

  if (sound.isPlaying()) {
    sound.stop();
    return;
  }

  socket.emit("start mob", mobName, settings.minutesByPerson());
};

new ClipboardJS("#share-room", {
  text: function text() {
    return window.location.href;
  }
}).on("success", function () {
  alert("A link to this mob has been copied in your clipboard");
});
breaks.setup();

require("./breaks/settings").setup(socket, mobName);

settings.setupSync(socket, mobName);
socket.on("start mob", function () {
  var notify = new Notification("Turn started", {
    body: settings.membersAsArray()[0] + " started a turn."
  });
});
setInterval(function () {
  return socket.emit("get status", mobName);
}, 500);
socket.on("status", function (data) {
  settings.updateMembers(data.members);
  settings.updateSettingsMembers(data.members);
  eventsModule.throwEventFor(data, turn.isInProgress());
  display.displayTimeLeft(data);
});
window.addEventListener("DOMContentLoaded", function () {
  if (Notification.permission != "granted") {
    var enableNotificationsButton = document.createElement("button");
    enableNotificationsButton.id = "enableNotificationsButton";
    enableNotificationsButton.innerText = "Enable notifications";

    enableNotificationsButton.onclick = function (event) {
      event.preventDefault();
      Notification.requestPermission().then(function () {
        document.getElementById("enableNotifications").innerHTML = "Notifications enabled!";
        setTimeout(function () {
          return document.getElementById("enableNotifications").innerHTML = "";
        }, 3000);
      });
    };

    document.getElementById("enableNotifications").appendChild(enableNotificationsButton);
  }
}, false);

},{"./breaks/countdown":2,"./breaks/settings":3,"./display/countDownMode":5,"./display/display":6,"./events":8,"./mob/turn":11,"./settings":12,"./sound":13}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInProgress = isInProgress;

var events = require("../events").events;

document.addEventListener(events.TURN_STARTED, function () {
  return inProgress = true;
});
document.addEventListener(events.TURN_ENDED, function () {
  return inProgress = false;
});
document.addEventListener(events.TURN_INTERRUPTED, function () {
  return inProgress = false;
});
var inProgress = false;

function isInProgress() {
  return inProgress;
}

},{"../events":8}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSync = setupSync;
exports.minutesByPerson = minutesByPerson;
exports.updateMembers = updateMembers;
exports.updateSettingsMembers = updateSettingsMembers;
exports.membersAsArray = membersAsArray;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var durationByPerson = document.getElementById("minutes-by-person");
var memberList = document.getElementById("memberList");
var members = document.getElementById("members");
var randomize = document.getElementById("randomize");
var syncChanges = false;

function setupSync(socket, mobName) {
  socket.on('change length', function (length) {
    return durationByPerson.value = length;
  });

  durationByPerson.onchange = function () {
    socket.emit("change length", mobName, this.value);
  };

  memberList.onchange = function () {
    if (syncChanges) {
      var memberArray = this.value.split(",");
      socket.emit("change members", mobName, memberArray);
      updateMembers(memberArray);
    }
  };
}

function minutesByPerson() {
  if (mods.includes("fast")) return parseInt(durationByPerson.value) / 60;
  if (mods.includes("faster")) return parseInt(durationByPerson.value) / 600;
  return parseInt(durationByPerson.value);
}

function updateMembers(changedMembers) {
  if (changedMembers != membersAsArray()) {
    members.innerHTML = "";
    var li_ids = ["driver", "navigator", "mobbers"];
    var i_classes = ["fas fa-dharmachakra", "fas fa-drafting-compass", "fas fa-user-secret"];

    for (var index = 0; index < changedMembers.length; index++) {
      var i = document.createElement("i");
      var li = document.createElement("li");

      if (index < li_ids.length) {
        li.id = li_ids[index];
        i.className = i_classes[index];
      } else {
        li.id = li_ids[li_ids.length - 1];
        i.className = i_classes[i_classes.length - 1];
      }

      li.appendChild(i);
      li.append(changedMembers[index]);
      members.appendChild(li);
    }
  }
}

function updateSettingsMembers(changedMembers) {
  if (changedMembers != membersAsArray()) {
    syncChanges = false;
    $('#memberList').tagsinput('removeAll');
    changedMembers.forEach(function (member) {
      $('#memberList').tagsinput('add', member);
    });
    syncChanges = true;
  }
}

function membersAsArray() {
  return memberList.value.split(",");
}

randomize.onclick = function () {
  var mArr = _toConsumableArray($('#memberList').tagsinput('items'));

  for (var i = mArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [mArr[j], mArr[i]];
    mArr[i] = _ref[0];
    mArr[j] = _ref[1];
  }

  updateSettingsMembers(mArr);
  memberList.onchange();
};

window.addEventListener("DOMContentLoaded", function () {
  updateMembers(membersAsArray());
  syncChanges = true;
});

},{}],13:[function(require,module,exports){
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

},{"./events":8,"./spi/settings":14}],14:[function(require,module,exports){
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

},{}]},{},[10]);
