export const events = {
    TURN_ENDED: 'time ran out',
    TURN_STARTED: 'started turn',
    TURN_INTERRUPTED: 'interrupted turn',
    TIME_PASSED: 'time passed'
};

export function throwEventFor(timerStatus, mobInProgress) {
    let event = detectFrom(timerStatus, mobInProgress);
    document.dispatchEvent(new Event(event));
    return event;
}

function detectFrom(timerStatus, mobInProgress) {
    let event = events.TIME_PASSED;
    if (timerStatus.lengthInMinutes === 0) {
        event = events.TURN_INTERRUPTED;
    } else if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
        event = events.TURN_ENDED;
    } else if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
        event = events.TURN_STARTED;
    }
    return event;
}
