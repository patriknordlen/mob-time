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
    if (timerStatus.lengthInMinutes === 0 && mobInProgress === true) {
        console.log(events.TURN_INTERRUPTED);
        return events.TURN_INTERRUPTED;
    }
    if (timerStatus.timeLeftInMillis === 0 && mobInProgress === true) {
        console.log(events.TURN_ENDED);
        return events.TURN_ENDED;
    }
    if (timerStatus.timeLeftInMillis > 0 && mobInProgress === false) {
        console.log(events.TURN_STARTED);
        return  events.TURN_STARTED;
    }
    return events.TIME_PASSED;
}
