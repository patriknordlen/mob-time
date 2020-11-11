const events = require("../events").events;
const circleAnimation = require("../circle-animation");
const core = require("./core");
const circle = document.getElementById("breaks-circle");

let state = {breakSignaled: true};

function handle(evt) {
    state = core.handle(
        {"ratio": evt.detail.breaks.ratio, "turnInProgress": evt.detail.turn.active, "state": state},
        leftRatio => circleAnimation.progression(circle, leftRatio),
        () => { new Notification("Time to take a break!"); alert("Time to take a break!"); }
    );
}

export function setup() {
    document.addEventListener(events.TURN_ENDED, handle);
    document.addEventListener(events.TIME_PASSED, handle);
}
