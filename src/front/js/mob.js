const sound = require("./sound");
const display = require("./display/display");
require("./display/countDownMode");
const mobTimer = require("./spi/mobTimer");
const eventsModule = require("./events");
const settings = require("./settings");
const turn = require("./mob/turn");
const pomodoro = require("./pomodoro/countdown");

mobTimer.timeLeftIn(mobName, update);
setInterval(() => mobTimer.timeLeftIn(mobName, update), 100);

function update(timerStatus) {
    eventsModule.throwEventFor(timerStatus, turn.isInProgress());
    display.displayTimeLeft(timerStatus);
}

// --------------------------------------------
// Sockets
// --------------------------------------------
let socket = io();
socket.emit("join", mobName);

// --------------------------------------------
// Setup
// --------------------------------------------
sound.init();
display.init();
document.forms.container.onsubmit = function (event) {
    event.preventDefault();

    if (Notification.permission != 'granted') {
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
    socket.emit("start mob", mobName, settings.membersAsArray(), settings.minutesByPerson());
};

new ClipboardJS("#share-room", {
    text: () => window.location.href
}).on('success', () => {
    alert('A link to this mob has been copied in your clipboard');
});

pomodoro.setup();
require("./pomodoro/settings").setup(socket, mobName);
settings.setupSync(socket, mobName);

socket.on("start mob", function(member) {
    if (Notification.permission != 'granted') {
        Notification.requestPermission();
    }

    var notify = new Notification("Turn started", { body: member + " started their turn."});
});